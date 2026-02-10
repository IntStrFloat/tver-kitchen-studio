import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Providers from "@/components/Providers";
import Script from "next/script";
import {
  SITE_CONFIG,
  generateOrganizationSchema,
  generateWebSiteSchema,
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
    "Производство кухонь на заказ в Твери за 20 дней. Европейские материалы, бесплатный 3D-проект, установка включена. Гарантия 2 года. Звоните!",
  keywords:
    "кухни на заказ Тверь, купить кухню в Твери, кухни от производителя Тверь, кухонный гарнитур Тверь, кухни под заказ Тверь, кухня под ключ Тверь, кухни на заказ недорого Тверь, кухни Тверь цены, кухни на заказ Тверская область, производство кухонь Тверь, угловая кухня на заказ Тверь, кухня по индивидуальному проекту Тверь",
  authors: [{ name: "TverKuhni" }],
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
    yandex: "ce67eb671a8c4f20",
  },
  alternates: {
    canonical: "https://tverkuhni.ru/",
  },
  openGraph: {
    type: "website",
    url: "https://tverkuhni.ru/",
    siteName: "TverKuhni",
    locale: "ru_RU",
    title: SITE_CONFIG.defaultTitle,
    description:
      "Производство кухонь на заказ в Твери за 20 дней. Европейские материалы, бесплатный 3D-проект, установка включена.",
    images: [
      {
        url: "https://tverkuhni.ru/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "TverKuhni — кухни на заказ в Твери",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_CONFIG.defaultTitle,
    description:
      "Производство кухонь на заказ в Твери за 20 дней. Европейские материалы, бесплатный 3D-проект, установка включена.",
    images: ["https://tverkuhni.ru/og-image.jpg"],
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", type: "image/x-icon" },
    ],
    apple: "/favicon.svg",
  },
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
            __html: JSON.stringify(localBusinessSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(serviceSchema),
          }}
        />
        <link rel="preconnect" href="https://mc.yandex.ru" />
        <link rel="dns-prefetch" href="https://mc.yandex.ru" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
      </head>
      <body className="font-sans antialiased">
        <Providers>{children}</Providers>

        {/* Яндекс.Метрика */}
        <Script id="yandex-metrika" strategy="afterInteractive">
          {`
            (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
            m[i].l=1*new Date();
            for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
            k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
            (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
            ym(XXXXXXXXX, "init", {
              clickmap:true,
              trackLinks:true,
              accurateTrackBounce:true,
              webvisor:true
            });
          `}
        </Script>
        <noscript>
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://mc.yandex.ru/watch/XXXXXXXXX"
              style={{ position: "absolute", left: "-9999px" }}
              alt=""
            />
          </div>
        </noscript>

        {/* Google Analytics 4 */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XXXXXXXXXX');
          `}
        </Script>
      </body>
    </html>
  );
}
