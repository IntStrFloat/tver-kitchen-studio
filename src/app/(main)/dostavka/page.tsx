import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/seo/JsonLd";
import { SITE_CONFIG, generateWebPageSchema } from "@/lib/seo";
import { cities } from "@/lib/data";

export const metadata: Metadata = {
  title: "Доставка и установка кухонь по Твери и Тверской области — бесплатно | TverKuhni",
  description:
    "Бесплатная доставка и профессиональная установка кухонь на заказ по Твери. Подъём на этаж, подключение мойки и техники — включено. Доставка по Тверской области: Торжок от 3 000 ₽, Ржев, Конаково, Кимры. Сборка за 1 день опытными мастерами. Гарантия на монтаж.",
  keywords:
    "доставка кухонь Тверь, установка кухни Тверь, монтаж кухни бесплатно, доставка мебели Тверская область, сборка кухни Тверь, подключение кухни",
  alternates: {
    canonical: `${SITE_CONFIG.url}/dostavka`,
  },
};

export default function DostavkaPage() {
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Доставка и установка кухонь",
    description:
      "Профессиональная доставка и установка кухонь на заказ по Твери и Тверской области",
    provider: {
      "@type": "LocalBusiness",
      "@id": `${SITE_CONFIG.url}/#localbusiness`,
      name: SITE_CONFIG.name,
    },
    areaServed: cities.map((c) => ({
      "@type": "City",
      name: c.name,
    })),
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "RUB",
      description: "Бесплатная доставка и установка по Твери",
    },
  };

  return (
    <div className="min-h-screen pt-24">
      <JsonLd
        data={generateWebPageSchema(
          "Доставка и установка кухонь",
          "Доставка и установка кухонь по Твери и Тверской области",
          `${SITE_CONFIG.url}/dostavka`,
        )}
      />
      <JsonLd data={serviceSchema} />

      <div className="container-custom">
        <Breadcrumbs
          items={[{ name: "Доставка и установка", url: `${SITE_CONFIG.url}/dostavka` }]}
          className="mb-8"
        />

        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Доставка и установка кухонь
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Бережная доставка и профессиональный монтаж по Твери и всей
            Тверской области
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {[
            {
              title: "Доставка по Твери",
              price: "Бесплатно",
              details: "Доставка в пределах города Тверь включена в стоимость кухни. Подъём на этаж — бесплатно.",
            },
            {
              title: "Профессиональная установка",
              price: "Включена",
              details: "Монтаж выполняют опытные мастера. Подключение мойки, вытяжки, встраиваемой техники.",
            },
            {
              title: "Доставка по области",
              price: "от 3 000 ₽",
              details: "Стоимость зависит от расстояния. Торжок, Конаково — от 3 000 ₽, Ржев, Кимры — от 4 000 ₽.",
            },
          ].map((item, i) => (
            <div key={i} className="premium-card p-8 text-center">
              <div className="text-2xl font-bold text-primary mb-2">
                {item.price}
              </div>
              <h2 className="text-lg font-semibold mb-3">{item.title}</h2>
              <p className="text-sm text-muted-foreground">{item.details}</p>
            </div>
          ))}
        </div>

        <div className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
            Стоимость доставки по городам Тверской области
          </h2>
          <div className="max-w-3xl mx-auto">
            <div className="premium-card overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-secondary/50">
                    <th className="text-left p-4 font-semibold">Город</th>
                    <th className="text-center p-4 font-semibold">Срок доставки</th>
                    <th className="text-right p-4 font-semibold">Стоимость</th>
                  </tr>
                </thead>
                <tbody>
                  {cities.map((city) => (
                    <tr key={city.slug} className="border-t border-border">
                      <td className="p-4">
                        <Link
                          href={`/kuhni/${city.slug}`}
                          className="text-primary hover:underline font-medium"
                        >
                          {city.name}
                        </Link>
                      </td>
                      <td className="p-4 text-center text-muted-foreground">
                        {city.deliveryTime}
                      </td>
                      <td className="p-4 text-right font-medium">
                        {city.deliveryCost}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="bg-secondary/30 rounded-3xl p-8 md:p-12 mb-16">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Как проходит установка</h2>
            <div className="space-y-4">
              {[
                "Мастера приезжают в согласованное время с полным комплектом инструментов",
                "Разгрузка и подъём мебели на этаж — бесплатно",
                "Сборка и установка кухонного гарнитура по утверждённому проекту",
                "Подключение мойки, вытяжки, встраиваемой техники",
                "Регулировка фасадов, проверка работы всех механизмов",
                "Уборка упаковки и строительного мусора",
                "Подписание акта приёмки — с этого момента начинается гарантия",
              ].map((step, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                    {i + 1}
                  </div>
                  <p className="text-muted-foreground">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="text-center py-12 mb-16">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Заказать доставку и установку
          </h2>
          <p className="text-muted-foreground mb-6">
            Свяжитесь с нами для расчёта стоимости доставки в ваш город
          </p>
          <a
            href={`tel:${SITE_CONFIG.phoneClean}`}
            className="inline-flex items-center justify-center px-8 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
          >
            {SITE_CONFIG.phone}
          </a>
        </div>
      </div>
    </div>
  );
}
