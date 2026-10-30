# HTTP freshness публичных документов

Применено **31 октября 2026, 01:33 МСК**. Изменён только активный регулярный файл `/etc/nginx/sites-enabled/kuhnitver.ru`; выполнен reload nginx. Приложение не пересобиралось и не перезапускалось.

Протокол: [nginx-freshness-acceptance.json](nginx-freshness-acceptance.json). Фактический патч: [nginx-freshness-applied.diff](nginx-freshness-applied.diff). Изолированная проверка nginx: [nginx-freshness-fixture.json](nginx-freshness-fixture.json).

## Наблюдение и изменение

До изменения публичные SSG HTML, YML и llms.txt получали от Next.js `s-maxage=31536000`. У robots.txt и sitemap.xml исходная политика уже требовала повторной проверки, но общий nginx-regex добавлял второй заголовок с суточным сроком. RSS имел собственный срок в час.

Для публичного SSG HTML и пяти точных адресов `robots.txt`, `sitemap.xml`, `blog.rss`, `uslugi.yml`, `llms.txt` теперь возвращается один `Cache-Control: no-cache` и прошедший Expires. Это позволяет хранить представление с обязательной проверкой перед повторным использованием; внутренний SSG-кэш Next остаётся включён.

Используется `expires` с условным значением: `-1` для целевых публичных ответов и `off` для остальных. Отдельный обработчик пяти фидов расположен перед общим regex расширений. Правило HTML 304 проверяет маркер prerender, поскольку фактический ответ Next 16.1.6 на условный запрос не содержит Content-Type. При обновлении Next эту проверку нужно повторить.

Ответы с private/no-store/уже no-cache, Set-Cookie, RSC, Next Router state/prefetch/segment-prefetch и `_rsc` сохраняют исходную политику. Другие методы и статусы также исключены. Обычные HTML-prefetch с Purpose/Sec-Purpose получают ту же freshness, что обычный HTML; новые Vary не добавлялись. Это сохраняет согласованность вариантов в общих кэшах.

## Проверка после применения

| Проверка | Результат |
|---|---|
| HTML из sitemap | 36 из 36 — 200, один no-cache |
| Условные GET главной и контактов | 2 ответа 304 без Content-Type, один no-cache, ETag сохранён |
| Пять фидов | Все 200, один no-cache, содержимое и Content-Type сохранены |
| HEAD | 7 проверок пройдены |
| RSC, Next-prefetch, segment-prefetch, Router state, private 404 | Исходные Cache-Control, Content-Type, Vary, ETag сохранены |
| Purpose/Sec-Purpose HTML | 200 и 304 с no-cache, исходный Vary сохранён |
| Хешированные CSS/JS | По одному прежнему `public, max-age=31536000, immutable` |
| Неверсионированный шрифт и изображение | Заголовки и содержимое сохранены |
| Capacity API | Include и файл snippet неизменны побайтово |
| Неактивный sites-available | Не изменён |
| Приложение | Каталог release и PID не изменились |

Пять фидов сейчас не предоставляют ETag/Last-Modified, поэтому их реальный 304 неприменим. В изолированном nginx проверены 304 всех пяти адресов с синтетическими валидаторами.

На установленном nginx 1.24.0 выполнены **39 изолированных HTTP-проверок**: включая private/no-store во втором Cache-Control, сохранение нескольких защищённых заголовков при `expires off`, объединение публичных Cache-Control в один no-cache, 304 без Content-Type, RSC/Router-guards и generic HTML-prefetch. Отдельно прошли [50 локальных проверок условий map](nginx-freshness-predicates.json). Изолированные nginx и HTTP-origin остановлены; их доступ ограничивался loopback, рабочие маршруты не подменялись. Заявки и запросы к аналитическим сервисам не отправлялись.

## Защита и состояние

- До: `7d573f3a1b65e66143ee33bf7414ce42f4dacb57d99b0370647928e4676acf89`.
- После: `07994f8873e51a1e39c59c8ebcdd0e632f12cb889947bbcc210d576fef6ca8a3`.
- Отдельная резервная копия с правами `0600`: `/var/tmp/kuhnitver-nginx-freshness-20261031-07994f8873e5/nginx-freshness-active-before.conf`.
- `nginx -t` прошёл; готовность проверялась по HTTP-заголовкам до появления новых workers. Понадобилось два опроса. Откат не потребовался.
- Не менялись приложение, proxy_cache, неактивный конфиг, capacity snippet и сторонние экземпляры nginx.

Сохранённый diff не содержит контекстных строк; при его повторном применении через Git требуется `git apply --unidiff-zero`. Перед любым повторным применением нужен контроль исходного SHA.

Эта настройка определяет freshness будущих HTTP-ответов. Она не доказывает причину старых сведений во внешнем индексе и не очищает чужие кэши или поисковые индексы.

Официальные основания: [nginx map](https://nginx.org/en/docs/http/ngx_http_map_module.html), [nginx expires](https://nginx.org/en/docs/http/ngx_http_headers_module.html#expires), [реализация nginx 1.24](https://github.com/nginx/nginx/blob/release-1.24.0/src/http/modules/ngx_http_headers_filter_module.c), [Next.js: self-hosted caching](https://nextjs.org/docs/app/guides/self-hosting#caching-and-isr).
