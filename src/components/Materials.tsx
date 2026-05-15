"use client";

import { motion } from "framer-motion";
import { Layers, TreePine, Square, Wrench } from "lucide-react";

const materials = [
  {
    icon: Layers,
    title: "МДФ-фасады: Egger, Kronospan",
    description:
      "Используем плиты МДФ от европейских и российских производителей Egger и Kronospan с покрытием эмалью, плёнкой ПВХ или Soft-touch. Влагостойкие, устойчивые к перепадам температуры, не выцветают на солнце. Подходят для любого стиля — от лофта до минимализма. Доступны более 200 оттенков и текстур.",
    keyPoints: [
      "Эмаль, ПВХ, акрил, Soft-touch",
      "Гарантия от выцветания",
      "Класс эмиссии E0/E1",
    ],
  },
  {
    icon: TreePine,
    title: "Массив дерева: дуб, ясень, бук",
    description:
      "Для классических кухонь и проектов премиум-класса работаем с массивом дуба, ясеня и бука. Древесина сушится в собственных камерах до 8% влажности, обрабатывается тонированными маслами и лаками премиум-класса. При правильном уходе фасады из массива служат десятилетиями и поддаются реставрации.",
    keyPoints: [
      "Камерная сушка до 8% влажности",
      "Масло-воск или лак",
      "Возможна реставрация",
    ],
  },
  {
    icon: Square,
    title: "Столешницы: кварц, искусственный камень, мрамор",
    description:
      "Предлагаем столешницы из кварцевого агломерата (Caesarstone, Vicostone), искусственного камня (акриловые поверхности Staron, Hi-Macs), массива дуба с маслом и натурального мрамора. Кварц — оптимальный выбор для ежедневной нагрузки: не впитывает влагу, устойчив к царапинам и пятнам, ремонт обычно не требуется.",
    keyPoints: [
      "Толщина 20, 30, 40 мм",
      "Бесшовные стыки",
      "Кромка по индивидуальному эскизу",
    ],
  },
  {
    icon: Wrench,
    title: "Фурнитура: Blum и Hettich",
    description:
      "Устанавливаем только оригинальную европейскую фурнитуру: австрийский Blum и немецкий Hettich. Петли Blum CLIP top с доводчиком BLUMOTION, направляющие TANDEMBOX с системой SERVO-DRIVE, подъёмные механизмы AVENTOS. Гарантия производителя — от 10 до пожизненной. Эта фурнитура определяет «ощущение» кухни на годы вперёд.",
    keyPoints: [
      "Доводчики BLUMOTION",
      "Системы push-to-open",
      "Гарантия Blum до пожизненной",
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
          initial={{ opacity: 0, y: 30 }}
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
            Работаем с проверенными европейскими и российскими брендами — Blum,
            Hettich, Egger, Kronospan, Caesarstone — и предоставляем
            сертификаты на все комплектующие.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {materials.map((m, index) => (
            <motion.article
              key={index}
              initial={{ opacity: 0, y: 30 }}
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
          Все материалы можно посмотреть и потрогать в нашем шоуруме в Твери на
          ул. Коминтерна, 95. Замерщик также привозит образцы на встречу
          бесплатно.
        </p>
      </div>
    </section>
  );
};

export default Materials;
