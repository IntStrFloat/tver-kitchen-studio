"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, ArrowUpRight } from "lucide-react";
import { cities } from "@/lib/data";

const GeoLinks = () => {
  return (
    <section
      id="geo"
      className="section-padding"
      aria-label="Доставка кухонь по Тверской области"
    >
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 max-w-3xl mx-auto"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            География работы
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Доставка кухонь по Тверской области
          </h2>
          <p className="text-lg text-muted-foreground">
            Производство и шоурум — в Твери, на ул. Коминтерна, 95. Доставляем
            и устанавливаем кухни по всей области: от Торжка и Конаково до
            Ржева, Бежецка и Нелидово.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {cities.map((city, index) => (
            <motion.div
              key={city.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <Link
                href={`/kuhni/${city.slug}`}
                className="premium-card p-5 block group h-full transition-all hover:-translate-y-1"
                aria-label={`Кухни на заказ ${city.nameIn}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <MapPin
                      className="w-5 h-5 text-primary"
                      aria-hidden="true"
                    />
                  </div>
                  <ArrowUpRight
                    className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors"
                    aria-hidden="true"
                  />
                </div>
                <h3 className="font-bold text-lg leading-tight mb-1">
                  Кухни {city.nameIn}
                </h3>
                <p className="text-xs text-muted-foreground mb-2">
                  Население {city.population} • {city.deliveryTime}
                </p>
                <p className="text-sm text-primary font-medium">
                  Доставка: {city.deliveryCost}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>

        <p className="text-center text-sm text-muted-foreground mt-10 max-w-2xl mx-auto">
          Не нашли свой город? Мы работаем по всей Тверской области и соседним
          районам. Уточните условия доставки по телефону{" "}
          <a
            href="tel:+79036302909"
            className="text-primary font-medium hover:underline"
          >
            +7 903 630 29 09
          </a>
          .
        </p>
      </div>
    </section>
  );
};

export default GeoLinks;
