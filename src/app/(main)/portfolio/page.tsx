import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/seo/JsonLd";
import { SITE_CONFIG, generateWebPageSchema } from "@/lib/seo";
import { projects, testimonials } from "@/lib/data";

export const metadata: Metadata = {
  title: "Наши работы — фото реализованных кухонь в Твери и отзывы | TverKuhni",
  description:
    "Портфолио кухонь на заказ от : более 500 проектов в Твери и Тверской области. Фотографии установленных кухонь в стилях лофт, минимализм, скандинавский, премиум. Реальные отзывы клиентов с оценкой 4.9 из 5. Смотрите результаты нашей работы и убедитесь в качестве.",
  keywords:
    "кухни фото Тверь, портфолио кухонь, реализованные проекты кухни, отзывы кухни Тверь, кухни до и после, примеры кухонь на заказ, кухни в интерьере Тверь",
  alternates: {
    canonical: `${SITE_CONFIG.url}/portfolio`,
  },
};

export default function PortfolioPage() {
  const reviewsSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${SITE_CONFIG.url}/#localbusiness`,
    name: SITE_CONFIG.name,
    review: testimonials.map((t) => ({
      "@type": "Review",
      author: { "@type": "Person", name: t.name },
      reviewBody: t.text,
      reviewRating: {
        "@type": "Rating",
        ratingValue: t.rating,
        bestRating: 5,
        worstRating: 1,
      },
      datePublished: t.date,
    })),
  };

  return (
    <div className="min-h-screen pt-24">
      <JsonLd
        data={generateWebPageSchema(
          "Наши работы — реализованные проекты кухонь",
          "Более 500 кухонь установлено в Твери и Тверской области",
          `${SITE_CONFIG.url}/portfolio`,
        )}
      />
      <JsonLd data={reviewsSchema} />

      <div className="container-custom">
        <Breadcrumbs
          items={[{ name: "Наши работы", url: `${SITE_CONFIG.url}/portfolio` }]}
          className="mb-8"
        />

        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Реализованные проекты кухонь в Твери
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Более 500 кухонь установлено в Твери и Тверской области. Каждый
            проект — индивидуальный дизайн под размеры и пожелания заказчика.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-16">
          {projects.map((project, index) => (
            <figure
              key={project.id}
              className={`premium-card overflow-hidden group ${
                index === 0 || index === 5 ? "row-span-2" : ""
              }`}
            >
              <div
                className={`relative ${
                  index === 0 || index === 5 ? "aspect-[3/4]" : "aspect-square"
                }`}
              >
                <Image
                  src={project.image}
                  alt={`Кухня в стиле ${project.style} — ${project.location}, установка TverKuhni`}
                  width={400}
                  height={index === 0 || index === 5 ? 533 : 400}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <figcaption className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <p className="text-card text-sm">{project.location}</p>
                  <p className="text-card/70 text-xs">Стиль: {project.style}</p>
                </figcaption>
              </div>
            </figure>
          ))}
        </div>

        <div className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center">
            Отзывы наших клиентов
          </h2>
          <p className="text-muted-foreground text-center mb-8">
            Более 98% клиентов рекомендуют нас своим друзьям
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <article
                key={testimonial.id}
                className="premium-card p-6"
                itemScope
                itemType="https://schema.org/Review"
              >
                <div
                  className="flex items-center gap-1 mb-4"
                  aria-label={`Оценка: ${testimonial.rating} из 5`}
                >
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-5 h-5 fill-primary text-primary"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </div>
                <blockquote
                  className="text-foreground/90 mb-4 leading-relaxed"
                  itemProp="reviewBody"
                >
                  &laquo;{testimonial.text}&raquo;
                </blockquote>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                    {testimonial.name[0]}
                  </div>
                  <div>
                    <div className="font-medium" itemProp="author">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {testimonial.location}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
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
