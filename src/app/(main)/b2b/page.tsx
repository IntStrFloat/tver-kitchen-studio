import type { Metadata } from "next";
import Link from "next/link";
import {
  Building2,
  Store,
  Hotel,
  GraduationCap,
  FileText,
  Banknote,
  Shield,
  Layers,
  Ruler,
  PenTool,
  FileSignature,
  Factory,
  Truck,
  Briefcase,
  ShoppingBag,
  UtensilsCrossed,
  Stethoscope,
  Landmark,
  ArrowRight,
  Phone,
  MessageCircle,
} from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/seo/JsonLd";
import { SITE_CONFIG, generateWebPageSchema } from "@/lib/seo";
import { COMMERCIAL_TERMS } from "@/lib/data";
import B2BCategoryCard, {
  type B2BCategory,
} from "@/components/B2BCategoryCard";
import B2BRequestModal from "@/components/B2BRequestModal";

export const metadata: Metadata = {
  title: "Мебель для бизнеса на заказ в Твери — офис, торговля, HoReCa | Kuhnitver",
  description:
    "Мебель для бизнеса на заказ в Твери: офисы, торговые помещения, гостиницы и учебные учреждения. Индивидуальная комплектация по ТЗ, согласование сметы, документов, сроков, доставки и монтажа до заказа.",
  keywords:
    "мебель для бизнеса Тверь, офисная мебель Тверь на заказ, торговое оборудование Тверь, мебель для гостиниц, мебель для школ Тверь, корпоративная мебель, B2B мебель Тверь, мебель для HoReCa",
  alternates: {
    canonical: `${SITE_CONFIG.url}/b2b`,
  },
  openGraph: {
    title: "Мебель для бизнеса на заказ в Твери — офис, торговля, HoReCa | Kuhnitver",
    description:
      "Мебель для бизнеса в Твери по техническому заданию. Обсуждение комплектации, проекта, сметы, графика, документов, доставки и монтажа.",
    url: `${SITE_CONFIG.url}/b2b`,
    siteName: "Kuhnitver",
    locale: "ru_RU",
    type: "website",
    images: [
      {
        url: SITE_CONFIG.defaultOgImage,
        width: 1200,
        height: 630,
        alt: "Мебель для бизнеса на заказ — Тверь, Kuhnitver",
      },
    ],
  },
};

