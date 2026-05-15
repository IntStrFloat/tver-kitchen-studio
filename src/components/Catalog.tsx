"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import CatalogModal from "./CatalogModal";
import { kitchenStyles, type KitchenStyle } from "@/lib/data";

const Catalog = () => {
  const [selectedKitchen, setSelectedKitchen] = useState<KitchenStyle | null>(
    null,
  );

  return (
    <section
      id="catalog"
      className="section-padding bg-secondary/30"
      aria-label="Каталог кухонь"
    >
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Наш каталог
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Популярные стили кухонь
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Выберите стиль, который вам нравится, и мы адаптируем его под ваши
            размеры и пожелания
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {kitchenStyles.map((kitchen, index) => (
            <motion.article
              key={kitchen.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`bento-item group relative ${
                kitchen.size === "large" ? "md:col-span-2 lg:col-span-1" : ""
              }`}
            >
              <Link
                href={`/catalog/${kitchen.slug}`}
                aria-label={`Кухни в стиле «${kitchen.name}» — подробнее`}
                className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <div className="aspect-square overflow-hidden">
                  <Image
                    src={kitchen.image}
                    alt={`Кухня в стиле ${kitchen.name} на заказ в Твери`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    width={600}
                    height={600}
                    loading="lazy"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>

                <div className="absolute inset-0 flex flex-col justify-end p-6 z-10 pointer-events-none">
                  <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-bold text-card">
                        {kitchen.name}
                      </h3>
                      {kitchen.priceFrom > 0 && (
                        <span className="px-3 py-1 rounded-full bg-card/90 text-foreground text-sm font-medium">
                          от {kitchen.priceFrom.toLocaleString("ru-RU")} ₽/п.м.
                        </span>
                      )}
                    </div>
                    <p className="text-card/80 text-sm mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {kitchen.description}
                    </p>
                    <span className="inline-flex items-center text-card font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      Подробнее
                      <ArrowRight
                        className="ml-2 w-4 h-4"
                        aria-hidden="true"
                      />
                    </span>
                  </div>
                </div>
              </Link>

              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setSelectedKitchen(kitchen);
                }}
                className="absolute top-4 right-4 z-20 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-card/90 backdrop-blur-sm text-foreground text-xs font-medium opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity duration-300 hover:bg-card"
                aria-label={`Быстрый просмотр кухни ${kitchen.name}`}
              >
                <Eye className="w-3.5 h-3.5" aria-hidden="true" />
                Быстрый просмотр
              </button>
            </motion.article>
          ))}
        </div>

        <div className="text-center mt-10">
          <Button asChild size="lg" variant="outline">
            <Link href="/catalog">
              Смотреть весь каталог кухонь
              <ArrowRight className="ml-2 w-5 h-5" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </div>

      <CatalogModal
        kitchen={selectedKitchen}
        isOpen={!!selectedKitchen}
        onClose={() => setSelectedKitchen(null)}
      />
    </section>
  );
};

export default Catalog;
