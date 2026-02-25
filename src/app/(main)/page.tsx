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
    "Кухни на заказ в Твери от производителя . Собственное производство, готовность от 20 рабочих дней. Фурнитура Blum и Hettich, столешницы из кварца и массива. Бесплатная доставка и установка по Твери. Гарантия 1 год по договору. Более 500 реализованных проектов. Рассчитайте стоимость онлайн за 1 минуту!",
  alternates: {
    canonical: `${SITE_CONFIG.url}/`,
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