const b2bCategories: B2BCategory[] = [
  {
    title: "Офисная мебель",
    description:
      "Столы, тумбы, шкафы и стеллажи для офисов по индивидуальным размерам. От оборудования одного кабинета до полной комплектации open-space.",
    features: [
      "Рабочие столы и конференц-столы",
      "Шкафы и стеллажи для документов",
      "Ресепшн-стойки и переговорные",
      "Кабель-менеджмент и встроенные розетки",
    ],
    iconNode: <Building2 className="w-7 h-7" aria-hidden="true" />,
    examples: [
      {
        title: "Open-space на 25 рабочих мест",
        description:
          "Рабочие столы с встроенным кабель-менеджментом, выкатные тумбы, стеллажи для документов.",
        image: "/images/b2b-office-1.jpg",
        category: "IT-компания",
      },
      {
        title: "Ресепшн-стойка с подсветкой",
        description:
          "Стойка ресепшн с подсветкой и встроенными ящиками, МДФ с покрытием Soft-touch.",
        image: "/images/b2b-office-2.jpg",
        category: "Бизнес-центр",
      },
      {
        title: "Конференц-стол на 12 человек",
        description:
          "Большой конференц-стол с интегрированными розетками и кабель-каналами.",
        image: "/images/b2b-office-3.jpg",
        category: "Корпоративный офис",
      },
      {
        title: "Архивные шкафы и стеллажи",
        description:
          "Серия шкафов и стеллажей для архивного хранения. ЛДСП с ламинацией, замки.",
        image: "/images/b2b-office-4.jpg",
        category: "Юридическая фирма",
      },
    ],
  },
  {
    title: "Торговое оборудование",
    description:
      "Витрины, прилавки, стеллажи и кассовые зоны для магазинов и торговых точек. Серийное производство для сетей с единым стилем.",
    features: [
      "Торговые витрины и прилавки",
      "Стеллажи и островные модули",
      "Кассовые и упаковочные зоны",
      "Выставочные стенды",
    ],
    iconNode: <Store className="w-7 h-7" aria-hidden="true" />,
    examples: [
      {
        title: "Витрины с подсветкой",
        description:
          "Хлебные витрины с LED-подсветкой и стеклянными полками. Натуральное дерево и металл.",
        image: "/images/b2b-retail-1.jpg",
        category: "Пекарня, кофейня",
      },
      {
        title: "Кассовая зона",
        description:
          "Кассовый модуль с прилавком, витриной мелкого товара и зоной упаковки.",
        image: "/images/b2b-retail-2.jpg",
        category: "Розничный магазин",
      },
      {
        title: "Островной стеллаж",
        description:
          "Двусторонние островные стеллажи для торгового зала. Регулируемые полки, подсветка.",
        image: "/images/b2b-retail-3.jpg",
        category: "Супермаркет, drogerie",
      },
      {
        title: "Модульный выставочный стенд",
        description:
          "Стенд для выставки продукции. Быстрая сборка-разборка, удобная транспортировка.",
        image: "/images/b2b-retail-4.jpg",
        category: "Выставочный зал, шоурум",
      },
    ],
  },
  {
    title: "Мебель для гостиниц и хостелов",
    description:
      "Комплектация номеров и лобби: серийные партии мебели с единым стилем, материалы под коммерческую эксплуатацию.",
    features: [
      "Кровати и прикроватные тумбы",
      "Платяные шкафы и стойки",
      "Рабочие столы и зоны для багажа",
      "Мебель для лобби и ресепшн",
    ],
    iconNode: <Hotel className="w-7 h-7" aria-hidden="true" />,
    examples: [
      {
        title: "Стандарт-номер — комплект",
        description:
          "Полный комплект мебели для стандартного номера: кровать, тумбы, шкаф, стол, полка.",
        image: "/images/b2b-hotel-1.jpg",
        category: "Гостиница 3*",
      },
      {
        title: "Ресепшн и зона ожидания",
        description:
          "Стойка ресепшн с зоной ожидания. Комбинация МДФ и натурального шпона дуба.",
        image: "/images/b2b-hotel-2.jpg",
        category: "Мини-отель, бутик-отель",
      },
      {
        title: "Капсульные модули хостела",
        description:
          "Двухъярусные кровати-капсулы с индивидуальными полками, подсветкой и шторками.",
        image: "/images/b2b-hotel-3.jpg",
        category: "Хостел, апарт-отель",
      },
      {
        title: "Лобби-зона",
        description:
          "Стеллажи, столики и банкетки для зоны ожидания гостей в едином стиле с номерами.",
        image: "/images/b2b-hotel-4.jpg",
        category: "Гостиничный комплекс",
      },
    ],
  },
  {
    title: "Мебель для образовательных учреждений",
    description:
      "Парты, столы, стеллажи и шкафы для учебных помещений. Размеры, обработку углов, материалы и подтверждающие документы согласуем по требованиям учреждения.",
    features: [
      "Парты и ученические столы",
      "Шкафы для учебных пособий",
      "Мебель для детских садов",
      "Стеллажи для библиотек и лабораторий",
    ],
    iconNode: <GraduationCap className="w-7 h-7" aria-hidden="true" />,
    examples: [
      {
        title: "Учебный класс",
        description:
          "Парты с регулировкой высоты, тумбы учителя. Серия для оборудования учебного кабинета.",
        image: "/images/b2b-education-1.jpg",
        category: "Школа, гимназия",
      },
      {
        title: "Игровая зона детсада",
        description:
          "Игровые стеллажи, столы для творчества, шкафчики для раздевалки. Скруглённые углы.",
        image: "/images/b2b-education-2.jpg",
        category: "Детский сад",
      },
      {
        title: "Библиотека и читальный зал",
        description:
          "Стеллажи для книг, читальные столы, стойка выдачи. ЛДСП с ламинацией.",
        image: "/images/b2b-education-3.jpg",
        category: "Учебный центр, библиотека",
      },
      {
        title: "Лаборатория и спецкабинет",
        description:
          "Варианты столов и шкафов для специализированного кабинета. Покрытие и допустимые условия эксплуатации согласуются по техническому заданию.",
        image: "/images/b2b-education-4.jpg",
        category: "Колледж, техникум",
      },
    ],
  },
];

