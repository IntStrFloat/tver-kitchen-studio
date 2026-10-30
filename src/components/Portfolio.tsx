"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { projects } from "@/lib/data";

const Portfolio = () => {
  return (
    <section
      id="portfolio"
      className="section-padding bg-secondary/30"
      aria-label="Стилевые решения и идеи для кухонь"
    >
      <div className="container-custom">
        <motion.div
          initial={false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 max-w-3xl mx-auto"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Стили и направления
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Стилевые решения и идеи
          </h2>
          <p className="text-lg text-muted-foreground">
            На изображениях — дизайн-референсы популярных стилей. Берём за основу
            понравившееся направление и обсуждаем планировку, материалы и
            размеры для вашего помещения.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
          {projects.map((project, index) => (
            <motion.figure
              key={project.id}
              initial={false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className={`premium-card overflow-hidden group ${
                index === 0 || index === 5 ? "md:row-span-2" : ""
              }`}
            >
              <Link
                href={`/catalog/${project.styleSlug}`}
                aria-label={`Кухни в стиле ${project.style} — подробнее`}
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
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
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
            </motion.figure>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/portfolio"
            className="inline-flex items-center text-primary font-medium hover:underline"
          >
            Смотреть все идеи кухонь
            <ArrowRight className="ml-2 w-4 h-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
