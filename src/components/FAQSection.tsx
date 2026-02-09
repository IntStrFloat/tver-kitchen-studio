"use client";

import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import JsonLd from "@/components/seo/JsonLd";
import { generateFAQSchema } from "@/lib/seo";

const faqData = [
  {
    question: "Сколько стоит кухня на заказ в Твери?",
    answer:
      "Стоимость кухни на заказ зависит от размеров, выбранных материалов и фурнитуры. Наши цены начинаются от 25 000 ₽ за погонный метр. Для точного расчёта оставьте заявку — мы подготовим индивидуальное предложение бесплатно.",
  },
  {
    question: "Какие сроки изготовления кухни?",
    answer:
      "Средний срок изготовления кухни — 20 рабочих дней с момента подписания договора и утверждения проекта. Сроки могут варьироваться в зависимости от сложности проекта и загруженности производства.",
  },
  {
    question: "Доставка и установка входят в стоимость?",
    answer:
      "Да, доставка и профессиональная установка включены в стоимость кухни по Твери и ближайшим пригородам. Для удалённых районов Тверской области доставка рассчитывается отдельно.",
  },
  {
    question: "Какие материалы вы используете?",
    answer:
      "Мы используем европейскую фурнитуру Blum и Hettich, МДФ и массив дерева от проверенных поставщиков, столешницы из искусственного камня, кварца и натурального мрамора. Все материалы сертифицированы и экологически безопасны.",
  },
  {
    question: "Есть ли гарантия на кухню?",
    answer:
      "Мы предоставляем гарантию 2 года на все изделия и выполненные работы. Гарантия распространяется на мебельные конструкции, фасады, фурнитуру и монтаж. При возникновении проблем наш мастер приедет бесплатно.",
  },
  {
    question: "Можно ли оформить рассрочку?",
    answer:
      "Да, мы предлагаем рассрочку без переплат на срок до 12 месяцев. Также возможна оплата в несколько этапов: предоплата при заключении договора, оплата при доставке и после установки.",
  },
  {
    question: "Как проходит процесс заказа?",
    answer:
      "Процесс заказа включает 5 этапов: 1) Бесплатный замер — наш специалист приезжает к вам. 2) 3D-проект — вы видите будущую кухню в объёме. 3) Договор и начало производства. 4) Изготовление за 20 дней. 5) Доставка и профессиональная установка.",
  },
  {
    question: "Работаете ли вы по всей Тверской области?",
    answer:
      "Да, мы работаем по всей Тверской области: Тверь, Торжок, Ржев, Конаково, Кимры, Вышний Волочёк, Бежецк, Нелидово и другие города. Замер и доставка доступны во все населённые пункты области.",
  },
];

const FAQSection = () => {
  return (
    <section id="faq" className="section-padding">
      <div className="container-custom">
        {/* JSON-LD FAQPage schema */}
        <JsonLd data={generateFAQSchema(faqData)} />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Вопросы и ответы
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Часто задаваемые вопросы
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Ответы на популярные вопросы о заказе кухонь в TverKuhni
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto"
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqData.map((item, index) => (
              <AccordionItem
                key={index}
                value={`faq-${index}`}
                className="premium-card px-6 border-none"
              >
                <AccordionTrigger className="text-left font-semibold hover:no-underline py-5">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5 leading-relaxed">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQSection;
