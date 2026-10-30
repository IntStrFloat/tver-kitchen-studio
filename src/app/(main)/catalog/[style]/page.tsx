import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/seo/JsonLd";
import { SITE_CONFIG, generateKitchenServiceSchema } from "@/lib/seo";
import { COMMERCIAL_TERMS, kitchenStyles } from "@/lib/data";
import { getPublishedPortfolioCases } from "@/lib/portfolio";

const styleGuidance: Record<string, { fits: string; limitations: string; choices: string }> = {
  loft: {
    fits: "Подходит тем, кому нравятся древесные фактуры, металл и открытые полки. В небольшом помещении можно оставить один выразительный акцент и выбрать спокойные фасады для остальных модулей.",
    limitations: "Проверьте сочетание тёмных поверхностей с освещением кухни. На открытых полках вещи остаются на виду; для повседневной посуды полезно предусмотреть закрытое хранение.",
    choices: "В расчёте уточняют материал и покрытие фасадов, способ обработки древесных поверхностей, долю открытых полок и наполнение шкафов.",
  },
  skandinavskiy: {
    fits: "Светлые фасады и древесные акценты помогают собрать спокойный интерьер квартиры или дома. Планировку можно адаптировать для небольшой кухни, уделив внимание хранению и рабочей поверхности.",
    limitations: "Оцените выбранный белый оттенок при дневном и вечернем свете. У древесного рисунка и столешницы должны сочетаться тон и направление; это удобнее проверить по образцам.",
    choices: "На смету влияют покрытие фасадов, материал столешницы, количество выдвижных ящиков, внутренние разделители и встроенное освещение.",
  },
  minimalizm: {
    fits: "Подходит для интерьера со спокойными плоскостями, встроенной техникой и закрытым хранением. Фасады без выступающих ручек позволяют выдержать единый ритм рядов.",
    limitations: "Способ открывания нужно проверить на образце и согласовать с размещением техники. Для розеток, вентиляции и подсветки важно заранее оставить доступ, сохранив удобство обслуживания.",
    choices: "Уточняют профиль или механизм открывания, покрытие фасадов, встраивание техники, наполнение высоких шкафов и схему освещения.",
  },
  premium: {
    fits: "Подходит для проекта, где важны индивидуальные материалы, сложная компоновка и детали исполнения. Начать стоит с задач хранения и рабочей зоны, затем подобрать отделку.",
    limitations: "Для тяжёлых и крупноформатных элементов заранее проверяют подъём и доступ в помещение. Рисунок материала, расположение стыков и требования к уходу согласуют по конкретному образцу.",
    choices: "Смета зависит от выбранных материалов, обработки кромок и стыков, размеров модулей, фурнитуры и отдельных монтажных работ.",
  },
  klassika: {
    fits: "Фрезерованные фасады, карнизы и спокойные оттенки подходят для классического интерьера. Масштаб декоративных элементов можно выбрать с учётом высоты потолка и площади кухни.",
    limitations: "Уточните, как будут выглядеть крайние модули, примыкания и открывание дверей рядом с декором. Профиль фасада стоит посмотреть на образце и оценить удобство ухода.",
    choices: "В расчёте указывают материал и профиль фасадов, отделку декоративных деталей, ручки, столешницу и выбранные системы хранения.",
  },
  belaya: {
    fits: "Белые фасады сочетаются с разными планировками и стилями: от минимализма до классики. Тёплый или холодный оттенок выбирают вместе со столешницей, стенами и освещением.",
    limitations: "Одинаковое название цвета у разных материалов не гарантирует совпадение оттенков. Сравните образцы рядом и заранее выберите подходящий способ ухода за конкретным покрытием.",
    choices: "Стоимость определяется материалом и покрытием фасадов, формой ручек, столешницей и наполнением. Сам по себе белый цвет не задаёт цену гарнитура.",
  },
  uglovye: {
    fits: "Г-образная планировка позволяет задействовать две стены и разместить рабочие зоны рядом. Решение подбирают по размерам помещения, расположению коммуникаций и открыванию техники.",
    limitations: "На замере проверьте угол стен, выступы, подоконник и доступ к коммуникациям. Угловые секции требуют отдельного решения для хранения; рядом должны свободно открываться фасады и техника.",
    choices: "Для сметы нужны размеры обеих сторон, тип углового модуля, столешница со стыком или без него, количество ящиков и выбранные механизмы хранения.",
  },
};

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
    title: `${style.seoTitle} | Kuhnitver`,
    description: style.seoDescription,
    alternates: {
      canonical: `${SITE_CONFIG.url}/catalog/${style.slug}`,
    },
    openGraph: {
      type: "website",
      title: style.seoTitle,
      description: style.seoDescription,
      url: `${SITE_CONFIG.url}/catalog/${style.slug}`,
      images: [
        { url: `${SITE_CONFIG.url}${style.image}`, width: 600, height: 450 },
      ],
    },
  };
}

