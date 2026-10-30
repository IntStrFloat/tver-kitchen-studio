import type { Metadata } from "next";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Navigation,
  MessageCircle,
} from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/seo/JsonLd";
import { SITE_CONFIG, generateWebPageSchema } from "@/lib/seo";
import { cities, COMMERCIAL_TERMS } from "@/lib/data";

export const metadata: Metadata = {
  title:
    "Контакты Kuhnitver — адрес шоурума, телефон, режим работы в Твери | Kuhnitver",
  description:
    `${SITE_CONFIG.name}: ${SITE_CONFIG.address.locality}, ${SITE_CONFIG.address.street}. Основной телефон ${SITE_CONFIG.phone}. Max ${SITE_CONFIG.maxPhone}. ${SITE_CONFIG.openingHours.label}. Условия замера и визита согласуем заранее.`,
  keywords:
    "контакты Kuhnitver, адрес кухни Тверь, шоурум кухонь Тверь, телефон кухни Тверь, кухни Тверь Max",
  alternates: {
    canonical: `${SITE_CONFIG.url}/contacts`,
  },
  openGraph: {
    title:
      "Контакты Kuhnitver — адрес шоурума, телефон, режим работы в Твери | Kuhnitver",
    description:
      `${SITE_CONFIG.name}: ${SITE_CONFIG.address.locality}, ${SITE_CONFIG.address.street}. Основной телефон ${SITE_CONFIG.phone}, Max ${SITE_CONFIG.maxPhone}.`,
    url: `${SITE_CONFIG.url}/contacts`,
    siteName: "Kuhnitver",
    locale: "ru_RU",
    type: "website",
    images: [
      {
        url: SITE_CONFIG.defaultOgImage,
        width: 1200,
        height: 630,
        alt: "Контакты Kuhnitver — шоурум кухонь в Твери",
      },
    ],
  },
};

const addressQuery = `${SITE_CONFIG.address.locality}, ${SITE_CONFIG.address.street}`;
const mapSrc =
  "https://yandex.ru/map-widget/v1/?mode=search&text=" +
  encodeURIComponent(addressQuery) +
  "&z=16";

const routeUrl =
  "https://yandex.ru/maps/?mode=search&text=" +
  encodeURIComponent(addressQuery);

