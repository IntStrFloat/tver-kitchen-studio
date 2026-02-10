import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/seo/JsonLd";
import { SITE_CONFIG } from "@/lib/seo";
import { cities, kitchenStyles, projects } from "@/lib/data";

interface Props {
  params: Promise<{ city: string }>;
}

export async function generateStaticParams() {
  return cities.map((city) => ({ city: city.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city: slug } = await params;
  const city = cities.find((c) => c.slug === slug);
  if (!city) return {};

  return {
    title: `Кухни на заказ ${city.nameIn} от производителя | TverKuhni`,
    description: `Кухни на заказ ${city.nameIn} от производителя TverKuhni. Цены от 25 000 ₽/п.м. Бесплатный замер, 3D-проект, доставка ${city.deliveryCost === "Бесплатно" ? "бесплатно" : city.deliveryCost}. Гарантия 2 года.`,
    keywords: `кухни на заказ ${city.name}, купить кухню ${city.nameIn}, кухни ${city.name} цены, кухонный гарнитур ${city.name}`,
    alternates: {
      canonical: `${SITE_CONFIG.url}/kuhni/${city.slug}`,
    },
    openGraph: {
      title: `Кухни на заказ ${city.nameIn} от производителя`,
      description: `Производство кухонь на заказ с доставкой ${city.nameIn}. Цены от 25 000 ₽/п.м.`,
      url: `${SITE_CONFIG.url}/kuhni/${city.slug}`,
    },
  };
}

export default async function CityPage({ params }: Props) {
  const { city: slug } = await params;
  const city = cities.find((c) => c.slug === slug);
  if (!city) notFound();

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: `TverKuhni — кухни на заказ ${city.nameIn}`,
    description: `Производство и доставка кухонь на заказ ${city.nameIn}. Собственное производство в Твери, европейские материалы.`,
    url: `${SITE_CONFIG.url}/kuhni/${city.slug}`,
    telephone: SITE_CONFIG.phone,
    address: {
      "@type": "PostalAddress",
      addressLocality: city.name,
      addressRegion: "Тверская область",
      addressCountry: "RU",
    },
    areaServed: {
      "@type": "City",
      name: city.name,
    },
    priceRange: "$$",
  };

  return (
    <div className="min-h-screen pt-24">
      <JsonLd data={localBusinessSchema} />

      <div className="container-custom">
        <Breadcrumbs
          items={[
            { name: `Кухни ${city.nameIn}`, url: `${SITE_CONFIG.url}/kuhni/${city.slug}` },
          ]}
          className="mb-8"
        />

        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Кухни на заказ {city.nameIn}
            <span className="text-primary"> от производителя</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Производим кухни в Твери и доставляем {city.nameIn}. Европейские
            материалы, бесплатный 3D-проект, гарантия 2 года.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <div className="premium-card p-6 text-center">
            <div className="text-3xl font-bold text-primary mb-2">
              от 25 000 ₽
            </div>
            <div className="text-muted-foreground">за погонный метр</div>
          </div>
          <div className="premium-card p-6 text-center">
            <div className="text-3xl font-bold text-primary mb-2">
              {city.deliveryTime}
            </div>
            <div className="text-muted-foreground">срок доставки</div>
          </div>
          <div className="premium-card p-6 text-center">
            <div className="text-3xl font-bold text-primary mb-2">
              {city.deliveryCost}
            </div>
            <div className="text-muted-foreground">стоимость доставки</div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto mb-16">
          <div className="premium-card p-8">
            <h2 className="text-2xl font-bold mb-4">
              Кухни на заказ с доставкой {city.nameIn}
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              {city.description}
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                "Бесплатный замер на дому",
                "3D-проект в подарок",
                "Изготовление за 20 дней",
                "Европейская фурнитура Blum, Hettich",
                "Доставка и установка",
                "Гарантия 2 года",
                "Рассрочка без переплат",
                "Любые стили и размеры",
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-primary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
            Популярные стили кухонь
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {kitchenStyles.slice(0, 6).map((style) => (
              <Link
                key={style.id}
                href={`/catalog/${style.slug}`}
                className="group premium-card overflow-hidden"
              >
                <div className="aspect-square overflow-hidden">
                  <Image
                    src={style.image}
                    alt={`Кухня ${style.name} с доставкой ${city.nameIn}`}
                    width={400}
                    height={400}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                    sizes="(max-width: 768px) 50vw, 33vw"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold">{style.name}</h3>
                  <p className="text-sm text-primary">{style.price}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {city.districts.length > 0 && (
          <div className="bg-secondary/30 rounded-3xl p-8 mb-16">
            <h2 className="text-xl font-bold mb-4">
              Доставляем кухни по районам {city.nameGenitive}
            </h2>
            <div className="flex flex-wrap gap-3">
              {city.districts.map((district) => (
                <span
                  key={district}
                  className="px-4 py-2 rounded-full bg-card text-sm font-medium shadow-sm"
                >
                  {district}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="mb-16">
          <h2 className="text-2xl font-bold text-center mb-8">
            Реализованные проекты
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {projects.slice(0, 3).map((project) => (
              <div key={project.id} className="premium-card overflow-hidden">
                <div className="aspect-square">
                  <Image
                    src={project.image}
                    alt={`Кухня ${project.style} — ${project.location}`}
                    width={400}
                    height={400}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    sizes="(max-width: 768px) 50vw, 33vw"
                  />
                </div>
                <div className="p-3">
                  <p className="text-sm font-medium">{project.location}</p>
                  <p className="text-xs text-muted-foreground">
                    Стиль: {project.style}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-6">
            <Link
              href="/portfolio"
              className="text-primary font-medium hover:underline"
            >
              Смотреть все работы →
            </Link>
          </div>
        </div>

        <div className="text-center py-12 bg-primary/5 rounded-3xl mb-16">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Закажите кухню {city.nameIn}
          </h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            Бесплатный замер, 3D-проект и расчёт стоимости с учётом доставки
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/#quiz"
              className="inline-flex items-center justify-center px-8 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
            >
              Рассчитать стоимость
            </Link>
            <a
              href={`tel:${SITE_CONFIG.phoneClean}`}
              className="inline-flex items-center justify-center px-8 py-3 rounded-xl border font-medium hover:bg-accent transition-colors"
            >
              {SITE_CONFIG.phone}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
