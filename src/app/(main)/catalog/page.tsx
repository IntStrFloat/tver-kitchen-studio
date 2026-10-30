import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/seo/JsonLd";
import { SITE_CONFIG, generateCollectionPageSchema } from "@/lib/seo";
import { COMMERCIAL_TERMS, kitchenStyles } from "@/lib/data";

export const metadata: Metadata = {
  title: "Каталог кухонь на заказ в Твери — стили, фото, цены | Kuhnitver",
  description:
    "Каталог стилей кухонь на заказ в Твери: лофт, минимализм, скандинавский, премиум. Дизайн-референсы, материалы и особенности планировок. Индивидуальный расчёт по комплектации.",
  keywords:
    "каталог кухонь Тверь, кухни на заказ стили, кухни фото цены Тверь, кухонные гарнитуры каталог, кухня лофт Тверь, кухня минимализм, скандинавская кухня Тверь, кухня премиум класса",
  alternates: {
    canonical: `${SITE_CONFIG.url}/catalog`,
  },
  openGraph: {
    title: "Каталог кухонь на заказ в Твери — стили, фото, цены | Kuhnitver",
    description:
      "Стили и дизайн-референсы кухонь: лофт, минимализм, скандинавский, премиум. Материалы и индивидуальный расчёт под ваши размеры.",
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
  return (
    <div className="min-h-screen pt-24">
      <JsonLd
        data={generateCollectionPageSchema(
          "Каталог кухонь на заказ в Твери",
          "Стили и дизайн-референсы кухонь на заказ. Материалы и индивидуальная комплектация.",
          `${SITE_CONFIG.url}/catalog`,
          kitchenStyles.map((style) => ({ name: style.heading ?? style.name, url: `${SITE_CONFIG.url}/catalog/${style.slug}` })),
        )}
      />

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
          <p className="text-sm text-muted-foreground max-w-2xl mx-auto mt-4">
            На изображениях — дизайн-референсы. {COMMERCIAL_TERMS.pricingText}
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
                  alt={`Дизайн-референс кухни в стиле ${style.name}`}
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
            Получить предварительный расчёт
          </Link>
        </div>
      </div>
    </div>
  );
}
