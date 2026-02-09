import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Providers from "@/components/Providers";
import {
  SITE_CONFIG,
  generateOrganizationSchema,
  generateWebSiteSchema,
  generateLocalBusinessSchema,
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
    "кухни на заказ Тверь, кухни Тверь, кухни от производителя, мебель для кухни Тверь, кухни под заказ, кухонные гарнитуры Тверь, кухня на заказ недорого, кухня Тверь цена",
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
      </head>
      <body className="font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
