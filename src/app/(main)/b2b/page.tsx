import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/seo/JsonLd";
import { SITE_CONFIG, generateWebPageSchema } from "@/lib/seo";
import B2BCategoryCard from "@/components/B2BCategoryCard";
import type { B2BCategory } from "@/components/B2BCategoryCard";

export const metadata: Metadata = {
  title:
    "Мебель для бизнеса на заказ — офисная, торговая, гостиничная, учебная |  Тверь",
  description:
    "Производство мебели для бизнеса в Твери от производителя Kuhnitver. Офисные столы и стеллажи, торговые витрины и прилавки, мебель для гостиниц и образовательных учреждений. Работаем по договору с юрлицами и ИП. Серийное производство любых объёмов, индивидуальные проекты. Срок от 20 рабочих дней.",
  keywords:
    "офисная мебель Тверь, торговое оборудование Тверь, мебель для бизнеса на заказ, мебель для гостиниц, мебель для школ Тверь, мебель B2B Тверь, корпоративная мебель",
  alternates: {
    canonical: `${SITE_CONFIG.url}/b2b`,
  },
  openGraph: {
    title:
      "Мебель для бизнеса на заказ — офисная, торговая, гостиничная, учебная |  Тверь",
    description:
      "Производство мебели для бизнеса в Твери: офисная, торговая, гостиничная и учебная мебель. Работаем по договору с юрлицами и ИП. Серийное производство любых объёмов. Срок от 20 рабочих дней.",
    url: `${SITE_CONFIG.url}/b2b`,
    siteName: "Kuhnitver",
    locale: "ru_RU",
    type: "website",
    images: [
      {
        url: "https://kuhnitver.ru/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Мебель для бизнеса на заказ — офисная, торговая, гостиничная | Тверь",
      },
    ],
  },
};

const b2bCategories: B2BCategory[] = [
  {
    title: "Офисная мебель",
    description:
      "Столы, тумбы, шкафы и стеллажи для офисов. Производим мебель по индивидуальным размерам под ваше помещение. Корпоративные заказы любого объёма.",
    features: [
      "Рабочие столы и конференц-столы",
      "Шкафы и стеллажи для документов",
      "Ресепшн-стойки",
      "Тумбы и комоды",
    ],
    icon: "🏢",
    examples: [
      {
        title: "Офис IT-компании",
        description:
          "Рабочие столы с кабель-менеджментом, тумбы, стеллажи. Комплектация на 25 рабочих мест.",
        image: "/images/b2b-office-1.jpg",
        location: "г. Тверь, Бизнес-центр",
      },
      {
        title: "Ресепшн-стойка",
        description:
          "Стойка ресепшн с подсветкой и встроенными ящиками из МДФ с покрытием Soft-touch.",
        image: "/images/b2b-office-2.jpg",
        location: "г. Тверь, ул. Советская",
      },
      {
        title: "Конференц-зал",
        description:
          "Большой конференц-стол на 12 человек с интегрированными розетками и кабель-каналами.",
        image: "/images/b2b-office-3.jpg",
        location: "г. Тверь, ТЦ «Олимп»",
      },
      {
        title: "Шкафы для документов",
        description:
          "Серия шкафов и стеллажей для архивного хранения. МДФ с ламинацией, замки.",
        image: "/images/b2b-office-4.jpg",
        location: "г. Торжок",
      },
    ],
  },
  {
    title: "Торговое оборудование",
    description:
      "Витрины, прилавки, стеллажи и торговые стойки для магазинов и торговых точек. Проектируем и изготавливаем под формат вашего бизнеса.",
    features: [
      "Торговые витрины и прилавки",
      "Стеллажи для товаров",
      "Кассовые зоны",
      "Выставочные стенды",
    ],
    icon: "🏪",
    examples: [
      {
        title: "Витрины для пекарни",
        description:
          "Хлебные витрины с подсветкой и стеклянными полками. Натуральное дерево и металл.",
        image: "/images/b2b-retail-1.jpg",
        location: "г. Тверь, ТЦ «Мебельный»",
      },
      {
        title: "Кассовая зона магазина",
        description:
          "Кассовый модуль с прилавком, витриной мелкого товара и местом для упаковки.",
        image: "/images/b2b-retail-2.jpg",
        location: "г. Конаково",
      },
      {
        title: "Островной стеллаж",
        description:
          "Двусторонние островные стеллажи для торгового зала. Регулируемые полки, подсветка.",
        image: "/images/b2b-retail-3.jpg",
        location: "г. Тверь, Пролетарский р-н",
      },
      {
        title: "Выставочный стенд",
        description:
          "Модульный стенд для выставки продукции. Быстрая сборка/разборка, транспортировка.",
        image: "/images/b2b-retail-4.jpg",
        location: "г. Тверь",
      },
    ],
  },
  {
    title: "Мебель для гостиниц и хостелов",
    description:
      "Комплектация номеров: кровати, шкафы, столы, тумбы. Производим серийные партии мебели для гостиничного бизнеса с единым стилем.",
    features: [
      "Кровати и прикроватные тумбы",
      "Платяные шкафы",
      "Рабочие столы для номеров",
      "Мебель для лобби и ресепшн",
    ],
    icon: "🏨",
    examples: [
      {
        title: "Номер стандарт",
        description:
          "Комплект мебели для стандартного номера: кровать, тумбы, шкаф, стол, полка. Серия 20 номеров.",
        image: "/images/b2b-hotel-1.jpg",
        location: "Гостиница, г. Тверь",
      },
      {
        title: "Ресепшн гостиницы",
        description:
          "Стойка ресепшн с зоной ожидания. Комбинация МДФ и натурального шпона дуба.",
        image: "/images/b2b-hotel-2.jpg",
        location: "Мини-отель, г. Торжок",
      },
      {
        title: "Хостел: двухъярусные модули",
        description:
          "Двухъярусные кровати-капсулы с индивидуальными полками, подсветкой и шторками.",
        image: "/images/b2b-hotel-3.jpg",
        location: "Хостел, г. Тверь",
      },
      {
        title: "Лобби-зона",
        description:
          "Стеллажи, столик и банкетки для зоны ожидания гостей. Единый стиль с номерами.",
        image: "/images/b2b-hotel-4.jpg",
        location: "Гостиница, г. Конаково",
      },
    ],
  },
  {
    title: "Мебель для образовательных учреждений",
    description:
      "Парты, столы, стеллажи и шкафы для школ, детских садов и учебных центров. Прочные, безопасные материалы, серийное производство любых объёмов.",
    features: [
      "Парты и ученические столы",
      "Шкафы для учебных пособий",
      "Мебель для детских садов",
      "Стеллажи для библиотек",
    ],
    icon: "🎓",
    examples: [
      {
        title: "Учебный класс школы",
        description:
          "Парты с регулировкой высоты и наклона, тумбы учителя. Серия на 15 классов.",
        image: "/images/b2b-education-1.jpg",
        location: "Школа №12, г. Тверь",
      },
      {
        title: "Детский сад: игровая зона",
        description:
          "Игровые стеллажи, столы для творчества, шкафчики для раздевалки. Скруглённые углы, яркие фасады.",
        image: "/images/b2b-education-2.jpg",
        location: "Детский сад, г. Торжок",
      },
      {
        title: "Библиотека учебного центра",
        description:
          "Стеллажи для книг, читальные столы, стойка выдачи. МДФ с ламинацией.",
        image: "/images/b2b-education-3.jpg",
        location: "Учебный центр, г. Тверь",
      },
      {
        title: "Лаборатория колледжа",
        description:
          "Лабораторные столы с химически стойким покрытием, шкафы для реактивов.",
        image: "/images/b2b-education-4.jpg",
        location: "Колледж, г. Конаково",
      },
    ],
  },
];

