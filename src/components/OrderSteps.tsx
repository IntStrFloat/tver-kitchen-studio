"use client";

import { motion } from "framer-motion";
import { COMMERCIAL_TERMS } from "@/lib/data";
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
    duration: "По предварительной записи",
    description: COMMERCIAL_TERMS.measurementText,
  },
  {
    icon: FileSignature,
    title: "Смета и договор",
    duration: "После обсуждения комплектации",
    description:
      "Обсуждаем планировку, фасады, столешницу и фурнитуру. Согласуем состав сметы, порядок оплаты, сроки и гарантийные условия в договоре.",
  },
  {
    icon: PenTool,
    title: "Эскиз и утверждение",
    duration: "После заключения договора",
    description:
      "Готовим эскиз проекта для утверждения. До запуска в производство проверяем размеры, размещение техники и коммуникаций, материалы и комплектацию. Изменения согласуем до изготовления.",
  },
  {
    icon: Factory,
    title: "Производство",
    duration: "По графику в договоре",
    description: COMMERCIAL_TERMS.productionText,
  },
  {
    icon: Truck,
    title: "Доставка",
    duration: "После готовности кухни",
    description: COMMERCIAL_TERMS.deliveryText,
  },
  {
    icon: Wrench,
    title: "Установка",
    duration: "В согласованную дату",
    description: `${COMMERCIAL_TERMS.installationText} После монтажа проверяем комплектность и работу механизмов, обсуждаем уход и оформляем приёмку.`,
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
          initial={false}
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
            этапов. Состав работ, стоимость и график согласуем в договоре.
          </p>
        </motion.div>

        <ol className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((step, index) => (
            <motion.li
              key={index}
              initial={false}
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