const audienceSegments = [
  {
    Icon: Briefcase,
    title: "Открываете офис",
    description:
      "Офисы, агентства и салоны. Комплектация под бренд и планировку; возможность поставки к открытию обсуждаем по проекту.",
  },
  {
    Icon: ShoppingBag,
    title: "Открываете магазин или сеть",
    description:
      "Розница, шоурумы, аптеки, оптики. Витрины, стеллажи, кассы — стандартизация для нескольких точек.",
  },
  {
    Icon: UtensilsCrossed,
    title: "Открываете кафе, гостиницу или хостел",
    description:
      "HoReCa: материалы под коммерческую эксплуатацию, серийные партии для номерного фонда, единый стиль.",
  },
  {
    Icon: GraduationCap,
    title: "Меблируете школу, детсад, колледж",
    description:
      "Бюджетные и частные учреждения. Требования к материалам, размерам, безопасности и подтверждающим документам обсуждаем по техническому заданию.",
  },
  {
    Icon: Stethoscope,
    title: "Медицинский центр или клиника",
    description:
      "Регистратуры, шкафы для документов и расходников, рабочие зоны врачей. Материалы под мокрую уборку.",
  },
  {
    Icon: Landmark,
    title: "Закупки от юрлица или ИП",
    description:
      "АХО и закупщики компаний. Комплектацию, условия расчётов, документы и возможность участия в закупке согласуем после изучения задания.",
  },
];

const docsForLegal = [
  {
    Icon: FileText,
    title: "Документы по заказу",
    description:
      "Состав договорных и закрывающих документов, спецификацию и смету согласуем до заказа с учётом исполнителя и требований заказчика.",
  },
  {
    Icon: Banknote,
    title: "Безналичная оплата",
    description:
      "Способ, реквизиты и этапы оплаты согласуем в договоре до выставления счёта.",
  },
  {
    Icon: Shield,
    title: "Гарантийные условия",
    description:
      COMMERCIAL_TERMS.warrantyText,
  },
  {
    Icon: Layers,
    title: "Серийное производство",
    description:
      "Объём партии, повторяемость изделий, комплектацию и стоимость за единицу определяем по техническому заданию.",
  },
];

const orderStepsB2B = [
  {
    Icon: PenTool,
    title: "Бриф и техническое задание",
    description:
      "Уточняем тип объекта, объём заказа, сроки, бюджет. Принимаем готовое ТЗ или составляем вместе.",
  },
  {
    Icon: Ruler,
    title: "Замер и уточнение задания",
    description:
      COMMERCIAL_TERMS.measurementText,
  },
  {
    Icon: FileSignature,
    title: "Коммерческое предложение и договор",
    description:
      "Согласуем детальную смету, договор и порядок оплаты. Проект и спецификация утверждаются до изготовления.",
  },
  {
    Icon: Factory,
    title: "Производство",
    description:
      COMMERCIAL_TERMS.productionText,
  },
  {
    Icon: Truck,
    title: "Доставка и монтаж на объекте",
    description:
      `${COMMERCIAL_TERMS.deliveryText} ${COMMERCIAL_TERMS.installationText}`,
  },
];

const faqB2B = [
  {
    question: "С какими организационно-правовыми формами работаете?",
    answer:
      "Рассматриваем заказы от ИП и юридических лиц. До заказа согласуем исполнителя, реквизиты, договор, порядок оплаты и необходимые документы.",
  },
  {
    question: "Какие закрывающие документы предоставляете?",
    answer:
      "Нужный состав документов укажите в запросе. Тип договора, спецификацию, смету и документы для приёмки и бухгалтерии согласуем до заключения договора.",
  },
  {
    question: "Возможна ли отсрочка платежа или поэтапная оплата?",
    answer:
      "Размер аванса, этапы оплаты и возможность отсрочки обсуждаем для конкретного заказа. Согласованные условия фиксируем в договоре.",
  },
  {
    question: "Минимальный заказ?",
    answer:
      "Пришлите описание изделия или партии: размеры, количество, материалы и требования к поставке. Возможность изготовления и стоимость подтвердим после изучения задания.",
  },
  {
    question: "Соответствуют ли материалы СанПиН для образовательных учреждений?",
    answer:
      "Требования учреждения и перечень подтверждающих документов нужно передать вместе с техническим заданием. Возможность применения конкретных материалов и исполнения изделия подтверждаем до заказа; общее описание категории не заменяет такую проверку.",
  },
  {
    question: "Какие сертификаты материалов можете предоставить?",
    answer:
      "Наличие и применимость документов уточняются для выбранного материала и конкретного изделия. Укажите необходимые подтверждения в задании, чтобы согласовать их до договора.",
  },
  {
    question: "Работаете ли по 44-ФЗ и 223-ФЗ?",
    answer:
      "Возможность участия в конкретной закупке рассматриваем после изучения технического задания, условий оплаты, сроков и требований к участнику. Пришлите документацию для оценки.",
  },
  {
    question: "Что входит в гарантию для бизнес-клиентов?",
    answer:
      COMMERCIAL_TERMS.warrantyText,
  },
];

