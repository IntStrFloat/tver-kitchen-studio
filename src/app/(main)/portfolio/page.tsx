import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/seo/JsonLd";
import { SITE_CONFIG, generateWebPageSchema } from "@/lib/seo";
import { projects } from "@/lib/data";

export const metadata: Metadata = {
  title: "Стилевые решения и идеи для кухонь в Твери | Kuhnitver",
  description:
    "Дизайн-референсы кухонь от Kuhnitver: лофт, скандинавский, минимализм, премиум. Используем как отправную точку для индивидуального проекта под ваши размеры и планировку. Производство в Твери, фурнитура Blum и Hettich, гарантия 1 год.",
  keywords:
    "кухни фото Тверь, идеи кухонь, стили кухонь, кухни лофт, кухни минимализм, кухни скандинавский, кухни премиум",
  alternates: {
    canonical: `${SITE_CONFIG.url}/portfolio`,
  },
  openGraph: {
    title: "Стилевые решения и идеи для кухонь в Твери | Kuhnitver",
    description:
      "Дизайн-референсы кухонь от Kuhnitver: лофт, скандинавский, минимализм, премиум. Каждый проект адаптируем под ваши размеры и планировку.",
    url: `${SITE_CONFIG.url}/portfolio`,
    siteName: "Kuhnitver",
    locale: "ru_RU",
    type: "website",
    images: [
      {
        url: SITE_CONFIG.defaultOgImage,
        width: 1200,
        height: 630,
        alt: "Стилевые решения кухонь Kuhnitver — идеи для проекта",
      },
    ],
  },
};

export default function PortfolioPage() {
  return (
    <div className="min-h-screen pt-24">
      <JsonLd
        data={generateWebPageSchema(
          "Стилевые решения кухонь — идеи для вашего проекта",
          "Дизайн-референсы кухонь в разных стилях. Каждый проект — индивидуальный дизайн под ваши размеры и пожелания.",
          `${SITE_CONFIG.url}/portfolio`,
        )}
      />

      <div className="container-custom">
        <Breadcrumbs
          items={[{ name: "Наши работы", url: `${SITE_CONFIG.url}/portfolio` }]}
          className="mb-8"
        />

        <div className="text-center mb-12 max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Стилевые решения и идеи для кухонь
          </h1>
          <p className="text-lg text-muted-foreground">
            Каждая кухня от Kuhnitver разрабатывается индивидуально под ваши
            размеры, планировку и образ жизни. На странице — дизайн-референсы
            популярных стилей, которые мы берём за отправную точку. Готовый
            проект может отличаться по компоновке и материалам.
          </p>
        </div>

        <div className="bg-secondary/30 border border-border/50 rounded-2xl p-4 md:p-5 mb-10 text-sm text-foreground/80 max-w-3xl mx-auto text-center">
          Изображения — дизайн-референсы и стилевые направления. Фотографии
          готовых установок появятся по мере фотосъёмки.
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-16">
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
                    alt={`Кухня в стиле ${project.style} — пример дизайна от Kuhnitver`}
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

        <div className="text-center py-12 bg-secondary/30 rounded-3xl mb-16">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Хотите такую же кухню?
          </h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            Оставьте заявку и получите расчёт стоимости вашей кухни
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
