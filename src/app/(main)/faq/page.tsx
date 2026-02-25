import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/seo/JsonLd";
import {
  SITE_CONFIG,
  generateWebPageSchema,
  generateFAQSchema,
} from "@/lib/seo";
import { extendedFaqData } from "@/lib/data";
import FaqAccordion from "./FaqAccordion";

export const metadata: Metadata = {
  title: "Вопросы и ответы о кухнях на заказ в Твери — FAQ | TverKuhni",
  description:
    "Ответы на частые вопросы о заказе кухонь в Твери от производителя . Сколько стоит кухня? Какие сроки изготовления? Какие материалы используете? Есть ли гарантия? Как проходит замер и установка? Подробные ответы на все вопросы о кухнях на заказ.",
  keywords:
    "кухни вопросы ответы, FAQ кухни Тверь, сколько стоит кухня на заказ, сроки изготовления кухни, материалы кухни, гарантия на кухню, замер кухни Тверь",
  alternates: {
    canonical: `${SITE_CONFIG.url}/faq`,
  },
};

export default function FaqPage() {
  return (
    <div className="min-h-screen pt-24">
      <JsonLd
        data={generateWebPageSchema(
          "Вопросы и ответы о кухнях на заказ",
          "Ответы на частые вопросы о заказе кухонь в Твери",
          `${SITE_CONFIG.url}/faq`,
        )}
      />
      <JsonLd data={generateFAQSchema(extendedFaqData)} />

      <div className="container-custom">
        <Breadcrumbs
          items={[{ name: "Вопросы и ответы", url: `${SITE_CONFIG.url}/faq` }]}
          className="mb-8"
        />

        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Вопросы и ответы
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Собрали ответы на самые популярные вопросы о заказе кухонь в Твери и
            Тверской области
          </p>
        </div>

        <div className="max-w-3xl mx-auto mb-16">
          <FaqAccordion items={extendedFaqData} />
        </div>

        <div className="text-center py-12 bg-secondary/30 rounded-3xl mb-16">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Не нашли ответ на свой вопрос?
          </h2>
          <p className="text-muted-foreground mb-6">
            Свяжитесь с нами — мы с радостью ответим на все ваши вопросы
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={`tel:${SITE_CONFIG.phoneClean}`}
              className="inline-flex items-center justify-center px-8 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
            >
              {SITE_CONFIG.phone}
            </a>
            <a
              href={`${SITE_CONFIG.social.whatsapp}?text=Здравствуйте! У меня вопрос по кухням`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-3 rounded-xl border font-medium hover:bg-accent transition-colors"
            >
              Написать в WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
