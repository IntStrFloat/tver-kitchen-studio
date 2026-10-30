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
const lastUpdated = "30 октября 2026 года";

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
            (далее — «Сайт»). Заявки поступают команде мебельной студии
            {" "}{SITE_CONFIG.name}. Контакты для вопросов об обработке данных
            приведены в разделе 9.
          </p>
          <p>
            Перед отправкой формы ознакомьтесь с этой Политикой. Указывайте
            только данные, необходимые для ответа на ваш запрос.
          </p>

          <h2 className="text-xl font-semibold text-foreground pt-2">
            2. Какие данные мы обрабатываем
          </h2>
          <p>При использовании Сайта могут обрабатываться следующие данные:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>имя, указанное пользователем в форме;</li>
            <li>номер телефона;</li>
            <li>адрес электронной почты — если пользователь его оставил;</li>
            <li>
              содержание заявки (например, пожелания к предварительному расчёту);
            </li>
            <li>
              технические данные, которые передаёт браузер: IP-адрес, файлы
              cookie, сведения об устройстве и посещённых страницах,
              источнике перехода и взаимодействиях с Сайтом.
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
              улучшение работы Сайта и анализ посещаемости и результатов заявок.
            </li>
          </ul>

          <h2 className="text-xl font-semibold text-foreground pt-2">
            4. Правовое основание
          </h2>
          <p>
            Данные формы используются для ответа на запрос пользователя и
            подготовки предложения. При отправке формы пользователь подтверждает
            согласие на обработку указанных в ней данных. По вопросам об
            обработке данных и отзыве согласия можно обратиться по контактам
            в разделе 9.
          </p>

          <h2 className="text-xl font-semibold text-foreground pt-2">
            5. Передача третьим лицам
          </h2>
          <p>
            Для обработки заявки и работы Сайта используются внешние сервисы:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              Web3Forms: при отправке формы её поля передаются этому сервису
              для доставки заявки на электронную почту Kuhnitver. Условия сервиса
              описаны в его{" "}
              <a href="https://web3forms.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                политике конфиденциальности
              </a>;
            </li>
            <li>
              Яндекс.Метрика и Google Analytics 4: для статистики посещений,
              источников переходов, взаимодействий и успешной отправки заявок.
              Имена, телефоны и содержание заявки не включаются в параметры
              событий аналитики;
            </li>
            <li>
              почтовые сервисы, через которые команда получает заявку и отвечает
              на неё.
            </li>
          </ul>

          <h2 className="text-xl font-semibold text-foreground pt-2">
            6. Сроки хранения
          </h2>
          <p>
            Данные заявки используются для ответа и работы по обращению.
            Сроки хранения у внешних сервисов определяются также их правилами
            и настройками. Уточнить сведения о хранении своей заявки или
            направить запрос на удаление можно по контактам в разделе 9.
          </p>

          <h2 className="text-xl font-semibold text-foreground pt-2">
            7. Файлы cookie и аналитика
          </h2>
          <p>
            Сайт использует файлы cookie и системы Яндекс.Метрика и Google
            Analytics 4. Они получают технические сведения о посещениях,
            просмотрах страниц и взаимодействиях. Пользователь может управлять
            cookie в настройках браузера. О правилах сервисов можно прочитать
            в{" "}
            <a href="https://yandex.ru/legal/confidential/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">политике Яндекса</a>{" "}
            и <a href="https://policies.google.com/privacy?hl=ru" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">политике Google</a>.
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
            9. Контакты для обращений
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
            Актуальная редакция Политики и дата её обновления размещаются на
            этой странице.
          </p>
        </article>
      </div>
    </div>
  );
}
