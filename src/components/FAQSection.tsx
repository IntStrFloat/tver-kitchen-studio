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
import { extendedFaqData } from "@/lib/data";

// Показываем первые 8 вопросов на главной странице (компактный вид)
const faqData = extendedFaqData.slice(0, 8);

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
            Ответы на популярные вопросы о заказе кухонь в Kuhnitver
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

          <div className="text-center mt-8">
            <a href="/faq" className="text-primary font-medium hover:underline">
              Все вопросы и ответы →
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQSection;
