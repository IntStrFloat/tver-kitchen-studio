import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/seo/JsonLd";
import { SITE_CONFIG, generateProductSchema } from "@/lib/seo";
import { kitchenStyles } from "@/lib/data";

interface Props {
  params: Promise<{ style: string }>;
}

export async function generateStaticParams() {
  return kitchenStyles.map((style) => ({ style: style.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { style: slug } = await params;
  const style = kitchenStyles.find((s) => s.slug === slug);
  if (!style) return {};

  return {
    title: `${style.seoTitle} | TverKuhni`,
    description: style.seoDescription,
    alternates: {
      canonical: `${SITE_CONFIG.url}/catalog/${style.slug}`,
    },
    openGraph: {
      title: style.seoTitle,
      description: style.seoDescription,
      url: `${SITE_CONFIG.url}/catalog/${style.slug}`,
      images: [{ url: `${SITE_CONFIG.url}${style.image}`, width: 600, height: 450 }],
    },
  };
}

export default async function StylePage({ params }: Props) {
  const { style: slug } = await params;
  const style = kitchenStyles.find((s) => s.slug === slug);
  if (!style) notFound();

  const productSchema = generateProductSchema(
    `Кухня «${style.name}» на заказ в Твери`,
    style.seoDescription,
    `${SITE_CONFIG.url}${style.image}`,
    String(style.priceFrom),
    `${SITE_CONFIG.url}/catalog/${style.slug}`,
  );

  return (
    <div className="min-h-screen pt-24">
      <JsonLd data={productSchema} />

      <div className="container-custom">
        <Breadcrumbs
          items={[
            { name: "Каталог кухонь", url: `${SITE_CONFIG.url}/catalog` },
            { name: style.name, url: `${SITE_CONFIG.url}/catalog/${style.slug}` },
          ]}
          className="mb-8"
        />

        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          <div className="rounded-2xl overflow-hidden">
            <Image
              src={style.image}
              alt={`Кухня в стиле ${style.name} на заказ в Твери от TverKuhni`}
              width={800}
              height={600}
              className="w-full h-full object-cover"
              priority
            />
          </div>

          <div>
            {style.price && (
              <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                {style.price}
              </span>
            )}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Кухни в стиле {style.name}
              <span className="text-primary"> на заказ в Твери</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              {style.fullDescription}
            </p>

            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Материалы</h2>
              <ul className="space-y-3">
                {style.materials.map((material, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <svg className="w-3 h-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span>{material}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Особенности стиля</h2>
              <ul className="space-y-3">
                {style.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
                      <svg className="w-3 h-3 text-accent-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/#quiz"
                className="inline-flex items-center justify-center px-8 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
              >
                Рассчитать стоимость
              </Link>
              <a
                href={`https://wa.me/79036302909?text=Здравствуйте! Интересует кухня в стиле ${style.name}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-8 py-3 rounded-xl border font-medium hover:bg-accent transition-colors"
              >
                Написать в WhatsApp
              </a>
            </div>
          </div>
        </div>

        <div className="py-12 bg-secondary/30 rounded-3xl text-center mb-16 px-6">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Закажите кухню «{style.name}» по своим размерам
          </h2>
          <p className="text-muted-foreground mb-2">
            Замер, эскиз проекта после договора, изготовление от 20 дней
          </p>
          <p className="text-muted-foreground mb-6">
            Доставка и установка по Твери и Тверской области
          </p>
          <a
            href={`tel:${SITE_CONFIG.phoneClean}`}
            className="inline-flex items-center gap-2 text-primary font-semibold text-lg hover:underline"
          >
            {SITE_CONFIG.phone}
          </a>
        </div>

        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-8 text-center">
            Другие стили кухонь
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {kitchenStyles
              .filter((s) => s.slug !== style.slug)
              .map((s) => (
                <Link
                  key={s.id}
                  href={`/catalog/${s.slug}`}
                  className="group premium-card overflow-hidden"
                >
                  <div className="aspect-square overflow-hidden">
                    <Image
                      src={s.image}
                      alt={`Кухня ${s.name}`}
                      width={300}
                      height={300}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-3 text-center">
                    <span className="font-medium text-sm">{s.name}</span>
                    {s.price && (
                      <span className="block text-xs text-muted-foreground">
                        {s.price}
                      </span>
                    )}
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
