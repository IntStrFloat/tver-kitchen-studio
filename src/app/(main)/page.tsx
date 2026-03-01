import type { Metadata } from "next";
import Hero from "@/components/Hero";
import Catalog from "@/components/Catalog";
import Quiz from "@/components/Quiz";
import Portfolio from "@/components/Portfolio";
import About from "@/components/About";
import FAQSection from "@/components/FAQSection";
import JsonLd from "@/components/seo/JsonLd";
import { SITE_CONFIG, generateWebPageSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: SITE_CONFIG.defaultTitle,
  description:
    "Кухни на заказ в Твери от производителя Kuhnitver. Собственное производство, готовность от 20 рабочих дней. Фурнитура Blum и Hettich, столешницы из кварца и массива. Бесплатная доставка и установка по Твери. Гарантия 1 год по договору. Более 500 реализованных проектов. Рассчитайте стоимость онлайн за 1 минуту!",
  alternates: {
    canonical: `${SITE_CONFIG.url}/`,
  },
  openGraph: {
    title: SITE_CONFIG.defaultTitle,
    description:
      "Кухни на заказ в Твери от производителя Kuhnitver. Собственное производство от 20 дней. Фурнитура Blum и Hettich. Бесплатная доставка и установка. Гарантия 1 год. Более 500 проектов. Рассчитайте стоимость онлайн!",
    url: `${SITE_CONFIG.url}/`,
    siteName: "Kuhnitver",
    locale: "ru_RU",
    type: "website",
    images: [
      {
        url: "https://kuhnitver.ru/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Кухни на заказ в Твери — Kuhnitver",
      },
    ],
  },
};

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <JsonLd
        data={generateWebPageSchema(
          SITE_CONFIG.defaultTitle,
          SITE_CONFIG.defaultDescription,
          `${SITE_CONFIG.url}/`,
        )}
      />

      <Hero />
      <Catalog />
      <Quiz />
      <Portfolio />
      <About />
      <FAQSection />
    </div>
  );
}
