import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/seo/JsonLd";
import { SITE_CONFIG, generateWebPageSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Политика конфиденциальности | Kuhnitver",
  description:
    "Политика обработки персональных данных Kuhnitver: какие данные мы собираем через формы на сайте, цели обработки, передача третьим лицам и права пользователя.",
  alternates: {
    canonical: `${SITE_CONFIG.url}/privacy`,
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Политика конфиденциальности | Kuhnitver",
    description:
      "Как Kuhnitver обрабатывает персональные данные, оставленные через формы на сайте.",
    url: `${SITE_CONFIG.url}/privacy`,
    siteName: "Kuhnitver",
    locale: "ru_RU",
    type: "website",
  },
};

const phoneDisplay = SITE_CONFIG.phone.replace(/-/g, " ");
const lastUpdated = "14 июня 2026 года";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen pt-24">
      <JsonLd
        data={generateWebPageSchema(
          "Политика конфиденциальности",
          "Политика обработки персональных данных Kuhnitver",
          `${SITE_CONFIG.url}/privacy`,
        )}
      />

      <div className="container-custom">
        <Breadcrumbs
          items={[
            {
              name: "Политика конфиденциальности",
              url: `${SITE_CONFIG.url}/privacy`,
            },
          ]}
          className="mb-8"
        />

        <article className="max-w-3xl mx-auto pb-16 prose-like text-foreground/80 leading-relaxed space-y-5 text-[15px] md:text-base">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Политика конфиденциальности
          </h1>
          <p className="text-sm text-muted-foreground">
            Дата последнего обновления: {lastUpdated}
          </p>

          <h2 className="text-xl font-semibold text-foreground pt-2">
            1. Общие положения
          </h2>
          <p>
            Настоящая Политика конфиденциальности (далее — «Политика») определяет
            порядок обработки и защиты персональных данных пользователей сайта{" "}
            <a
              href={SITE_CONFIG.url}
              className="text-primary hover:underline"
            >
              kuhnitver.ru
            </a>{" "}
            (далее — «Сайт»). Оператором персональных данных выступает мебельная
            студия Kuhnitver (далее — «Оператор»), г. {SITE_CONFIG.address.locality},{" "}
            {SITE_CONFIG.address.street}. Политика подготовлена в соответствии с
            Федеральным законом от 27.07.2006 № 152-ФЗ «О персональных данных».
          </p>
          <p>
            Отправляя свои данные через формы на Сайте, пользователь подтверждает
            согласие с условиями настоящей Политики и даёт согласие на обработку
            своих персональных данных на изложенных в ней условиях.
          </p>

          <h2 className="text-xl font-semibold text-foreground pt-2">
            2. Какие данные мы обрабатываем
          </h2>
          <p>Оператор обрабатывает следующие данные:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>имя, указанное пользователем в форме;</li>
            <li>номер телефона;</li>
            <li>адрес электронной почты — если пользователь его оставил;</li>
            <li>
              содержание заявки (например, ответы в квизе по расчёту стоимости);
            </li>
            <li>
              обезличенные технические данные, которые автоматически передаёт
              браузер: IP-адрес, файлы cookie, сведения о посещённых страницах
              (через системы веб-аналитики).
            </li>
          </ul>

          <h2 className="text-xl font-semibold text-foreground pt-2">
            3. Цели обработки
          </h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>обратный звонок и консультация по заявке пользователя;</li>
            <li>расчёт стоимости кухни и подготовка коммерческого предложения;</li>
            <li>запись на замер, согласование заказа, доставки и установки;</li>
            <li>
              улучшение работы Сайта и анализ посещаемости в обезличенном виде.
            </li>
          </ul>

          <h2 className="text-xl font-semibold text-foreground pt-2">
            4. Правовое основание
          </h2>
          <p>
            Обработка персональных данных осуществляется на основании согласия
            субъекта персональных данных, которое выражается в действии —
            отправке формы на Сайте. Согласие может быть отозвано в любой момент
            (см. раздел 8).
          </p>

          <h2 className="text-xl font-semibold text-foreground pt-2">
            5. Передача третьим лицам
          </h2>
          <p>
            Оператор не продаёт и не передаёт персональные данные третьим лицам,
            за исключением случаев, необходимых для обработки заявки и работы
            Сайта:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              сервисы доставки уведомлений о заявках (электронная почта), чтобы
              менеджер получил вашу заявку;
            </li>
            <li>
              сервис веб-аналитики Яндекс.Метрика — для сбора обезличенной
              статистики посещений;
            </li>
            <li>
              случаи, прямо предусмотренные законодательством Российской
              Федерации.
            </li>
          </ul>

          <h2 className="text-xl font-semibold text-foreground pt-2">
            6. Сроки хранения
          </h2>
          <p>
            Персональные данные хранятся не дольше, чем этого требуют цели
            обработки, или до отзыва согласия пользователем. После достижения
            целей обработки или отзыва согласия данные удаляются или
            обезличиваются.
          </p>

          <h2 className="text-xl font-semibold text-foreground pt-2">
            7. Файлы cookie и аналитика
          </h2>
          <p>
            Сайт использует файлы cookie и систему Яндекс.Метрика для сбора
            обезличенных статистических данных о посещениях. Пользователь может
            отключить cookie в настройках своего браузера; при этом отдельные
            функции Сайта могут работать некорректно.
          </p>

          <h2 className="text-xl font-semibold text-foreground pt-2">
            8. Права пользователя
          </h2>
          <p>
            Пользователь вправе получить информацию об обработке своих данных,
            потребовать их уточнения, блокирования или удаления, а также отозвать
            согласие на обработку. Для этого направьте обращение по электронной
            почте{" "}
            <a
              href={`mailto:${SITE_CONFIG.email}`}
              className="text-primary hover:underline"
            >
              {SITE_CONFIG.email}
            </a>{" "}
            или по телефону{" "}
            <a
              href={`tel:${SITE_CONFIG.phoneClean}`}
              className="text-primary hover:underline"
            >
              {phoneDisplay}
            </a>
            .
          </p>

          <h2 className="text-xl font-semibold text-foreground pt-2">
            9. Контакты оператора
          </h2>
          <p>
            Kuhnitver, г. {SITE_CONFIG.address.locality}, {SITE_CONFIG.address.street}
            {SITE_CONFIG.address.venue ? `, ${SITE_CONFIG.address.venue}` : ""}.
            <br />
            Телефон:{" "}
            <a
              href={`tel:${SITE_CONFIG.phoneClean}`}
              className="text-primary hover:underline"
            >
              {phoneDisplay}
            </a>
            <br />
            Email:{" "}
            <a
              href={`mailto:${SITE_CONFIG.email}`}
              className="text-primary hover:underline"
            >
              {SITE_CONFIG.email}
            </a>
          </p>

          <p className="text-sm text-muted-foreground pt-2">
            Оператор вправе вносить изменения в настоящую Политику. Актуальная
            редакция всегда размещена на этой странице.
          </p>
        </article>
      </div>
    </div>
  );
}
