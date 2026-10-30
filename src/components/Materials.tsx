"use client";

import { motion } from "framer-motion";
import { Layers, TreePine, Square, Wrench } from "lucide-react";
import { SITE_CONFIG } from "@/lib/seo";

const materials = [
  {
    icon: Layers,
    title: "Фасады из МДФ",
    description:
      "При выборе фасада сравниваем материал основы и покрытие: эмаль, плёнку, акрил или матовую поверхность. Цвет, фактуру, обработку кромки и правила ухода уточняем по образцу конкретного производителя. Устойчивость к влаге и нагреву зависит от выбранного материала и конструкции.",
    keyPoints: [
      "Эмаль, ПВХ, акрил, Soft-touch",
      "Цвет и фактура по образцам",
      "Характеристики выбранного материала",
    ],
  },
  {
    icon: TreePine,
    title: "Массив дерева: дуб, ясень, бук",
    description:
      "Массив можно рассмотреть для фасадов и отдельных деталей. До заказа согласуем породу, оттенок, защитное покрытие и допустимые условия эксплуатации. Возможность ремонта или обновления покрытия зависит от конкретной конструкции и отделки.",
    keyPoints: [
      "Порода и рисунок древесины",
      "Масло-воск или лак",
      "Уход по инструкции к покрытию",
    ],
  },
  {
    icon: Square,
    title: "Столешницы: кварц, искусственный камень, мрамор",
    description:
      "Для столешницы выбираем материал с учётом ежедневной нагрузки, расположения мойки и техники, формы и бюджета. Кварцевый агломерат, акриловый камень, дерево и натуральный камень отличаются требованиями к уходу, обработке стыков и ремонту. Толщину, кромку, вырезы и примыкания включаем в спецификацию.",
    keyPoints: [
      "Толщина и вырезы по проекту",
      "Согласованные места стыков",
      "Кромка по индивидуальному эскизу",
    ],
  },
  {
    icon: Wrench,
    title: "Фурнитура: Blum и Hettich",
    description:
      "Подбираем петли, направляющие, подъёмные механизмы и системы открывания под размеры и вес фасадов. Варианты Blum и Hettich сравниваем по конкретной серии и комплектации. Модели, количество механизмов, допустимую нагрузку и гарантийные условия уточняем до заказа.",
    keyPoints: [
      "Доводчики по комплектации",
      "Системы push-to-open",
      "Модели механизмов в спецификации",
    ],
  },
];

const Materials = () => {
  return (
    <section
      id="materials"
      className="section-padding"
      aria-label="Материалы и комплектующие для кухонь"
    >
      <div className="container-custom">
        <motion.div
          initial={false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 max-w-3xl mx-auto"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Материалы
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Из чего мы делаем кухни
          </h2>
          <p className="text-lg text-muted-foreground">
            Подбираем материалы и фурнитуру под бюджет и стиль каждого проекта.
            Наличие конкретных моделей, характеристики и документы на выбранные
            комплектующие уточняем при согласовании проекта.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {materials.map((m, index) => (
            <motion.article
              key={index}
              initial={false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="premium-card p-6 md:p-8"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <m.icon
                    className="w-6 h-6 text-primary"
                    aria-hidden="true"
                  />
                </div>
                <h3 className="text-xl md:text-2xl font-bold leading-snug">
                  {m.title}
                </h3>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-4">
                {m.description}
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                {m.keyPoints.map((point, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-2 text-foreground/80"
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0"
                      aria-hidden="true"
                    />
                    {point}
                  </li>
                ))}
              </ul>
            </motion.article>
          ))}
        </div>

        <p className="text-center text-muted-foreground mt-10 max-w-2xl mx-auto">
          Обсудить образцы можно по адресу: {SITE_CONFIG.address.locality},{" "}
          {SITE_CONFIG.address.street}. Перед визитом уточните наличие
          интересующего материала по телефону {SITE_CONFIG.phone}.
        </p>
      </div>
    </section>
  );
};

export default Materials;
