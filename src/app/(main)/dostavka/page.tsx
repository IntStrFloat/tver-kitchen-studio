import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/seo/JsonLd";
import { SITE_CONFIG, generateWebPageSchema } from "@/lib/seo";
import { cities, COMMERCIAL_TERMS } from "@/lib/data";

const title = "Доставка и установка кухонь в Твери и Тверской области";
export const metadata: Metadata = {
  title: `${title} | Kuhnitver`,
  description: COMMERCIAL_TERMS.deliveryText,
  alternates: { canonical: `${SITE_CONFIG.url}/dostavka` },
  openGraph: {
    title, description: COMMERCIAL_TERMS.deliveryText, url: `${SITE_CONFIG.url}/dostavka`,
    siteName: SITE_CONFIG.name, locale: SITE_CONFIG.locale, type: "website",
    images: [{ url: SITE_CONFIG.defaultOgImage, width: 1200, height: 630, alt: title }],
  },
};

export default function DostavkaPage() {
  return (
    <div className="min-h-screen pt-24">
      <JsonLd data={generateWebPageSchema(title, COMMERCIAL_TERMS.deliveryText, `${SITE_CONFIG.url}/dostavka`)} />
      <JsonLd data={{
        "@context": "https://schema.org", "@type": "Service", "@id": `${SITE_CONFIG.url}/dostavka#service`,
        name: title, description: `${COMMERCIAL_TERMS.deliveryText} ${COMMERCIAL_TERMS.installationText}`,
        url: `${SITE_CONFIG.url}/dostavka`, provider: { "@id": `${SITE_CONFIG.url}/#localbusiness` },
        areaServed: cities.map((city) => ({ "@type": "City", name: city.name })),
      }} />
      <div className="container-custom">
        <Breadcrumbs items={[{ name: "Доставка и установка", url: `${SITE_CONFIG.url}/dostavka` }]} className="mb-8" />
        <header className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">Доставка и установка кухонь</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">{COMMERCIAL_TERMS.deliveryText}</p>
        </header>
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {[
            { title: "Замер и выезд", text: COMMERCIAL_TERMS.measurementText },
            { title: "Доставка", text: COMMERCIAL_TERMS.deliveryText },
            { title: "Монтаж", text: COMMERCIAL_TERMS.installationText },
          ].map((item) => <section key={item.title} className="premium-card p-6">
            <h2 className="text-xl font-semibold mb-3">{item.title}</h2>
            <p className="text-muted-foreground">{item.text}</p>
          </section>)}
        </div>
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Доставка по городам Тверской области</h2>
          <div className="premium-card overflow-x-auto">
            <table className="w-full text-sm md:text-base">
              <caption className="p-4 text-left text-muted-foreground">Условия для индивидуального заказа. Время перевозки и дата доставки после изготовления согласуются отдельно.</caption>
              <thead><tr className="bg-secondary/50">
                <th scope="col" className="p-4 text-left">Город</th>
                <th scope="col" className="p-4 text-left">Дата доставки</th>
                <th scope="col" className="p-4 text-left">Стоимость</th>
              </tr></thead>
              <tbody>{cities.map((city) => <tr key={city.slug} className="border-t border-border">
                <th scope="row" className="p-4 text-left font-medium"><Link href={`/kuhni/${city.slug}`} className="text-primary hover:underline">{city.name}</Link></th>
                <td className="p-4 text-muted-foreground">{city.deliveryTime}</td>
                <td className="p-4">{city.deliveryCost}</td>
              </tr>)}</tbody>
            </table>
          </div>
        </section>
        <section className="bg-secondary/30 rounded-3xl p-8 md:p-12 mb-12 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">Что согласовать перед доставкой</h2>
          <ul className="list-disc pl-6 space-y-3 text-muted-foreground">
            <li>Адрес, возможность подъезда и место разгрузки.</li>
            <li>Этаж, лифт, размеры проходов, условия подъёма крупных деталей.</li>
            <li>Готовность стен, пола и коммуникаций, перечень встроенной техники.</li>
            <li>Отдельные работы: подключения, вырезы, демонтаж и вывоз упаковки.</li>
            <li>Дата доставки, дата монтажа, порядок осмотра и приёмки.</li>
          </ul>
          <p className="mt-6 text-muted-foreground">{COMMERCIAL_TERMS.productionText}</p>
        </section>
        <section className="max-w-4xl mx-auto mb-12">
          <h2 className="text-2xl font-bold mb-4">Гарантия и обращение после установки</h2>
          <p className="text-muted-foreground">{COMMERCIAL_TERMS.warrantyText}</p>
          <Link href="/contacts" className="inline-block text-primary hover:underline mt-4">Контакты для обращения →</Link>
        </section>
        <div className="text-center py-10 mb-12">
          <h2 className="text-2xl font-bold mb-4">Уточнить доставку в ваш город</h2>
          <a href={`tel:${SITE_CONFIG.phoneClean}`} className="inline-flex px-8 py-3 rounded-xl bg-primary text-primary-foreground font-medium">{SITE_CONFIG.phone}</a>
          <p className="text-sm text-muted-foreground mt-4">Условия страницы обновлены <time dateTime={COMMERCIAL_TERMS.updatedAt}>30 октября 2026 года</time>. Стоимость фиксируется в согласованной смете.</p>
        </div>
      </div>
    </div>
  );
}
