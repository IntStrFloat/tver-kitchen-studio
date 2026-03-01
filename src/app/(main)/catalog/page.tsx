import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/seo/JsonLd";
import { SITE_CONFIG, generateWebPageSchema } from "@/lib/seo";
import { kitchenStyles } from "@/lib/data";

export const metadata: Metadata = {
  title: "Каталог кухонь на заказ в Твери — стили, фото, цены | Kuhnitver",
  description:
    "Каталог кухонь на заказ в Твери от производителя: лофт, минимализм, скандинавский стиль, современная классика, премиум. Фото реальных проектов с ценами. Индивидуальный дизайн под ваши размеры. Фурнитура Blum и Hettich. Рассчитайте стоимость онлайн.",
  keywords:
    "каталог кухонь Тверь, кухни на заказ стили, кухни фото цены Тверь, кухонные гарнитуры каталог, кухня лофт Тверь, кухня минимализм, скандинавская кухня Тверь, кухня премиум класса",
  alternates: {
    canonical: `${SITE_CONFIG.url}/catalog`,
  },
  openGraph: {
    title: "Каталог кухонь на заказ в Твери — стили, фото, цены | Kuhnitver",
    description:
      "Каталог кухонь на заказ в Твери: лофт, минимализм, скандинавский, премиум. Фото реальных проектов с ценами. Индивидуальный дизайн под ваши размеры. Фурнитура Blum и Hettich.",
    url: `${SITE_CONFIG.url}/catalog`,
    siteName: "Kuhnitver",
    locale: "ru_RU",
    type: "website",
    images: [
      {
        url: SITE_CONFIG.defaultOgImage,
        width: 1200,
        height: 630,
        alt: "Каталог кухонь на заказ в Твери — стили, фото, цены Kuhnitver",
      },
    ],
  },
};

export default function CatalogPage() {
  const aggregateOfferSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Кухни на заказ в Твери",
    description:
      "Кухни на заказ от производителя в Твери. Широкий выбор стилей и материалов.",
    brand: { "@type": "Brand", name: SITE_CONFIG.name },
    offers: {
      "@type": "AggregateOffer",
      lowPrice: "25000",
      highPrice: "150000",
      priceCurrency: "RUB",
      offerCount: kitchenStyles.length,
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <div className="min-h-screen pt-24">
      <JsonLd
        data={generateWebPageSchema(
          "Каталог кухонь на заказ в Твери",
          "Каталог кухонь на заказ: лофт, минимализм, скандинавский, премиум. Производство .",
          `${SITE_CONFIG.url}/catalog`,
        )}
      />
      <JsonLd data={aggregateOfferSchema} />

      <div className="container-custom">
        <Breadcrumbs
          items={[
            { name: "Каталог кухонь", url: `${SITE_CONFIG.url}/catalog` },
          ]}
          className="mb-8"
        />

        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Каталог кухонь на заказ в Твери
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Выберите стиль кухни, который вам нравится. Мы адаптируем любой
            дизайн под ваши размеры и пожелания.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {kitchenStyles.map((style) => (
            <Link
              key={style.id}
              href={`/catalog/${style.slug}`}
              className="group premium-card overflow-hidden"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <Image
                  src={style.image}
                  alt={`Кухня в стиле ${style.name} на заказ в Твери`}
                  width={600}
                  height={450}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-xl font-bold">{style.name}</h2>
                  {style.price && (
                    <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                      {style.price}
                    </span>
                  )}
                </div>
                <p className="text-muted-foreground text-sm mb-4">
                  {style.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {style.materials.map((material, i) => (
                    <span
                      key={i}
                      className="text-xs px-2 py-1 rounded-full bg-secondary text-secondary-foreground"
                    >
                      {material}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center py-12 bg-secondary/30 rounded-3xl mb-16">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Не нашли подходящий стиль?
          </h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            Мы изготавливаем кухни по индивидуальному дизайну. Расскажите о
            вашей идее — мы воплотим её в жизнь.
          </p>
          <Link
            href="/#quiz"
            className="inline-flex items-center justify-center px-8 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
          >
            Рассчитать стоимость
          </Link>
        </div>
      </div>
    </div>
  );
}
