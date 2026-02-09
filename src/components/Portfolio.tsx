"use client";

import { motion } from "framer-motion";
import { Star, MapPin } from "lucide-react";
import JsonLd from "@/components/seo/JsonLd";
import { SITE_CONFIG } from "@/lib/seo";

const projects = [
  { id: 1, image: "/images/kitchen-loft.jpg", location: "ул. Радищева, Тверь", style: "лофт" },
  {
    id: 2,
    image: "/images/kitchen-scandi.jpg",
    location: "Пролетарский р-н, Тверь",
    style: "скандинавский",
  },
  {
    id: 3,
    image: "/images/kitchen-classic.jpg",
    location: "ул. Советская, Торжок",
    style: "классика",
  },
  {
    id: 4,
    image: "/images/kitchen-modern.jpg",
    location: "мкр. Южный, Тверь",
    style: "минимализм",
  },
  { id: 5, image: "/images/kitchen-emerald.jpg", location: "г. Конаково", style: "изумруд" },
  {
    id: 6,
    image: "/images/hero-kitchen.jpg",
    location: "ул. Горького, Ржев",
    style: "премиум",
  },
];

const testimonials = [
  {
    id: 1,
    name: "Анна М.",
    location: "Тверь",
    rating: 5,
    text: "Заказывали кухню в стиле лофт. Результат превзошёл все ожидания! Качество материалов отличное, установка заняла один день.",
  },
  {
    id: 2,
    name: "Игорь П.",
    location: "Торжок",
    rating: 5,
    text: "Долго выбирали между разными производителями. Рады, что остановились на TverKuhni. Цена-качество на высоте.",
  },
  {
    id: 3,
    name: "Елена С.",
    location: "Конаково",
    rating: 5,
    text: "Бесплатный 3D-проект помог визуализировать идею. Дизайнер учёл все наши пожелания. Рекомендую!",
  },
];

// JSON-LD для отзывов (Review schema)
const reviewsSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${SITE_CONFIG.url}/#localbusiness`,
  name: SITE_CONFIG.name,
  review: testimonials.map((t) => ({
    "@type": "Review",
    author: {
      "@type": "Person",
      name: t.name,
    },
    reviewBody: t.text,
    reviewRating: {
      "@type": "Rating",
      ratingValue: t.rating,
      bestRating: 5,
      worstRating: 1,
    },
    datePublished: "2025-01-15",
  })),
};

const Portfolio = () => {
  return (
    <section
      id="portfolio"
      className="section-padding bg-secondary/30"
      aria-label="Портфолио и отзывы"
    >
      <div className="container-custom">
        {/* Reviews Schema */}
        <JsonLd data={reviewsSchema} />

        {/* Portfolio Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Наши работы
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Реализованные проекты
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Более 500 кухонь установлено в Твери и Тверской области
          </p>
        </motion.div>

        {/* Masonry Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-16">
          {projects.map((project, index) => (
            <motion.figure
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`premium-card overflow-hidden group ${
                index === 0 || index === 5 ? "row-span-2" : ""
              }`}
            >
              <div
                className={`relative ${index === 0 || index === 5 ? "aspect-[3/4]" : "aspect-square"}`}
              >
                <img
                  src={project.image}
                  alt={`Кухня в стиле ${project.style} — ${project.location}, установка TverKuhni`}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  width={400}
                  height={index === 0 || index === 5 ? 533 : 400}
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <figcaption className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <div className="flex items-center gap-2 text-card text-sm">
                    <MapPin className="w-4 h-4" aria-hidden="true" />
                    {project.location}
                  </div>
                </figcaption>
              </div>
            </motion.figure>
          ))}
        </div>

        {/* Testimonials */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            Отзывы наших клиентов
          </h3>
          <p className="text-muted-foreground">
            Более 98% клиентов рекомендуют нас своим друзьям
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.article
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="premium-card p-6"
              itemScope
              itemType="https://schema.org/Review"
            >
              <div
                className="flex items-center gap-1 mb-4"
                aria-label={`Оценка: ${testimonial.rating} из 5`}
              >
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 fill-primary text-primary"
                    aria-hidden="true"
                  />
                ))}
              </div>
              <blockquote
                className="text-foreground/90 mb-4 leading-relaxed"
                itemProp="reviewBody"
              >
                &laquo;{testimonial.text}&raquo;
              </blockquote>
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold"
                  aria-hidden="true"
                >
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
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
