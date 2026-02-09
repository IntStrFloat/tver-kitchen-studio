"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import CatalogModal from "./CatalogModal";

const kitchens = [
  {
    id: 1,
    name: "Лофт",
    price: "от 28 000 ₽/п.м.",
    image: "/images/kitchen-loft.jpg",
    description:
      "Индустриальный стиль с кирпичными стенами и металлическими акцентами",
    materials: [
      "МДФ с покрытием Soft-touch",
      "Столешница из массива дуба",
      "Фурнитура Blum",
    ],
    size: "large",
  },
  {
    id: 2,
    name: "Скандинавский",
    price: "от 25 000 ₽/п.м.",
    image: "/images/kitchen-scandi.jpg",
    description: "Минимализм и функциональность северного дизайна",
    materials: [
      "Крашеный МДФ",
      "Столешница из искусственного камня",
      "Фурнитура Hettich",
    ],
    size: "medium",
  },
  {
    id: 3,
    name: "Классика",
    price: "от 35 000 ₽/п.м.",
    image: "/images/kitchen-classic.jpg",
    description: "Вечная элегантность с современными удобствами",
    materials: ["Массив ясеня", "Мраморная столешница", "Фурнитура Blum"],
    size: "medium",
  },
  {
    id: 4,
    name: "Минимализм",
    price: "от 30 000 ₽/п.м.",
    image: "/images/kitchen-modern.jpg",
    description: "Чистые линии и скрытые системы хранения",
    materials: [
      "Акриловые фасады",
      "Столешница Dekton",
      "Системы push-to-open",
    ],
    size: "medium",
  },
  {
    id: 5,
    name: "Изумруд",
    price: "от 38 000 ₽/п.м.",
    image: "/images/kitchen-emerald.jpg",
    description: "Роскошный изумрудный цвет с латунными акцентами",
    materials: [
      "Крашеный МДФ Emerald",
      "Кварцевая столешница",
      "Латунная фурнитура",
    ],
    size: "large",
  },
  {
    id: 6,
    name: "Премиум",
    price: "от 45 000 ₽/п.м.",
    image: "/images/hero-kitchen.jpg",
    description: "Эксклюзивные материалы и индивидуальный дизайн",
    materials: [
      "Итальянские фасады",
      "Натуральный мрамор",
      "Фурнитура премиум-класса",
    ],
    size: "medium",
  },
];

const Catalog = () => {
  const [selectedKitchen, setSelectedKitchen] = useState<
    (typeof kitchens)[0] | null
  >(null);

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

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {kitchens.map((kitchen, index) => (
            <motion.article
              key={kitchen.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`bento-item group ${kitchen.size === "large" ? "md:col-span-2 lg:col-span-1" : ""}`}
              onClick={() => setSelectedKitchen(kitchen)}
              role="button"
              tabIndex={0}
              aria-label={`Кухня ${kitchen.name} — ${kitchen.price}`}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setSelectedKitchen(kitchen);
                }
              }}
            >
              <div className="aspect-square overflow-hidden">
                <img
                  src={kitchen.image}
                  alt={`Кухня в стиле ${kitchen.name} на заказ в Твери — ${kitchen.price}`}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  width={600}
                  height={600}
                  loading="lazy"
                />
              </div>

              {/* Content overlay */}
              <div className="absolute inset-0 flex flex-col justify-end p-6 z-10">
                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-card">
                      {kitchen.name}
                    </h3>
                    <span className="px-3 py-1 rounded-full bg-card/90 text-foreground text-sm font-medium">
                      {kitchen.price}
                    </span>
                  </div>
                  <p className="text-card/80 text-sm mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {kitchen.description}
                  </p>
                  <Button
                    variant="secondary"
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    tabIndex={-1}
                    aria-hidden="true"
                  >
                    Подробнее
                    <ArrowRight className="ml-2 w-4 h-4" aria-hidden="true" />
                  </Button>
                </div>
              </div>
            </motion.article>
          ))}
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
