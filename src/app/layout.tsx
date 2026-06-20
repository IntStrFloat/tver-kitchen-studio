import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Providers from "@/components/Providers";
import AnalyticsListener from "@/components/AnalyticsListener";
import Script from "next/script";
import {
  SITE_CONFIG,
  generateOrganizationSchema,
  generateWebSiteSchema,
  generateSiteNavigationSchema,
  generateLocalBusinessSchema,
  generateServiceSchema,
} from "@/lib/seo";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: SITE_CONFIG.defaultTitle,
  description:
    "Кухни на заказ в Твери от производителя Kuhnitver. Собственное производство, готовность от 20 рабочих дней. Фурнитура Blum и Hettich, столешницы из кварца и массива. Бесплатная доставка и установка по Твери. Гарантия 1 год по договору. Рассчитайте стоимость онлайн!",
  keywords:
    "кухни на заказ Тверь, кухни от производителя Тверь, кухни Тверь цены, кухонный гарнитур Тверь, кухни Тверская область",
  authors: [{ name: "Kuhnitver" }],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  verification: {
    google: "99aXy2XdjB2Jw09DwzV43zwq7ZxIyvvJJw4Fz1zR2NA",
    yandex: "e37b9b2b71291f43",
  },
  alternates: {
    canonical: "https://kuhnitver.ru/",
  },
  openGraph: {
    type: "website",
    url: "https://kuhnitver.ru/",
    siteName: "Kuhnitver",
    locale: "ru_RU",
    title: SITE_CONFIG.defaultTitle,
    description:
      "Кухни на заказ в Твери от производителя Kuhnitver. Готовность от 20 дней, фурнитура Blum и Hettich, бесплатная доставка и установка. Гарантия 1 год.",
    images: [
      {
        url: "https://kuhnitver.ru/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Kuhnitver — кухни на заказ в Твери",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_CONFIG.defaultTitle,
    description:
      "Кухни на заказ в Твери от производителя Kuhnitver. Готовность от 20 дней, фурнитура Blum и Hettich, бесплатная доставка и установка. Гарантия 1 год.",
    images: ["https://kuhnitver.ru/og-image.jpg"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    shortcut: [{ url: "/favicon.ico" }],
    apple: { url: "/apple-touch-icon.png", sizes: "180x180" },
  },
  manifest: "/site.webmanifest",
  other: {
    "geo.region": "RU-TVE",
    "geo.placename": "Тверь",
    "geo.position": "56.8584;35.9006",
    ICBM: "56.8584, 35.9006",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // JSON-LD структурированные данные
  const organizationSchema = generateOrganizationSchema();
  const webSiteSchema = generateWebSiteSchema();
  const siteNavigationSchema = generateSiteNavigationSchema();
  const localBusinessSchema = generateLocalBusinessSchema();
  const serviceSchema = generateServiceSchema();

  return (
    <html lang="ru" className={inter.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(webSiteSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(siteNavigationSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(localBusinessSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(serviceSchema),
          }}
        />
        <link
          rel="preload"
          as="image"
          href="/images/hero-kitchen.jpg"
          fetchPriority="high"
        />
        <link rel="preconnect" href="https://mc.yandex.ru" />
        <link rel="dns-prefetch" href="https://mc.yandex.ru" />
        {/* Раскомментируйте при подключении Google Analytics
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        */}
      </head>
      <body className="font-sans antialiased">
        <AnalyticsListener />
        <Providers>{children}</Providers>

        {/* Яндекс.Метрика */}
        <Script id="yandex-metrika" strategy="afterInteractive">
          {`
            (function(m,e,t,r,i,k,a){
              m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
              m[i].l=1*new Date();
              for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
              k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
            })(window, document, "script", "https://mc.yandex.ru/metrika/tag.js?id=106971287", "ym");
            ym(106971287, "init", {
              ssr: true,
              webvisor: true,
              clickmap: true,
              ecommerce: "dataLayer",
              referrer: document.referrer,
              url: location.href,
              accurateTrackBounce: true,
              trackLinks: true
            });
            // Второй счётчик Метрики — параллельный учёт. tag.js загружен
            // выше один раз, нужен только повторный init для нового id.
            ym(110021238, "init", {
              ssr: true,
              webvisor: true,
              clickmap: true,
              ecommerce: "dataLayer",
              referrer: document.referrer,
              url: location.href,
              accurateTrackBounce: true,
              trackLinks: true
            });
          `}
        </Script>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-Z45D1032QK"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', 'G-Z45D1032QK');`}
        </Script>
        <noscript>
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://mc.yandex.ru/watch/106971287"
              style={{ position: "absolute", left: "-9999px" }}
              alt=""
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://mc.yandex.ru/watch/110021238"
              style={{ position: "absolute", left: "-9999px" }}
              alt=""
            />
          </div>
        </noscript>

        {/* Google Analytics 4 — раскомментируйте и замените GA_ID на ваш реальный ID
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=GA_ID"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'GA_ID');
          `}
        </Script>
        */}
      </body>
    </html>
  );
}
