import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/seo/JsonLd";
import { SITE_CONFIG, generateWebPageSchema } from "@/lib/seo";
import { priceData, kitchenStyles } from "@/lib/data";

export const metadata: Metadata = {
  title: "Цены на кухни на заказ в Твери — от 25 000 ₽/п.м. | TverKuhni",
  description:
    "Цены на кухни на заказ в Твери от производителя: от 25 000 ₽ за погонный метр. Таблица цен по стилям, планировкам и материалам. Рассрочка без переплат.",
  keywords:
    "цены кухни Тверь, сколько стоит кухня на заказ, стоимость кухни Тверь, кухня цена за метр",
  alternates: {
    canonical: `${SITE_CONFIG.url}/price`,
  },
};

export default function PricePage() {
  const offersSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Кухни на заказ в Твери",
    description: "Кухни на заказ от производителя TverKuhni. Цены от 25 000 ₽/п.м.",
    brand: { "@type": "Brand", name: SITE_CONFIG.name },
    offers: kitchenStyles.map((style) => ({
      "@type": "Offer",
      name: `Кухня «${style.name}»`,
      price: String(style.priceFrom),
      priceCurrency: "RUB",
      availability: "https://schema.org/InStock",
      url: `${SITE_CONFIG.url}/catalog/${style.slug}`,
      priceValidUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
    })),
  };

  return (
    <div className="min-h-screen pt-24">
      <JsonLd
        data={generateWebPageSchema(
          "Цены на кухни на заказ в Твери",
          "Цены на кухни от производителя: от 25 000 ₽/п.м.",
          `${SITE_CONFIG.url}/price`,
        )}
      />
      <JsonLd data={offersSchema} />

      <div className="container-custom">
        <Breadcrumbs
          items={[{ name: "Цены", url: `${SITE_CONFIG.url}/price` }]}
          className="mb-8"
        />

        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Цены на кухни на заказ в Твери
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Прозрачные цены от производителя. Стоимость фиксируется в договоре.
            Рассрочка без переплат до 12 месяцев.
          </p>
        </div>

        <div className="space-y-8 mb-16">
          {priceData.map((category, catIndex) => (
            <div key={catIndex} className="premium-card overflow-hidden">
              <div className="bg-primary/5 px-6 py-4">
                <h2 className="text-xl font-semibold">{category.category}</h2>
              </div>
              <div className="divide-y divide-border">
                {category.items.map((item, itemIndex) => (
                  <div
                    key={itemIndex}
                    className="flex items-center justify-between px-6 py-4"
                  >
                    <span className="font-medium">{item.name}</span>
                    <span className="text-primary font-semibold">
                      {item.price} {item.unit}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-secondary/30 rounded-3xl p-8 md:p-12 mb-16">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Примеры расчётов
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "Прямая кухня 2.5 м",
                style: "Скандинавский",
                price: "62 500 — 80 000 ₽",
                includes: ["Крашеный МДФ", "Искусственный камень", "Фурнитура Hettich"],
              },
              {
                title: "Угловая кухня 3 м",
                style: "Лофт",
                price: "95 000 — 130 000 ₽",
                includes: ["МДФ Soft-touch", "Столешница из дуба", "Фурнитура Blum"],
              },
              {
                title: "П-образная кухня 4 м",
                style: "Классика",
                price: "180 000 — 250 000 ₽",
                includes: ["Массив ясеня", "Мраморная столешница", "Фурнитура Blum"],
              },
            ].map((example, i) => (
              <div key={i} className="premium-card p-6">
                <h3 className="font-semibold mb-1">{example.title}</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Стиль: {example.style}
                </p>
                <div className="text-2xl font-bold text-primary mb-4">
                  {example.price}
                </div>
                <ul className="space-y-2">
                  {example.includes.map((item, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <svg className="w-4 h-4 text-primary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center py-12 bg-primary/5 rounded-3xl mb-16">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Рассчитайте стоимость вашей кухни
          </h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            Ответьте на 4 вопроса и получите точный расчёт + бесплатный 3D-проект
          </p>
          <Link
            href="/#quiz"
            className="inline-flex items-center justify-center px-8 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
          >
            Рассчитать стоимость за 1 минуту
          </Link>
        </div>
      </div>
    </div>
  );
}
