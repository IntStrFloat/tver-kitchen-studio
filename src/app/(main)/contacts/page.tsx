import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/seo/JsonLd";
import { SITE_CONFIG, generateWebPageSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title:
    "Контакты Kuhnitver — адрес, телефон, режим работы в Твери | Kuhnitver",
  description:
    "Свяжитесь с Kuhnitver: телефон +7 903 630 29 09, email m-btd@mail.ru. Режим работы Пн-Сб 10:00–19:00. WhatsApp, Telegram для быстрой связи. Бесплатная консультация по выбору кухни. Обслуживаем Тверь, Торжок, Ржев, Конаково и всю Тверскую область.",
  keywords:
    "контакты Kuhnitver, адрес Kuhnitver Тверь, телефон кухни Тверь, шоурум кухонь Тверь, кухни Тверь WhatsApp, заказать кухню Тверь",
  alternates: {
    canonical: `${SITE_CONFIG.url}/contacts`,
  },
  openGraph: {
    title:
      "Контакты Kuhnitver — адрес, телефон, режим работы в Твери | Kuhnitver",
    description:
      "Контакты Kuhnitver в Твери: телефон, email, адрес шоурума. Режим работы Пн-Сб 10:00–19:00. WhatsApp, Telegram. Бесплатная консультация по выбору кухни.",
    url: `${SITE_CONFIG.url}/contacts`,
    siteName: "Kuhnitver",
    locale: "ru_RU",
    type: "website",
    images: [
      {
        url: SITE_CONFIG.defaultOgImage,
        width: 1200,
        height: 630,
        alt: "Контакты Kuhnitver — адрес, телефон, шоурум кухонь в Твери",
      },
    ],
  },
};

export default function ContactsPage() {
  return (
    <div className="min-h-screen pt-24">
      <JsonLd
        data={generateWebPageSchema(
          "Контакты Kuhnitver",
          "Адрес, телефон и режим работы Kuhnitver в Твери",
          `${SITE_CONFIG.url}/contacts`,
        )}
      />

      <div className="container-custom">
        <Breadcrumbs
          items={[{ name: "Контакты", url: `${SITE_CONFIG.url}/contacts` }]}
          className="mb-8"
        />

        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8 text-center">
          Контакты
        </h1>

        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div>
            <div className="premium-card p-8 mb-6">
              <h2 className="text-xl font-semibold mb-6">
                Как с нами связаться
              </h2>
              <address className="not-italic space-y-5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-5 h-5 text-primary"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium mb-1">Адрес шоурума</div>
                    <div className="text-muted-foreground">
                      г. Тверь, ул. Коминтерна, 95, ТЦ «Мебельный»
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-5 h-5 text-primary"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium mb-1">Телефон</div>
                    <a
                      href={`tel:${SITE_CONFIG.phoneClean}`}
                      className="text-primary hover:underline text-lg font-medium"
                    >
                      {SITE_CONFIG.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-5 h-5 text-primary"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium mb-1">Email</div>
                    <a
                      href={`mailto:${SITE_CONFIG.email}`}
                      className="text-primary hover:underline"
                    >
                      {SITE_CONFIG.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-5 h-5 text-primary"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium mb-1">Режим работы</div>
                    <div className="text-muted-foreground">
                      Пн-Сб: 10:00 — 19:00
                    </div>
                    <div className="text-muted-foreground">Вс: выходной</div>
                  </div>
                </div>
              </address>
            </div>

            <div className="premium-card p-8">
              <h2 className="text-xl font-semibold mb-4">Мессенджеры</h2>
              <div className="flex gap-4">
                <a
                  href={SITE_CONFIG.social.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[#0088cc] text-white font-medium hover:opacity-90 transition-opacity"
                >
                  Telegram
                </a>
              </div>
            </div>
          </div>

          <div className="premium-card overflow-hidden">
            <iframe
              src="https://yandex.ru/map-widget/v1/?um=constructor%3A44f8e4e5c0e3a0e1a1b2c3d4e5f6a7b8&source=constructor"
              width="100%"
              height="100%"
              style={{ minHeight: "500px", border: 0 }}
              title="Расположение Kuhnitver на карте Твери"
              loading="lazy"
            />
          </div>
        </div>

        <div className="bg-secondary/30 rounded-3xl p-8 md:p-12 mb-16">
          <h2 className="text-2xl font-bold mb-4 text-center">
            Зона обслуживания
          </h2>
          <p className="text-muted-foreground text-center mb-6">
            Доставляем и устанавливаем кухни по всей Тверской области
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              "Тверь",
              "Торжок",
              "Ржев",
              "Конаково",
              "Кимры",
              "Вышний Волочёк",
              "Бежецк",
              "Нелидово",
            ].map((city) => (
              <span
                key={city}
                className="px-4 py-2 rounded-full bg-card text-sm font-medium shadow-sm"
              >
                {city}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
