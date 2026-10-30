import type { Metadata } from "next";
import Link from "next/link";
import {
  CalendarDays,
  Factory,
  Layers,
  PenTool,
  ShieldCheck,
  Timer,
} from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/seo/JsonLd";
import { SITE_CONFIG, generateWebPageSchema } from "@/lib/seo";
import { COMMERCIAL_TERMS } from "@/lib/data";

export const metadata: Metadata = {
  title:
    "О компании Kuhnitver — кухни по индивидуальным размерам в Твери | Kuhnitver",
  description:
    "Kuhnitver — изготовление кухонь на заказ в Твери. Как согласуются замер, комплектация, смета, проект и сроки. Доставка, монтаж и гарантийные обращения. Адрес и контакты.",
  keywords:
    "Kuhnitver, производитель кухонь Тверь, о компании, кухни по размерам, условия заказа кухни",
  alternates: {
    canonical: `${SITE_CONFIG.url}/about`,
  },
  openGraph: {
    title:
      "О компании Kuhnitver — кухни по индивидуальным размерам в Твери | Kuhnitver",
    description:
      "Кухни на заказ в Твери: согласование проекта, комплектации, сметы и сроков. Условия замера, доставки, монтажа и обращения по гарантии.",
    url: `${SITE_CONFIG.url}/about`,
    siteName: "Kuhnitver",
    locale: "ru_RU",
    type: "website",
    images: [
      {
        url: SITE_CONFIG.defaultOgImage,
        width: 1200,
        height: 630,
        alt: "О компании Kuhnitver — кухни на заказ в Твери",
      },
    ],
  },
};

const advantages = [
  {
    title: "Изготовление по размерам",
    description:
      "Проект учитывает размеры помещения, размещение коммуникаций и выбранную технику.",
    Icon: Factory,
  },
  {
    title: "Согласованная смета",
    description: COMMERCIAL_TERMS.pricingText,
    Icon: CalendarDays,
  },
  {
    title: "Подбор комплектации",
    description:
      "Материалы, покрытия, столешницу и модели фурнитуры согласуем по образцам и спецификации.",
    Icon: Layers,
  },
  {
    title: "Гарантийные условия",
    description: COMMERCIAL_TERMS.warrantyText,
    Icon: ShieldCheck,
  },
  {
    title: "Эскиз проекта",
    description:
      "После заключения договора предоставляется эскиз проекта на утверждение.",
    Icon: PenTool,
  },
  {
    title: "Согласованный график",
    description: COMMERCIAL_TERMS.productionText,
    Icon: Timer,
  },
];

const processSteps = [
  {
    step: 1,
    title: "Замер",
    description: COMMERCIAL_TERMS.measurementText,
  },
  {
    step: 2,
    title: "Договор и аванс",
    description:
      "Согласуем смету и договор, порядок оплаты и эскиз проекта. Изготовление начинается после утверждения проекта и комплектации.",
  },
  {
    step: 3,
    title: "Производство",
    description: COMMERCIAL_TERMS.productionText,
  },
  {
    step: 4,
    title: "Доставка и сборка",
    description: `${COMMERCIAL_TERMS.deliveryText} ${COMMERCIAL_TERMS.installationText}`,
  },
];

export default function AboutPage() {
  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "Как заказать кухню в Kuhnitver",
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
          "О компании Kuhnitver — производство кухонь в Твери",
          "Изготовление кухонь по размерам в Твери: проект, смета, сроки и условия заказа",
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
            Производим кухни <span className="text-primary">по вашим размерам</span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Kuhnitver изготавливает кухонную мебель по индивидуальным размерам
            в Твери. Обсуждаем планировку, материалы и технику, согласуем проект,
            состав сметы и порядок работ до изготовления.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {advantages.map((item, index) => (
            <div key={index} className="premium-card p-6 text-center">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <item.Icon
                  className="w-6 h-6 text-primary"
                  aria-hidden="true"
                />
              </div>
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
          <div className="grid md:grid-cols-4 gap-4">
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

        <section className="bg-secondary/30 rounded-3xl p-8 md:p-12 mb-16">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-bold mb-3">Где обсудить проект</h2>
              <address className="not-italic text-muted-foreground">
                {SITE_CONFIG.name}, {SITE_CONFIG.address.locality},{" "}
                {SITE_CONFIG.address.street}.<br />
                {SITE_CONFIG.openingHours.label}.
              </address>
              <Link href="/contacts" className="inline-block text-primary hover:underline mt-3">
                Контакты и маршрут
              </Link>
            </div>
            <div>
              <h2 className="text-xl font-bold mb-3">Обращение по гарантии</h2>
              <p className="text-muted-foreground">{COMMERCIAL_TERMS.warrantyText}</p>
              <a href={`mailto:${SITE_CONFIG.email}`} className="inline-block text-primary hover:underline mt-3">
                {SITE_CONFIG.email}
              </a>
            </div>
          </div>
        </section>

        <div className="text-center py-12 bg-primary/5 rounded-3xl mb-16">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Готовы заказать кухню?
          </h2>
          <p className="text-muted-foreground mb-6">
            Замер, расчёт стоимости кухни
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/#quiz"
              className="inline-flex items-center justify-center px-8 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
            >
              Получить предварительный расчёт
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
