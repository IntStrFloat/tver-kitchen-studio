"use client";

import { motion } from "framer-motion";
import {
  Ruler,
  PenTool,
  FileSignature,
  Factory,
  Truck,
  Wrench,
} from "lucide-react";

const steps = [
  {
    icon: Ruler,
    title: "Замер",
    duration: "1 день",
    description:
      "Замерщик приезжает в удобное время по Твери и области. Снимает размеры, фотографирует стены, отмечает розетки и коммуникации, привозит образцы материалов. Стоимость — 1 500 ₽, при заказе вычитается из стоимости кухни.",
  },
  {
    icon: PenTool,
    title: "Эскиз проекта",
    duration: "3–5 дней",
    description:
      "После замера и обсуждения пожеланий дизайнер готовит эскиз: планировку, фасады, столешницу, фурнитуру и итоговую смету. Эскиз согласуется и корректируется до полного соответствия вашим ожиданиям.",
  },
  {
    icon: FileSignature,
    title: "Договор и аванс",
    duration: "1 день",
    description:
      "Заключаем договор с фиксированной ценой, сроками и условиями гарантии. Вносится аванс. После заключения договора предоставляется детализированный эскиз проекта на финальное утверждение.",
  },
  {
    icon: Factory,
    title: "Производство",
    duration: "от 20 рабочих дней",
    description:
      "Изготовление на собственном производстве в Твери. Раскрой ЛДСП и МДФ на немецких станках с ЧПУ, кромкование, сборка корпусов, покраска фасадов или поклейка плёнки, монтаж фурнитуры Blum/Hettich. Все операции контролируем сами.",
  },
  {
    icon: Truck,
    title: "Доставка",
    duration: "1–2 дня",
    description:
      "Аккуратная упаковка и доставка по Твери — бесплатно. По Тверской области — от 3 000 ₽. Привозим разобранную кухню комплектами: корпуса, фасады, столешница, фурнитура. Заносим на этаж.",
  },
  {
    icon: Wrench,
    title: "Установка",
    duration: "1–3 дня",
    description:
      "Профессиональный монтаж нашей бригадой: сборка корпусов, выравнивание по уровню, установка столешницы и подключение к мойке. По окончании — приёмка работ и инструктаж по уходу. Гарантия 1 год по договору на изделия и монтаж.",
  },
];

const OrderSteps = () => {
  return (
    <section
      id="order-steps"
      className="section-padding bg-secondary/30"
      aria-label="Этапы заказа кухни"
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
            Как мы работаем
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Этапы заказа кухни
          </h2>
          <p className="text-lg text-muted-foreground">
            От первого звонка до готовой кухни в вашей квартире — шесть
            понятных шагов с прозрачными сроками и фиксированной ценой по
            договору.
          </p>
        </motion.div>

        <ol className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((step, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="premium-card p-6 relative"
            >
              <div className="flex items-center gap-3 mb-3">
                <span
                  className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg flex-shrink-0"
                  aria-hidden="true"
                >
                  {index + 1}
                </span>
                <step.icon
                  className="w-6 h-6 text-primary"
                  aria-hidden="true"
                />
              </div>
              <h3 className="text-xl font-bold mb-1">{step.title}</h3>
              <p className="text-sm text-primary font-medium mb-3">
                {step.duration}
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
};

export default OrderSteps;
