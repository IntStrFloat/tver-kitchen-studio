import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/seo/JsonLd";
import { SITE_CONFIG, generateWebPageSchema } from "@/lib/seo";
import { COMMERCIAL_TERMS, priceData } from "@/lib/data";

const description = "Как рассчитывается стоимость кухни на заказ в Твери: комплектация, материалы, фурнитура и состав сметы. Индивидуальный расчёт по размерам помещения в Kuhnitver.";

export const metadata: Metadata = {
  title: "Цены на кухни на заказ в Твери — состав сметы | Kuhnitver",
  description,
  alternates: { canonical: `${SITE_CONFIG.url}/price` },
  openGraph: {
    title: "Цены на кухни на заказ в Твери — состав сметы | Kuhnitver",
    description,
    url: `${SITE_CONFIG.url}/price`,
    siteName: SITE_CONFIG.name,
    locale: "ru_RU",
    type: "website",
    images: [{ url: SITE_CONFIG.defaultOgImage, width: 1200, height: 630, alt: "Как рассчитывается стоимость кухни Kuhnitver" }],
  },
};

const estimateItems = [
  { item: "Размеры и планировка", details: "Длина каждого ряда, высота шкафов, углы, ниши и число модулей." },
  { item: "Корпус и фасады", details: "Материал, покрытие, толщина, цвет и обработка торцов каждого элемента." },
  { item: "Столешница и стеновая панель", details: "Материал, глубина, кромки, стыки, вырезы под мойку и технику." },
  { item: "Фурнитура и наполнение", details: "Конкретные модели петель, направляющих, подъёмников и систем хранения." },
  { item: "Техника, мойка и смеситель", details: "Кто приобретает оборудование, его размеры и требования к установке. Эти позиции перечисляют отдельно от мебели." },
  { item: "Доставка и монтаж", details: "Адрес доставки, подъём, сборка, подключения и дополнительные работы с указанием стоимости и ответственности." },
];

export default function PricePage() {
  return (
    <div className="min-h-screen pt-24">
      <JsonLd data={generateWebPageSchema("Цены на кухни на заказ в Твери", description, `${SITE_CONFIG.url}/price`)} />
      <div className="container-custom">
        <Breadcrumbs items={[{ name: "Цены", url: `${SITE_CONFIG.url}/price` }]} className="mb-8" />
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">Цены на кухни на заказ в Твери</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{COMMERCIAL_TERMS.pricingText}</p>
          <p className="text-sm text-muted-foreground mt-4">Сведения обновлены: <time dateTime={COMMERCIAL_TERMS.updatedAt}>{new Date(COMMERCIAL_TERMS.updatedAt).toLocaleDateString("ru-RU", { timeZone: "UTC" })}</time>.</p>
        </div>

        <div className="space-y-8 mb-16">
          {priceData.map((category) => (
            <section key={category.category} className="premium-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <caption className="bg-primary/5 px-6 py-4 text-left text-xl font-semibold">{category.category}</caption>
                  <thead>
                    <tr className="border-b border-border">
                      <th scope="col" className="px-6 py-3 font-medium">Комплектация или услуга</th>
                      <th scope="col" className="px-6 py-3 font-medium">Условия расчёта</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {category.items.map((item) => (
                      <tr key={item.name}>
                        <th scope="row" className="px-6 py-4 font-medium">{item.name}</th>
                        <td className="px-6 py-4 text-primary font-semibold">{item.price} {item.unit}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          ))}
        </div>

        <section className="bg-secondary/30 rounded-3xl p-6 md:p-12 mb-16">
          <h2 className="text-2xl font-bold mb-4">Что указывать в полной смете</h2>
          <p className="text-muted-foreground mb-6">Сравнивайте предложения на одинаковых размерах и одинаковой комплектации. Для каждой позиции важно видеть количество, материал, работы и итоговую сумму.</p>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <caption className="sr-only">Состав индивидуального расчёта кухни</caption>
              <thead><tr className="border-b border-border"><th scope="col" className="py-3 pr-6">Раздел сметы</th><th scope="col" className="py-3">Что согласовать</th></tr></thead>
              <tbody className="divide-y divide-border">
                {estimateItems.map((row) => <tr key={row.item}><th scope="row" className="py-4 pr-6 font-medium align-top">{row.item}</th><td className="py-4 text-muted-foreground">{row.details}</td></tr>)}
              </tbody>
            </table>
          </div>
          <p className="text-muted-foreground mt-6">Замер: {COMMERCIAL_TERMS.measurementText}</p>
          <p className="text-muted-foreground mt-3">Доставка: {COMMERCIAL_TERMS.deliveryText}</p>
          <p className="text-muted-foreground mt-3">Монтаж: {COMMERCIAL_TERMS.installationText}</p>
          <p className="text-muted-foreground mt-3">Позиции, которые не входят в расчёт, и дополнительные работы перечисляют в смете отдельно. Состав и стоимость проверяйте до оформления заказа.</p>
        </section>

        <section className="mb-16 max-w-3xl">
          <h2 className="text-2xl font-bold mb-4">Погонный метр и стоимость всей кухни</h2>
          <p className="text-muted-foreground mb-4">Погонный метр описывает длину ряда мебели. Для цены за метр нужна определённая базовая комплектация: высота и глубина шкафов, фасады, столешница и фурнитура. Угловые модули, ящики и встроенная техника меняют состав расчёта.</p>
          <p className="text-muted-foreground mb-4">На сайте кухни рассчитываются индивидуально. Итоговую сумму получают по спецификации конкретного проекта; умножение условной цены за метр на длину стены не заменяет эту смету.</p>
          <Link href="/blog/skolko-stoit-kuhnya-na-zakaz-2026" className="text-primary hover:underline">Подробнее о том, как сравнить расчёты кухонь</Link>
        </section>

        <div className="text-center py-12 px-6 bg-primary/5 rounded-3xl mb-16">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Получите предварительный расчёт</h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">Укажите планировку и пожелания. Дизайнер свяжется с вами, чтобы уточнить размеры и комплектацию для расчёта.</p>
          <Link href="/#quiz" className="inline-flex items-center justify-center px-8 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity">Получить предварительный расчёт</Link>
        </div>
      </div>
    </div>
  );
}
