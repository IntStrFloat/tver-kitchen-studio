# Отдельный журнал кандидатов в роботы

Включён **31.10.2026, 02:03:32 МСК** в собственном HTTPS apex-vhost Kuhnitver. Изменён активный регулярный `/etc/nginx/sites-enabled/kuhnitver.ru`; выполнены `nginx -t` и graceful reload только nginx. Приложение и API не перезапускались.

Доказательства: [nginx-bot-log-acceptance.json](nginx-bot-log-acceptance.json), [фактический патч](nginx-bot-log-applied.diff), [изолированный fixture](nginx-bot-log-fixture.json).

## Состав и область

Новый файл `/var/log/nginx/kuhnitver-bots.log` хранится только на сервере с правами **0640 www-data:adm**. Проверены lstat, отсутствие symlink и создание через exclusive/no-follow; существующий файл не перезаписывался и не усекался. Исходный combined-поток явно сохранён.

В дополнительный поток попадают только UA-кандидаты известных семейств. В записи есть время, фактический Host из `$http_host`, выбранный vhost, URI без args, метод/статус, локальный source address и нормализованная **claimed** family. Сырые UA, query values, referrer, cookies и body не записываются. Обычный UA Chrome не попадает в новый поток. Отсутствующий Host не подменяется значением vhost.

Семейство по UA **не подтверждает робота**. Адрес источника нужен только локально для проверки по официальным диапазонам либо FCrDNS. При подготовке репозиторных агрегатов адреса и сырые строки исключаются. Синтетический приёмочный запрос с Googlebot UA записан как claimed и не должен учитываться как verified-трафик.

Прочитаны фактические объявления неизменённого capacity snippet: `= /capacity-api` и `/capacity-api/`. Новый URI-map исключает `/api`, `/api/...`, `/capacity-api`, `/capacity-api/...`. Эти ограничения проверены в изолированном fixture; рабочие API-маршруты при приёмке не вызывались.

Текущее `/etc/logrotate.d/nginx` уже покрывает `/var/log/nginx/*.log`: daily, 14 архивов, compress/delaycompress, создание 0640 www-data:adm. Оно не изменялось.

## Проверка

- **12 реальных HTTP-кейсов изолированного nginx:** Chrome, spoofed UA, исходный/отсутствующий Host, исключение чувствительных полей, оба API-префикса и границы имён, сохранение combined. Свой fixture nginx остановлен.
- **На production:** синтетический claimed-запрос появился в новом и старом журнале; обычный Chrome UA — только в старом. Схема и отсутствие args проверены без выгрузки исходных адресов или строк.
- Freshness HTML и пяти фидов, HTML 304, единственный годовой immutable-заголовок CSS/JS, RSC и private 404 сохранены. Содержимое ответов также не изменилось.
- Каталог и PID приложения, capacity snippet, неактивный sites-available и logrotate неизменны.

## Состояние

- До: `07994f8873e51a1e39c59c8ebcdd0e632f12cb889947bbcc210d576fef6ca8a3`.
- После: `26a3691cd76de9efdf88c1de097857bb7e4282dc6475632c255fc5af39206348`.
- Отдельная копия активного конфига с правами 0600: `/var/tmp/kuhnitver-nginx-bot-log-20261031-26a3691cd76d/nginx-bot-log-active-before.conf`.
- Новая запись подтверждена после двух опросов готовности. Откат не потребовался.

Ранее сохранённый after-срез за 00:09–01:47 МСК остаётся `shared-server/path-filtered`: новый журнал не восстанавливает Host задним числом и не меняет исторические цифры. Следующее точное окно начинается после указанной готовности нового журнала; учитываются только нужный Host/публичные пути и подтверждённые источники. Наличие записи не доказывает индексирование или цитирование.

Патч сохранён без контекстных строк; для применения через Git нужен `--unidiff-zero` и предварительная проверка исходного SHA. Механизмы: [nginx conditional access_log и JSON escaping](https://nginx.org/en/docs/http/ngx_http_log_module.html), [nginx map](https://nginx.org/en/docs/http/ngx_http_map_module.html).