export default function ContactsPage() {
  return (
    <div className="min-h-screen pt-24">
      <JsonLd
        data={generateWebPageSchema(
          "Контакты Kuhnitver",
          "Адрес шоурума, телефон, email и режим работы Kuhnitver в Твери",
          `${SITE_CONFIG.url}/contacts`,
        )}
      />

      <div className="container-custom">
        <Breadcrumbs
          items={[{ name: "Контакты", url: `${SITE_CONFIG.url}/contacts` }]}
          className="mb-8"
        />

        <header className="text-center mb-10 max-w-2xl mx-auto">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Контакты
          </h1>
          <p className="text-lg text-muted-foreground">
            Приезжайте в шоурум, звоните или пишите в мессенджер — поможем
            выбрать материалы, запросить предварительный расчёт и согласовать замер.
          </p>
        </header>

        <div
          className="grid lg:grid-cols-5 gap-6 mb-16"
          itemScope
          itemType="https://schema.org/LocalBusiness"
          itemID={`${SITE_CONFIG.url}/#localbusiness`}
        >
          <meta itemProp="name" content={SITE_CONFIG.name} />
          {/* URL — через <link href>, а не <meta content> (ссылка в content
              мета-тега невалидна для валидатора Яндекса). */}
          <link itemProp="url" href={SITE_CONFIG.url} />
          <meta itemProp="image" content={SITE_CONFIG.defaultOgImage} />

          <div className="lg:col-span-2 space-y-4">
            <address
              className="premium-card p-6 not-italic"
              itemProp="address"
              itemScope
              itemType="https://schema.org/PostalAddress"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-primary" aria-hidden="true" />
                </div>
                <div className="flex-1">
                  <div className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
                    Адрес шоурума
                  </div>
                  <p className="font-semibold text-lg leading-snug">
                    <span itemProp="addressLocality">
                      г. {SITE_CONFIG.address.locality}
                    </span>
                    , <span itemProp="streetAddress">{SITE_CONFIG.address.street}</span>
                  </p>
                  {SITE_CONFIG.address.venue && (
                    <p className="text-muted-foreground text-sm mt-1">
                      {SITE_CONFIG.address.venue}
                    </p>
                  )}
                  <meta
                    itemProp="addressRegion"
                    content={SITE_CONFIG.address.region}
                  />
                  <meta
                    itemProp="addressCountry"
                    content={SITE_CONFIG.address.country}
                  />
                </div>
              </div>
            </address>

            <div className="premium-card p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-primary" aria-hidden="true" />
                </div>
                <div className="flex-1">
                  <div className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
                    Телефон
                  </div>
                  <meta itemProp="telephone" content={SITE_CONFIG.phone} />
                  <a
                    href={`tel:${SITE_CONFIG.phoneClean}`}
                    className="font-semibold text-lg text-primary hover:underline"
                  >
                    {SITE_CONFIG.phone}
                  </a>
                  <p className="text-xs text-muted-foreground mt-1">
                    Основной телефон для вопросов и записи
                  </p>
                </div>
              </div>
            </div>

            <div className="premium-card p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-primary" aria-hidden="true" />
                </div>
                <div className="flex-1">
                  <div className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
                    Email
                  </div>
                  <meta itemProp="email" content={SITE_CONFIG.email} />
                  <a
                    href={`mailto:${SITE_CONFIG.email}`}
                    className="font-semibold text-primary hover:underline break-all"
                  >
                    {SITE_CONFIG.email}
                  </a>
                </div>
              </div>
            </div>

            <div
              className="premium-card p-6"
              itemProp="openingHours"
              content={SITE_CONFIG.openingHours.schema}
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-primary" aria-hidden="true" />
                </div>
                <div className="flex-1">
                  <div className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
                    Режим работы
                  </div>
                  <p className="font-semibold">{SITE_CONFIG.openingHours.label}</p>
                  <p className="text-sm text-muted-foreground">
                    {SITE_CONFIG.openingHours.closedLabel}
                  </p>
                </div>
              </div>
            </div>

            <a
              href={routeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="premium-card p-5 flex items-center justify-between group hover:border-primary transition-colors"
            >
              <div className="flex items-center gap-3">
                <Navigation
                  className="w-5 h-5 text-primary"
                  aria-hidden="true"
                />
                <span className="font-medium">Построить маршрут</span>
              </div>
              <span className="text-xs text-muted-foreground">
                Яндекс.Карты →
              </span>
            </a>

            <div className="premium-card p-6">
              <div className="text-xs uppercase tracking-wide text-muted-foreground mb-3">
                Мессенджер
              </div>
              <div className="rounded-xl bg-secondary/50 p-4 border border-border/40">
                <div className="flex items-center gap-2 mb-1">
                  <MessageCircle
                    className="w-4 h-4 text-primary"
                    aria-hidden="true"
                  />
                  <span className="font-medium text-sm">Найдите нас в Max</span>
                </div>
                <a
                  href={`tel:${SITE_CONFIG.maxPhoneClean}`}
                  className="text-primary font-semibold hover:underline"
                >
                  {SITE_CONFIG.maxPhone.replace(/-/g, " ")}
                </a>
                <p className="text-xs text-muted-foreground mt-1">
                  Добавьте номер в контакты и найдите нас в приложении Max
                </p>
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                Отдельный номер для общения в Max. Основной телефон указан выше.
              </p>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="premium-card overflow-hidden h-full min-h-[500px] lg:min-h-0">
              <iframe
                src={mapSrc}
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: 500 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={`Шоурум Kuhnitver на ${SITE_CONFIG.address.street} в Твери`}
              />
            </div>
          </div>
        </div>

        <section className="bg-secondary/30 rounded-3xl p-8 md:p-12 mb-16">
          <h2 className="text-2xl md:text-3xl font-bold mb-3 text-center">
            Зона обслуживания
          </h2>
          <p className="text-muted-foreground text-center mb-8 max-w-2xl mx-auto">
            Производим, доставляем и устанавливаем кухни по всей Тверской
            области. Кликните на город — узнаете условия и сроки доставки.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {cities.map((city) => (
              <a
                key={city.slug}
                href={`/kuhni/${city.slug}`}
                className="px-4 py-2 rounded-full bg-card text-sm font-medium shadow-sm hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                {city.name}
              </a>
            ))}
          </div>
        </section>

        <section className="prose-like max-w-3xl mx-auto pb-16 text-foreground/80 leading-relaxed space-y-4 text-[15px] md:text-base">
          <h2 className="text-2xl font-bold text-foreground">
            Как нас найти в Твери
          </h2>
          <p>
            Адрес Kuhnitver: {SITE_CONFIG.address.locality}, {SITE_CONFIG.address.street}. На месте можно
            посмотреть и потрогать образцы фасадов, столешниц, фурнитуры
            Blum и Hettich, обсудить с дизайнером планировку и стиль, получить
            предварительный расчёт по своим размерам. Перед визитом удобно
            позвонить —{" "}
            <a
              href={`tel:${SITE_CONFIG.phoneClean}`}
              className="text-primary hover:underline"
            >
              {SITE_CONFIG.phone}
            </a>{" "}
            — мы подготовим образцы под интересующий вас стиль.
          </p>
          <p>
            {COMMERCIAL_TERMS.measurementText} Связаться можно по основному телефону или через{" "}
            мессенджер Max — добавьте в контакты номер{" "}
            <a
              href={`tel:${SITE_CONFIG.maxPhoneClean}`}
              className="text-primary hover:underline"
            >
              {SITE_CONFIG.maxPhone.replace(/-/g, " ")}
            </a>{" "}
            и найдите нас в приложении.
          </p>
          <p>
            Kuhnitver — сайт студии кухонь. В Яндекс Бизнесе наша существующая карточка называется{" "}
            <a href={SITE_CONFIG.businessCard.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">«{SITE_CONFIG.businessCard.name}»</a>.
            В ней может отображаться адрес до переезда; для визита используйте действующий адрес на этой странице и предварительно свяжитесь с нами.
          </p>
        </section>
      </div>
    </div>
  );
}