export default function B2BPage() {
  return (
    <div className="min-h-screen pt-24">
      <JsonLd
        data={generateWebPageSchema(
          "Мебель для бизнеса — ",
          "Производство мебели для бизнеса: офисная, торговая, гостиничная мебель",
          `${SITE_CONFIG.url}/b2b`,
        )}
      />

      <div className="container-custom">
        <Breadcrumbs
          items={[{ name: "Для бизнеса", url: `${SITE_CONFIG.url}/b2b` }]}
          className="mb-8"
        />

        <div className="text-center mb-12">
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            B2B-направление
          </span>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Мебель для бизнеса <span className="text-primary">на заказ</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            производит мебель не только для дома. Мы изготавливаем офисную
            мебель, торговое оборудование и мебель для HoReCa по индивидуальным
            проектам.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {b2bCategories.map((category, index) => (
            <B2BCategoryCard key={index} category={category} index={index} />
          ))}
        </div>

        <div className="bg-secondary/30 rounded-3xl p-8 md:p-12 mb-16">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Почему выбирают нас для B2B-заказов
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                value: "10+",
                label: "лет на рынке",
              },
              {
                value: "",
                label: "работаем по договору",
              },
              {
                value: "от 20",
                label: "рабочих дней",
              },
              {
                value: "1 год",
                label: "гарантия",
              },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-3xl mx-auto mb-16">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Как мы работаем с бизнес-клиентами
          </h2>
          <div className="space-y-6">
            {[
              {
                step: 1,
                title: "Заявка и замер",
                description:
                  "Свяжитесь с нами, обсудим ваши потребности. Замер помещения — 1 500 ₽ (вычитается при заказе).",
              },
              {
                step: 2,
                title: "Договор и эскиз",
                description:
                  "Заключаем договор, вносится аванс. Предоставляем эскиз проекта на утверждение.",
              },
              {
                step: 3,
                title: "Производство",
                description:
                  "Изготавливаем мебель на собственном производстве в Твери. Срок — от 20 рабочих дней.",
              },
              {
                step: 4,
                title: "Доставка и сборка",
                description:
                  "Доставляем и собираем мебель на вашем объекте. Работаем по Твери и Тверской области.",
              },
            ].map((item) => (
              <div key={item.step} className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold flex-shrink-0">
                  {item.step}
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center py-12 bg-primary/5 rounded-3xl mb-16">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Нужна мебель для вашего бизнеса?
          </h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            Свяжитесь с нами для обсуждения вашего проекта. Работаем с
            юридическими лицами и ИП.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={`tel:${SITE_CONFIG.phoneClean}`}
              className="inline-flex items-center justify-center px-8 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
            >
              {SITE_CONFIG.phone}
            </a>
            <a
              href={SITE_CONFIG.social.telegram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-3 rounded-xl border font-medium hover:bg-accent transition-colors"
            >
              Написать в Telegram
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