export default async function StylePage({ params }: Props) {
  const { style: slug } = await params;
  const style = kitchenStyles.find((s) => s.slug === slug);
  if (!style) notFound();

  const serviceSchema = generateKitchenServiceSchema(
    `${style.heading ?? `Кухня «${style.name}»`} на заказ в Твери`,
    style.seoDescription,
    `${SITE_CONFIG.url}${style.image}`,
    `${SITE_CONFIG.url}/catalog/${style.slug}`,
  );
  const guidance = styleGuidance[style.slug];
  const completedProjects = getPublishedPortfolioCases().filter((project) => project.styleSlug === style.slug);

  return (
    <div className="min-h-screen pt-24">
      <JsonLd data={serviceSchema} />

      <div className="container-custom">
        <Breadcrumbs
          items={[
            { name: "Каталог кухонь", url: `${SITE_CONFIG.url}/catalog` },
            {
              name: style.name,
              url: `${SITE_CONFIG.url}/catalog/${style.slug}`,
            },
          ]}
          className="mb-8"
        />

        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          <figure className="rounded-2xl overflow-hidden">
            <Image
              src={style.image}
              alt={`${style.heading ?? `Кухня в стиле ${style.name}`} на заказ в Твери от Kuhnitver`}
              width={800}
              height={600}
              className="w-full h-auto object-cover"
              priority
            />
            <figcaption className="text-sm text-muted-foreground px-4 py-3 bg-secondary/30">
              Дизайн-референс для выбора стиля. Компоновку и материалы подбирают для конкретного помещения.
            </figcaption>
          </figure>

          <div>
            {style.price && (
              <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                {style.price}
              </span>
            )}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              {style.heading ?? `Кухни в стиле ${style.name}`}
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
                      <svg
                        className="w-3 h-3 text-primary"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
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
                      <svg
                        className="w-3 h-3 text-accent-foreground"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
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
                Получить предварительный расчёт
              </Link>
              <a
                href={`tel:${SITE_CONFIG.phoneClean}`}
                className="inline-flex items-center justify-center px-8 py-3 rounded-xl border font-medium hover:bg-accent transition-colors"
              >
                {SITE_CONFIG.phone}
              </a>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              Или найдите нас в Max по номеру{" "}
              <a
                href={`tel:${SITE_CONFIG.maxPhoneClean}`}
                className="text-primary font-medium hover:underline"
              >
                {SITE_CONFIG.maxPhone.replace(/-/g, " ")}
              </a>
            </p>
          </div>
        </div>

        {guidance && (
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {[
              { title: "Кому подходит", text: guidance.fits },
              { title: "Что проверить до заказа", text: guidance.limitations },
              { title: "От чего зависит комплектация", text: guidance.choices },
            ].map((item) => (
              <section key={item.title} className="premium-card p-6">
                <h2 className="text-xl font-semibold mb-3">{item.title}</h2>
                <p className="text-muted-foreground leading-relaxed">{item.text}</p>
              </section>
            ))}
          </div>
        )}

        <section className="mb-16 max-w-3xl">
          <h2 className="text-2xl font-bold mb-4">Как получить расчёт этой кухни</h2>
          <p className="text-muted-foreground mb-4">{COMMERCIAL_TERMS.pricingText}</p>
          <p className="text-muted-foreground mb-4">{COMMERCIAL_TERMS.measurementText}</p>
          <div className="flex flex-wrap gap-x-6 gap-y-3">
            <Link href="/price" className="text-primary hover:underline">Состав сметы и условия расчёта</Link>
            <Link href="/portfolio" className="text-primary hover:underline">Дизайн-референсы и идеи кухонь</Link>
            <Link href="/dostavka" className="text-primary hover:underline">Доставка и монтаж</Link>
          </div>
        </section>

        {completedProjects.length > 0 && (
          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-4">Выполненные проекты в этом стиле</h2>
            <ul className="space-y-3">
              {completedProjects.map((project) => <li key={project.slug}><Link href={`/portfolio/${project.slug}`} className="text-primary hover:underline">{project.title} — {project.city}</Link></li>)}
            </ul>
          </section>
        )}

        <div className="py-12 bg-secondary/30 rounded-3xl text-center mb-16 px-6">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            {style.heading
              ? `Закажите ${style.heading.toLowerCase()} по своим размерам`
              : `Закажите кухню «${style.name}» по своим размерам`}
          </h2>
          <p className="text-muted-foreground mb-2">
            {COMMERCIAL_TERMS.productionText}
          </p>
          <p className="text-muted-foreground mb-6">
            {COMMERCIAL_TERMS.deliveryText}
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
