import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/seo/JsonLd";
import { SITE_CONFIG, generateWebPageSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: "О компании TverKuhni — производство кухонь в Твери с 2014 года | TverKuhni",
  description:
    "TverKuhni — собственное производство кухонь на заказ в Твери с 2014 года. Более 500 проектов, европейские материалы, гарантия 2 года. Команда профессионалов.",
  keywords:
    "TverKuhni, производитель кухонь Тверь, о компании, мебельная фабрика Тверь",
  alternates: {
    canonical: `${SITE_CONFIG.url}/about`,
  },
};

const advantages = [
  {
    title: "Собственное производство",
    description: "Полный цикл производства в Твери — от раскроя до сборки. Контроль качества на каждом этапе.",
    icon: "🏭",
  },
  {
    title: "10+ лет опыта",
    description: "Работаем с 2014 года. Более 500 кухонь установлено в Твери и Тверской области.",
    icon: "📅",
  },
  {
    title: "Европейские материалы",
    description: "Фурнитура Blum и Hettich, сертифицированные МДФ, кварц и натуральный камень.",
    icon: "🇪🇺",
  },
  {
    title: "Гарантия 2 года",
    description: "На все изделия и выполненные работы. Гарантийный мастер выезжает бесплатно.",
    icon: "🛡️",
  },
  {
    title: "Бесплатный 3D-проект",
    description: "Визуализация вашей кухни в объёме до начала производства. Все правки бесплатно.",
    icon: "🎨",
  },
  {
    title: "Готовность за 20 дней",
    description: "Средний срок изготовления — 20 рабочих дней. Соблюдаем сроки по договору.",
    icon: "⏱️",
  },
];

const processSteps = [
  { step: 1, title: "Бесплатный замер", description: "Наш специалист приезжает к вам, снимает все размеры и обсуждает пожелания" },
  { step: 2, title: "3D-проект", description: "Дизайнер создаёт 3D-визуализацию — вы видите будущую кухню в объёме" },
  { step: 3, title: "Договор", description: "Утверждаем проект, фиксируем стоимость и сроки в договоре" },
  { step: 4, title: "Производство", description: "Изготавливаем кухню на собственном производстве в Твери за 20 дней" },
  { step: 5, title: "Установка", description: "Доставляем и профессионально устанавливаем кухню у вас дома" },
];

export default function AboutPage() {
  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "Как заказать кухню в TverKuhni",
    description: "Пошаговый процесс заказа кухни от замера до установки",
    step: processSteps.map((s) => ({
      "@type": "HowToStep",
      position: s.step,
      name: s.title,
      text: s.description,
    })),
  };

  return (
    <div className="min-h-screen pt-24">
      <JsonLd
        data={generateWebPageSchema(
          "О компании TverKuhni — производство кухонь в Твери",
          "Собственное производство кухонь на заказ в Твери с 2014 года",
          `${SITE_CONFIG.url}/about`,
        )}
      />
      <JsonLd data={howToSchema} />

      <div className="container-custom">
        <Breadcrumbs
          items={[{ name: "О компании", url: `${SITE_CONFIG.url}/about` }]}
          className="mb-8"
        />

        <div className="max-w-4xl mx-auto text-center mb-16">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Производим кухни{" "}
            <span className="text-primary">с 2014 года</span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            TverKuhni — это собственное производство кухонной мебели в Твери.
            Мы создаём кухни, которые объединяют семьи: функциональные,
            красивые и доступные по цене. За 10 лет мы реализовали более 500
            проектов по Твери и Тверской области.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {advantages.map((item, index) => (
            <div key={index} className="premium-card p-6 text-center">
              <div className="text-4xl mb-4">{item.icon}</div>
              <h2 className="text-lg font-semibold mb-2">{item.title}</h2>
              <p className="text-sm text-muted-foreground">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
            Как мы работаем
          </h2>
          <div className="grid md:grid-cols-5 gap-4">
            {processSteps.map((step) => (
              <div key={step.step} className="text-center">
                <div className="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {step.step}
                </div>
                <h3 className="font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-secondary/30 rounded-3xl p-8 md:p-12 mb-16">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { value: "10+", label: "лет на рынке" },
              { value: "500+", label: "проектов выполнено" },
              { value: "98%", label: "клиентов рекомендуют" },
              { value: "2 года", label: "гарантия" },
            ].map((stat, i) => (
              <div key={i}>
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center py-12 bg-primary/5 rounded-3xl mb-16">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Готовы заказать кухню?
          </h2>
          <p className="text-muted-foreground mb-6">
            Бесплатный замер, 3D-проект и расчёт стоимости
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/#quiz"
              className="inline-flex items-center justify-center px-8 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
            >
              Рассчитать стоимость
            </Link>
            <a
              href={`tel:${SITE_CONFIG.phoneClean}`}
              className="inline-flex items-center justify-center px-8 py-3 rounded-xl border font-medium hover:bg-accent transition-colors"
            >
              {SITE_CONFIG.phone}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