const b2bServiceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": `${SITE_CONFIG.url}/b2b#service`,
  name: "Мебель для бизнеса на заказ",
  description:
    "Изготовление мебели для бизнес-объектов в Твери по техническому заданию: согласование проекта, комплектации, сметы и графика.",
  provider: {
    "@type": "LocalBusiness",
    "@id": `${SITE_CONFIG.url}/#localbusiness`,
    name: SITE_CONFIG.name,
  },
  serviceType: "Производство мебели B2B",
  areaServed: {
    "@type": "State",
    name: "Тверская область",
  },
  audience: {
    "@type": "BusinessAudience",
    audienceType: "Юридические лица и индивидуальные предприниматели",
  },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Категории B2B-мебели",
    itemListElement: b2bCategories.map((c) => ({
      "@type": "OfferCatalog",
      name: c.title,
    })),
  },
};

const b2bFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqB2B.map((q) => ({
    "@type": "Question",
    name: q.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: q.answer,
    },
  })),
};

export default function B2BPage() {
  return (
    <div className="min-h-screen pt-24">
      <JsonLd
        data={generateWebPageSchema(
          "Мебель для бизнеса на заказ в Твери",
          "Производство мебели для бизнеса в Твери: офисная, торговая, гостиничная и учебная мебель. Работа с юрлицами и ИП.",
          `${SITE_CONFIG.url}/b2b`,
        )}
      />
      <JsonLd data={b2bServiceSchema} />
      <JsonLd data={b2bFaqSchema} />

      <div className="container-custom">
        <Breadcrumbs
          items={[{ name: "Для бизнеса", url: `${SITE_CONFIG.url}/b2b` }]}
          className="mb-8"
        />

        {/* Hero */}
        <header className="text-center mb-14 max-w-3xl mx-auto">
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            B2B-направление
          </span>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-5">
            Мебель для бизнеса <span className="text-primary">на заказ</span>
          </h1>
          <p className="text-lg text-muted-foreground mb-6">
            Kuhnitver производит мебель не только для квартир. Мы изготавливаем
            офисную мебель, торговое оборудование, мебель для гостиниц и
            образовательных учреждений в Твери и Тверской области. Работаем с
            юридическими лицами и ИП; состав документов и условия договора
            согласуем для конкретного заказа.
          </p>
          <p className="text-sm text-muted-foreground mb-6">
            Работаем в Твери и Тверской области. Для крупных партий обсуждаем доставку и монтаж в соседних регионах.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <B2BRequestModal />
            <a
              href={`tel:${SITE_CONFIG.phoneClean}`}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border-2 border-border font-medium hover:border-primary transition-colors"
            >
              <Phone className="w-4 h-4 text-primary" aria-hidden="true" />
              {SITE_CONFIG.phone}
            </a>
          </div>
        </header>

        {/* Audience segments */}
        <section className="mb-16" aria-label="С кем мы работаем">
          <div className="text-center mb-10 max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              С какими бизнес-клиентами работаем
            </h2>
            <p className="text-muted-foreground">
              Открываете объект или меблируете существующий — разберёмся с
              задачей под формат вашего бизнеса.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {audienceSegments.map((seg, i) => (
              <article key={i} className="premium-card p-6">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                  <seg.Icon
                    className="w-6 h-6 text-primary"
                    aria-hidden="true"
                  />
                </div>
                <h3 className="font-bold text-lg mb-2">{seg.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {seg.description}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* Categories */}
        <section className="mb-16" aria-label="Категории мебели для бизнеса">
          <div className="text-center mb-10 max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              Что мы производим для бизнеса
            </h2>
            <p className="text-muted-foreground">
              Четыре основных направления — офис, торговля, гостиничный сектор
              и образование. Каждое — это серийное и индивидуальное
              производство под ваши требования.
            </p>
          </div>
          <div className="bg-secondary/30 border border-border/40 rounded-2xl p-4 md:p-5 mb-8 text-sm text-muted-foreground max-w-3xl mx-auto text-center">
            Ниже — иллюстрации возможных решений, а не подтверждённые кейсы клиентов. Комплектацию адаптируем под планировку, брендбук, бюджет и требования объекта.
          </div>
          <div className="grid items-start md:grid-cols-2 gap-8">
            {b2bCategories.map((category, index) => (
              <B2BCategoryCard key={index} category={category} index={index} />
            ))}
          </div>
        </section>

        <section className="mb-16 rounded-3xl border border-primary/20 bg-primary/5 p-7 md:p-10" aria-label="Тендеры и закупки мебели">
          <div className="grid gap-8 lg:grid-cols-[1.35fr_0.65fr] lg:items-start">
            <div>
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                <FileSignature className="h-6 w-6" aria-hidden="true" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Тендеры и закупки мебели</h2>
              <p className="text-muted-foreground leading-relaxed">
                Принимаем заявки от юридических лиц, ИП, закупочных отделов, подрядчиков и управляющих компаний. Рассчитываем изготовление мебели по ТЗ, спецификации, ведомости, дизайн-проекту или чертежам.
              </p>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                Изучаем техническое задание и обсуждаем коммерческое предложение, смету, спецификацию и состав документов. Возможность участия в закупке рассматриваем после анализа её документации, сроков, требований к участнику и условий оплаты.
              </p>
            </div>
            <aside className="rounded-2xl bg-card p-6 shadow-sm">
              <h3 className="font-bold text-lg mb-3">Что приложить к запросу</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>ТЗ, спецификацию, ведомость или чертёж</li>
                <li>Город и адрес объекта</li>
                <li>Желаемый срок поставки и монтажа</li>
                <li>Контакт для обратной связи</li>
              </ul>
              <div className="mt-5"><B2BRequestModal /></div>
            </aside>
          </div>
        </section>

        {/* Documents & Payment for legal entities */}
        <section
          className="mb-16"
          aria-label="Документы и оплата для юрлиц и ИП"
        >
          <div className="text-center mb-10 max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              Документы и условия для юрлиц и ИП
            </h2>
            <p className="text-muted-foreground">
              Закрывающие документы для бухгалтерии, безналичная оплата,
              серийное производство для сетей и многономерных объектов.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {docsForLegal.map((d, i) => (
              <article key={i} className="premium-card p-6 md:p-7">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <d.Icon
                      className="w-6 h-6 text-primary"
                      aria-hidden="true"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">{d.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {d.description}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
          <p className="mt-5 text-center text-sm text-muted-foreground">
            До договора согласуем реквизиты исполнителя, гарантийные условия и перечень документов на выбранные материалы.
          </p>
        </section>

        {/* Stats */}
        <section
          className="bg-secondary/30 rounded-3xl p-8 md:p-12 mb-16"
          aria-label="Условия работы с бизнесом"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
            Почему выбирают нас для B2B-заказов
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: "По ТЗ", label: "комплектация под задачу объекта" },
              { value: "По смете", label: "состав и стоимость заказа" },
              { value: "По графику", label: "сроки в договоре" },
              { value: "По договору", label: "гарантийные условия" },
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
        </section>

        {/* Order process */}
        <section
          className="max-w-4xl mx-auto mb-16"
          aria-label="Этапы работы с бизнес-клиентом"
        >
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              Как мы работаем с бизнес-клиентами
            </h2>
            <p className="text-muted-foreground">
              Прозрачный процесс с фиксированными сроками и ответственностью на
              каждом этапе по договору.
            </p>
          </div>
          <ol className="space-y-4">
            {orderStepsB2B.map((step, i) => (
              <li key={i} className="premium-card p-6 flex gap-4 items-start">
                <span
                  className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold flex-shrink-0"
                  aria-hidden="true"
                >
                  {i + 1}
                </span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <step.Icon
                      className="w-5 h-5 text-primary"
                      aria-hidden="true"
                    />
                    <h3 className="font-bold">{step.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* FAQ B2B */}
        <section className="max-w-3xl mx-auto mb-16" aria-label="Вопросы и ответы для бизнес-клиентов">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              Вопросы бизнес-клиентов
            </h2>
            <p className="text-muted-foreground">
              Документы, оплата, гарантии, тендеры — собрали типовые вопросы
              закупщиков и руководителей.
            </p>
          </div>
          <div className="space-y-3">
            {faqB2B.map((q, i) => (
              <details
                key={i}
                className="premium-card p-5 group [&_summary]:cursor-pointer"
              >
                <summary className="font-semibold list-none flex items-center justify-between gap-4">
                  <span>{q.question}</span>
                  <ArrowRight
                    className="w-4 h-4 text-primary flex-shrink-0 transition-transform group-open:rotate-90"
                    aria-hidden="true"
                  />
                </summary>
                <p className="mt-3 text-muted-foreground leading-relaxed text-sm">
                  {q.answer}
                </p>
              </details>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section
          id="cta"
          className="text-center py-12 md:py-16 bg-primary/5 rounded-3xl mb-16 px-6"
          aria-label="Запрос на расчёт"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Запросить расчёт для вашего бизнеса
          </h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Позвоните или напишите — обсудим объём, сроки и подготовим
            коммерческое предложение по вашему заданию. Дату замера, стоимость
            выезда и график работ согласуем заранее.
          </p>
          <div className="flex flex-col gap-4 justify-center max-w-md mx-auto">
            <a
              href={`tel:${SITE_CONFIG.phoneClean}`}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
            >
              <Phone className="w-4 h-4" aria-hidden="true" />
              {SITE_CONFIG.phone}
            </a>
            <div className="rounded-xl bg-card p-4 border border-border/40 text-left">
              <div className="flex items-center gap-2 mb-1">
                <MessageCircle
                  className="w-4 h-4 text-primary"
                  aria-hidden="true"
                />
                <span className="font-medium text-sm">Найдите нас в Max</span>
              </div>
              <a
                href={`tel:${SITE_CONFIG.maxPhoneClean}`}
                className="text-primary font-semibold hover:underline"
              >
                {SITE_CONFIG.maxPhone.replace(/-/g, " ")}
              </a>
              <p className="text-xs text-muted-foreground mt-1">
                Добавьте номер в контакты и найдите нас в приложении Max
              </p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            Или напишите на{" "}
            <a
              href={`mailto:${SITE_CONFIG.email}`}
              className="text-primary hover:underline"
            >
              {SITE_CONFIG.email}
            </a>{" "}
            — пришлите ТЗ или опишите задачу и удобный способ связи.
          </p>
        </section>

        <section className="max-w-3xl mx-auto pb-16 text-foreground/80 leading-relaxed space-y-4 text-[15px] md:text-base">
          <h2 className="text-2xl font-bold text-foreground">
            Производство корпоративной мебели в Твери
          </h2>
          <p>
            {SITE_CONFIG.name} рассматривает проекты мебели для офисов,
            торговых помещений, гостиниц и учебных учреждений. Наш адрес:
            {" "}{SITE_CONFIG.address.locality}, {SITE_CONFIG.address.street}.
            Чтобы оценить заказ, нужны размеры, количество изделий,
            материалы, требования объекта и желаемый график.
          </p>
          <p>
            Для повторяющихся изделий согласуем образец или спецификацию,
            состав партии и порядок приёмки. Документы на материалы и изделия,
            требования к безопасности и состав закрывающих документов
            обсуждаются до договора применительно к конкретному заказу.
          </p>
          <p>{COMMERCIAL_TERMS.productionText}</p>
          <p>{COMMERCIAL_TERMS.warrantyText}</p>
          <p>
            {COMMERCIAL_TERMS.deliveryText}{" "}
            <Link href="/dostavka" className="text-primary hover:underline">
              Условия доставки
            </Link>{" "}
            и <Link href="/catalog" className="text-primary hover:underline">каталог стилей</Link>.
          </p>
        </section>
      </div>
    </div>
  );
}
