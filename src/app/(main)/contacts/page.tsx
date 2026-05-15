import type { Metadata } from "next";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Navigation,
  MessageCircle,
  Send,
} from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/seo/JsonLd";
import { SITE_CONFIG, generateWebPageSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title:
    "Контакты Kuhnitver — адрес шоурума, телефон, режим работы в Твери | Kuhnitver",
  description:
    "Шоурум Kuhnitver: г. Тверь, ул. Коминтерна, 95, ТЦ «Мебельный». Телефон +7 903 630 29 09, email m-btd@mail.ru. Режим работы Пн-Сб 10:00–19:00. Telegram и Max для быстрой связи. Обслуживаем Тверь, Торжок, Ржев, Конаково и всю Тверскую область.",
  keywords:
    "контакты Kuhnitver, адрес кухни Тверь, шоурум кухонь Тверь, ТЦ Мебельный Тверь, телефон кухни Тверь, кухни Тверь Telegram",
  alternates: {
    canonical: `${SITE_CONFIG.url}/contacts`,
  },
  openGraph: {
    title:
      "Контакты Kuhnitver — адрес шоурума, телефон, режим работы в Твери | Kuhnitver",
    description:
      "Шоурум Kuhnitver: г. Тверь, ул. Коминтерна, 95, ТЦ «Мебельный». Телефон, email, Telegram, Max. Пн-Сб 10:00–19:00.",
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

const addressQuery = "Тверь, улица Коминтерна, 95";
const mapSrc =
  "https://yandex.ru/map-widget/v1/?ll=35.9006%2C56.8584&mode=search&sll=35.9006%2C56.8584&text=" +
  encodeURIComponent(addressQuery) +
  "&z=16";

const routeUrl =
  "https://yandex.ru/maps/?rtext=~56.8584%2C35.9006&rtt=auto&text=" +
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
            выбрать материалы, рассчитать стоимость и записать на бесплатный
            замер.
          </p>
        </header>

        <div
          className="grid lg:grid-cols-5 gap-6 mb-16"
          itemScope
          itemType="https://schema.org/LocalBusiness"
        >
          <meta itemProp="name" content={SITE_CONFIG.name} />
          <meta itemProp="url" content={SITE_CONFIG.url} />
          <meta itemProp="image" content={SITE_CONFIG.defaultOgImage} />
          <meta itemProp="priceRange" content="$$" />

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
                  <p className="text-muted-foreground text-sm mt-1">
                    {SITE_CONFIG.address.venue}
                  </p>
                  <meta
                    itemProp="addressRegion"
                    content={SITE_CONFIG.address.region}
                  />
                  <meta
                    itemProp="postalCode"
                    content={SITE_CONFIG.address.postalCode}
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
                  <a
                    href={`tel:${SITE_CONFIG.phoneClean}`}
                    className="font-semibold text-lg text-primary hover:underline"
                    itemProp="telephone"
                  >
                    {SITE_CONFIG.phone}
                  </a>
                  <p className="text-xs text-muted-foreground mt-1">
                    Перезваниваем в течение 15 минут
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
                  <a
                    href={`mailto:${SITE_CONFIG.email}`}
                    className="font-semibold text-primary hover:underline break-all"
                    itemProp="email"
                  >
                    {SITE_CONFIG.email}
                  </a>
                </div>
              </div>
            </div>

            <div
              className="premium-card p-6"
              itemProp="openingHours"
              content="Mo-Sa 10:00-19:00"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-primary" aria-hidden="true" />
                </div>
                <div className="flex-1">
                  <div className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
                    Режим работы
                  </div>
                  <p className="font-semibold">Пн–Сб: 10:00–19:00</p>
                  <p className="text-sm text-muted-foreground">
                    Воскресенье — выходной
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
                Мессенджеры
              </div>
              <div className="flex flex-wrap gap-3 mb-4">
                <a
                  href={SITE_CONFIG.social.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#229ED9] text-white font-medium hover:opacity-90 transition-opacity"
                >
                  <Send className="w-4 h-4" aria-hidden="true" />
                  Telegram
                </a>
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
                Отвечаем в рабочее время в течение 15 минут.
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
                allow="geolocation"
                referrerPolicy="no-referrer-when-downgrade"
                title={`Шоурум Kuhnitver на ${SITE_CONFIG.address.street} в Твери`}
              />
            </div>
            <meta
              itemProp="geo"
              itemScope
              itemType="https://schema.org/GeoCoordinates"
            />
            <meta
              itemProp="latitude"
              content={String(SITE_CONFIG.geo.latitude)}
            />
            <meta
              itemProp="longitude"
              content={String(SITE_CONFIG.geo.longitude)}
            />
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
            {[
              { name: "Тверь", slug: "tveri" },
              { name: "Торжок", slug: "torzhke" },
              { name: "Ржев", slug: "rzheve" },
              { name: "Конаково", slug: "konakovo" },
              { name: "Кимры", slug: "kimrah" },
              { name: "Вышний Волочёк", slug: "vyshnem-volochke" },
              { name: "Бежецк", slug: "bezhecke" },
              { name: "Нелидово", slug: "nelidovo" },
            ].map((city) => (
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
            Шоурум и производство Kuhnitver находятся в Твери, на улице
            Коминтерна, 95, в торговом центре «Мебельный». На месте можно
            посмотреть и потрогать образцы фасадов, столешниц, фурнитуры
            Blum и Hettich, обсудить с дизайнером планировку и стиль, получить
            предварительный расчёт по своим размерам. Перед визитом удобно
            позвонить —{" "}
            <a
              href={`tel:${SITE_CONFIG.phoneClean}`}
              className="text-primary hover:underline"
            >
              +7 903 630 29 09
            </a>{" "}
            — мы подготовим образцы под интересующий вас стиль.
          </p>
          <p>
            Если приезжать в шоурум неудобно — оформим встречу с замерщиком
            прямо у вас дома по Твери и области, бесплатно привезём образцы.
            Замер стоит 1 500 ₽ и вычитается из стоимости кухни при оформлении
            заказа. Связаться удобнее всего через{" "}
            <a
              href={SITE_CONFIG.social.telegram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Telegram
            </a>
            ; также можно найти нас в мессенджере Max по номеру{" "}
            <a
              href={`tel:${SITE_CONFIG.maxPhoneClean}`}
              className="text-primary hover:underline"
            >
              {SITE_CONFIG.maxPhone.replace(/-/g, " ")}
            </a>
            . Ответим в течение 15 минут в рабочее время.
          </p>
        </section>
      </div>
    </div>
  );
}
