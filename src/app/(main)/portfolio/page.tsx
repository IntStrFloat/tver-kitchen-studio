import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/seo/JsonLd";
import { SITE_CONFIG, generateCollectionPageSchema } from "@/lib/seo";
import { projects } from "@/lib/data";
import { getPublishedPortfolioCases } from "@/lib/portfolio";

export const metadata: Metadata = {
  title: "Фото кухни и дизайн-референсы в Твери | Kuhnitver",
  description:
    "Фото кухни из опубликованной карточки «Мебельщик» и дизайн-референсы популярных стилей. Идеи для обсуждения планировки и индивидуальной комплектации.",
  keywords:
    "кухни фото Тверь, идеи кухонь, стили кухонь, кухни лофт, кухни минимализм, кухни скандинавский, кухни премиум",
  alternates: {
    canonical: `${SITE_CONFIG.url}/portfolio`,
  },
  openGraph: {
    title: "Фото кухни и дизайн-референсы в Твери | Kuhnitver",
    description:
      "Фото кухни из опубликованной карточки «Мебельщик» и дизайн-референсы популярных стилей. Идеи для обсуждения планировки и индивидуальной комплектации.",
    url: `${SITE_CONFIG.url}/portfolio`,
    siteName: "Kuhnitver",
    locale: "ru_RU",
    type: "website",
    images: [
      {
        url: SITE_CONFIG.defaultOgImage,
        width: 1200,
        height: 630,
        alt: "Фото кухни и дизайн-референсы Kuhnitver",
      },
    ],
  },
};

export default function PortfolioPage() {
  const completedProjects = getPublishedPortfolioCases();
  return (
    <div className="min-h-screen pt-24">
      <JsonLd
        data={generateCollectionPageSchema(
          "Фото кухни и дизайн-референсы",
          "Фото из опубликованной карточки «Мебельщик» и дизайн-референсы для обсуждения индивидуального проекта кухни.",
          `${SITE_CONFIG.url}/portfolio`,
          [
            ...completedProjects.map((project) => ({ name: project.title, url: `${SITE_CONFIG.url}/portfolio/${project.slug}` })),
            ...projects.map((project) => ({ name: `Дизайн-референс: ${project.style}`, url: `${SITE_CONFIG.url}/catalog/${project.styleSlug}` })),
          ],
        )}
      />

      <div className="container-custom">
        <Breadcrumbs
          items={[{ name: "Фото и идеи кухонь", url: `${SITE_CONFIG.url}/portfolio` }]}
          className="mb-8"
        />

        <div className="text-center mb-12 max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Фото кухни и дизайн-референсы
          </h1>
          <p className="text-lg text-muted-foreground">
            На странице — фото кухни из опубликованной карточки «Мебельщик»
            и дизайн-референсы популярных стилей. Планировку и комплектацию
            нового заказа обсуждаем индивидуально.
          </p>
        </div>

        <section className="mb-16" aria-labelledby="published-kitchen-title">
          <figure className="premium-card overflow-hidden grid md:grid-cols-2 max-w-5xl mx-auto">
            <Image
              src="/images/published/yandex-kitchen.jpg"
              alt="Кухня с тёмными рамочными фасадами и светлой рабочей поверхностью"
              width={646}
              height={807}
              loading="lazy"
              sizes="(max-width: 768px) 100vw, 512px"
              className="w-full h-auto"
            />
            <figcaption className="p-6 md:p-8 self-center">
              <p className="text-sm text-muted-foreground mb-3">Опубликованное фото</p>
              <h2 id="published-kitchen-title" className="text-2xl font-bold mb-4">
                Фото кухни из опубликованной карточки «Мебельщик»
              </h2>
              <p className="text-muted-foreground mb-4">
                На фото — тёмные рамочные фасады и светлая рабочая поверхность.
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                Снимок опубликован в товарной записи с пометкой
                «Источник: Представитель организации».
              </p>
              <a
                href="https://yandex.com/maps/org/mebelshchik/192529825516/prices/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline underline-offset-4 hover:no-underline"
              >
                Источник: карточка «Мебельщик» в Яндекс Картах
              </a>
              <p className="text-sm text-muted-foreground mt-6">
                Размеры, материалы и стоимость будущей кухни согласуем индивидуально.
              </p>
            </figcaption>
          </figure>
        </section>

        {completedProjects.length > 0 && (
          <section className="mb-16" aria-label="Подтверждённые выполненные проекты">
            <h2 className="text-2xl font-bold mb-6">Выполненные кухни</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {completedProjects.map((project) => (
                <Link key={project.slug} href={`/portfolio/${project.slug}`} className="premium-card overflow-hidden">
                  <Image src={project.photos[0].src} alt={project.photos[0].alt} width={project.photos[0].width} height={project.photos[0].height} className="w-full aspect-[4/3] object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
                  <div className="p-6"><h3 className="font-semibold mb-2">{project.title}</h3><p className="text-sm text-muted-foreground">{project.city} · Материалы, состав стоимости и фактические сроки</p></div>
                </Link>
              ))}
            </div>
          </section>
        )}

        <section className="mb-16" aria-labelledby="design-references-title">
          <h2 id="design-references-title" className="text-2xl font-bold mb-4">
            Дизайн-референсы
          </h2>
          <p className="text-muted-foreground mb-6 max-w-3xl">
            Изображения ниже показывают идеи оформления в разных стилях.
            Используем их как отправную точку при обсуждении вашей кухни.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {projects.map((project, index) => (
              <figure
                key={project.id}
                className={`premium-card overflow-hidden group ${
                  index === 0 || index === 5 ? "row-span-2" : ""
                }`}
              >
                <Link
                  href={`/catalog/${project.styleSlug}`}
                  className="block h-full"
                >
                  <div
                    className={`relative w-full overflow-hidden ${
                      index === 0 || index === 5
                        ? "aspect-square md:aspect-auto md:h-full"
                        : "aspect-square"
                    }`}
                  >
                    <Image
                      src={project.image}
                      alt={`Дизайн-референс кухни в стиле ${project.style}`}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                      sizes="(max-width: 768px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/20 to-transparent" />
                    <figcaption className="absolute bottom-0 left-0 right-0 p-4">
                      <p className="text-card text-base font-bold">
                        {project.style}
                      </p>
                      <p className="text-card/80 text-xs mt-1 line-clamp-2">
                        {project.caption}
                      </p>
                    </figcaption>
                  </div>
                </Link>
              </figure>
            ))}
          </div>
        </section>

        <div className="text-center py-12 bg-secondary/30 rounded-3xl mb-16">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Подберём решение для вашей кухни
          </h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            Оставьте заявку и получите расчёт стоимости вашей кухни
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
