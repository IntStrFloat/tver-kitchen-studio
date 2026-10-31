// ===== SEO CONSTANTS & UTILITIES =====
// Централизованные SEO-настройки для всего сайта Kuhnitver

export const SITE_CONFIG = {
  name: "Kuhnitver",
  url: "https://kuhnitver.ru",
  defaultTitle: "Кухни на заказ в Твери от производителя | Kuhnitver",
  titleTemplate: "%s | Kuhnitver",
  defaultDescription:
    "Кухни на заказ в Твери от Kuhnitver. Планировки, материалы, индивидуальная комплектация и расчёт по размерам. Условия замера, изготовления, доставки и установки согласуются до заказа.",
  defaultOgImage: "https://kuhnitver.ru/og-image-20261031.jpg",
  locale: "ru_RU",
  language: "ru",
  phone: "+7 (4822) 47-70-81",
  phoneClean: "+74822477081",
  // Контакт менеджера в мессенджере Max (отдельный номер от основного телефона)
  maxPhone: "+7-915-722-00-75",
  maxPhoneClean: "+79157220075",
  email: "m-btd@mail.ru",
  address: {
    street: "проспект Николая Корыткова, 3 ст1",
    venue: "",
    locality: "Тверь",
    region: "Тверская область",
    country: "RU",
  },
  // Телефоны и обозначение здания — ответ владельца 30.10.2026.
  // Тип «проспект» уточнён 31.10.2026 по ГАР; 3 ст1 не подменяется на 3 к1.
  contactsVerifiedAt: "2026-10-31",
  businessCard: {
    name: "Мебельщик",
    url: "https://yandex.ru/maps/org/192529825516/",
    // Принадлежность подтверждена владельцем и доступом к существующей карточке.
    // Карточка содержит прежний адрес до завершения обработки переезда Яндексом.
  },
  openingHours: {
    label: "Пн–Сб: 10:00–19:00",
    closedLabel: "Воскресенье — выходной",
    schema: "Mo-Sa 10:00-19:00",
    days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    opens: "10:00",
    closes: "19:00",
  },
  social: {
    vk: "https://vk.com/Kuhnitver",
    // Max: персональная ссылка на профиль требует длинного хеша из самого
    // приложения (формат max.ru/u/<HASH>) — построить по номеру нельзя.
    // Показываем maxPhone текстом + tel:, без deep-link. См. также maxPhone.
  },
} as const;

// Связь подтверждается ответом владельца и взаимными опубликованными ссылками.
// Это связь сайта с карточкой студии, а не заявление о юридическом наименовании.
export const BUSINESS_IDENTITY_TEXT = `${SITE_CONFIG.name} — сайт студии кухонь в Твери. «${SITE_CONFIG.businessCard.name}» — название карточки этой же студии в Яндекс Картах. В карточке указаны наш сайт ${new URL(SITE_CONFIG.url).hostname} и основной телефон ${SITE_CONFIG.phone}. Там может оставаться адрес до переезда; для визита используйте ${SITE_CONFIG.address.locality}, ${SITE_CONFIG.address.street} и предварительно свяжитесь с нами.`;

export function formatTitleWithBrand(title: string): string {
  const titleWithoutBrand = title
    .replace(/(?:\s*\|\s*Kuhnitver)+\s*$/i, "")
    .trim();

  return `${titleWithoutBrand} | ${SITE_CONFIG.name}`;
}

// ===== SEO TEMPLATES PER PAGE TYPE =====
export const SEO_TEMPLATES = {
  home: {
    title: "Кухни на заказ в Твери от производителя",
    description:
      SITE_CONFIG.defaultDescription,
  },
  catalog: {
    title: "Каталог кухонь — стили, фото, цены",
    description:
      "Каталог направлений дизайна кухонь в Твери: лофт, минимализм, скандинавский стиль, премиум. Иллюстрации стилей, материалы и индивидуальный расчёт под ваши размеры.",
  },
  notFound: {
    title: "Страница не найдена — 404",
    description:
      "Запрашиваемая страница не найдена. Перейдите на главную страницу Kuhnitver для заказа кухни в Твери.",
  },
} as const;

// ===== STRUCTURED DATA GENERATORS =====

export function generateLocalBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${SITE_CONFIG.url}/#localbusiness`,
    name: SITE_CONFIG.name,
    alternateName: SITE_CONFIG.businessCard.name,
    description:
      SITE_CONFIG.defaultDescription,
    url: SITE_CONFIG.url,
    telephone: SITE_CONFIG.phone,
    email: SITE_CONFIG.email,
    image: SITE_CONFIG.defaultOgImage,
    logo: `${SITE_CONFIG.url}/android-chrome-512x512.png`,
    currenciesAccepted: "RUB",
    sameAs: [SITE_CONFIG.businessCard.url],
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE_CONFIG.address.street,
      addressLocality: SITE_CONFIG.address.locality,
      addressRegion: SITE_CONFIG.address.region,
      addressCountry: SITE_CONFIG.address.country,
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: SITE_CONFIG.openingHours.days,
      opens: SITE_CONFIG.openingHours.opens,
      closes: SITE_CONFIG.openingHours.closes,
    },
    areaServed: [
      { "@type": "City", name: "Тверь" },
      { "@type": "City", name: "Торжок" },
      { "@type": "City", name: "Ржев" },
      { "@type": "City", name: "Конаково" },
      { "@type": "City", name: "Кимры" },
      { "@type": "City", name: "Вышний Волочёк" },
      { "@type": "City", name: "Бежецк" },
      { "@type": "City", name: "Нелидово" },
    ],
    // aggregateRating сознательно не указан — добавим после подключения
    // Яндекс.Бизнеса/Google Business Profile, где будут реальные отзывы
    // с верифицируемыми авторами. Выдуманные значения нарушают Google
    // Rich Results guidelines и могут привести к manual action.
  };
}

export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_CONFIG.url}/#organization`,
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
    sameAs: [SITE_CONFIG.businessCard.url],
    logo: `${SITE_CONFIG.url}/android-chrome-512x512.png`,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: SITE_CONFIG.phone,
      contactType: "sales",
      areaServed: "RU",
      availableLanguage: "Russian",
    },
  };
}

export function generateWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_CONFIG.url}/#website`,
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
    inLanguage: SITE_CONFIG.language,
    publisher: {
      "@id": `${SITE_CONFIG.url}/#organization`,
    },
  };
}

// Основные разделы сайта — кандидаты в «Быстрые ссылки» Яндекса и sitelinks
// Google. Сами быстрые ссылки формируются поисковиком автоматически; эта
// разметка SiteNavigationElement даёт поисковику явный машиночитаемый список
// главных разделов (сигнал для отбора). Порядок = приоритет: чем выше, тем
// важнее раздел коммерчески. Подбор/правка готовых ссылок — в Яндекс.Вебмастере
// (Информация о сайте → Быстрые ссылки). Метки совпадают с видимой навигацией
// в шапке/подвале — это подтверждает структуру для поисковика.
const SITE_NAVIGATION_LINKS = [
  { name: "Каталог кухонь", path: "/catalog" },
  { name: "Цены", path: "/price" },
  { name: "Идеи кухонь", path: "/portfolio" },
  { name: "Доставка", path: "/dostavka" },
  { name: "Вопросы и ответы", path: "/faq" },
  { name: "Для бизнеса", path: "/b2b" },
  { name: "О компании", path: "/about" },
  { name: "Блог", path: "/blog" },
  { name: "Контакты", path: "/contacts" },
] as const;

export function generateSiteNavigationSchema() {
  return SITE_NAVIGATION_LINKS.map((link, index) => ({
    "@context": "https://schema.org",
    "@type": "SiteNavigationElement",
    position: index + 1,
    name: link.name,
    url: `${SITE_CONFIG.url}${link.path}`,
  }));
}

export function generateWebPageSchema(
  title: string,
  description: string,
  url: string,
) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${url}/#webpage`,
    name: title,
    description,
    url,
    isPartOf: {
      "@id": `${SITE_CONFIG.url}/#website`,
    },
    about: {
      "@id": `${SITE_CONFIG.url}/#localbusiness`,
    },
    inLanguage: SITE_CONFIG.language,
  };
}

export function generateBreadcrumbSchema(
  items: { name: string; url: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function generateFAQSchema(
  questions: { question: string; answer: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: questions.map((q) => ({
      "@type": "Question",
      name: q.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: q.answer,
      },
    })),
  };
}

export function generateKitchenServiceSchema(
  name: string,
  description: string,
  image: string,
  url: string,
) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${url}#service`,
    name,
    description,
    image,
    url,
    provider: { "@id": `${SITE_CONFIG.url}/#localbusiness` },
    areaServed: {
      "@type": "AdministrativeArea",
      name: SITE_CONFIG.address.region,
    },
    serviceType: "Изготовление кухни по индивидуальным размерам",
  };
}

export function generateCollectionPageSchema(
  title: string,
  description: string,
  url: string,
  items: { name: string; url: string }[],
) {
  return {
    ...generateWebPageSchema(title, description, url),
    "@type": "CollectionPage",
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: items.length,
      itemListElement: items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        url: item.url,
      })),
    },
  };
}

export function generateServiceSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${SITE_CONFIG.url}/#kitchen-service`,
    name: "Производство кухонь на заказ",
    description:
      "Изготовление кухонной мебели на заказ по индивидуальным размерам. Замер, эскиз проекта, доставка и установка.",
    provider: {
      "@type": "LocalBusiness",
      "@id": `${SITE_CONFIG.url}/#localbusiness`,
      name: SITE_CONFIG.name,
    },
    areaServed: {
      "@type": "State",
      name: "Тверская область",
    },
    serviceType: "Производство мебели",
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Каталог кухонь",
      itemListElement: [
        { "@type": "OfferCatalog", name: "Кухни в стиле лофт" },
        { "@type": "OfferCatalog", name: "Скандинавские кухни" },
        { "@type": "OfferCatalog", name: "Кухни в стиле минимализм" },
        { "@type": "OfferCatalog", name: "Премиум кухни" },
        { "@type": "OfferCatalog", name: "Офисная мебель" },
        { "@type": "OfferCatalog", name: "Торговое оборудование" },
        { "@type": "OfferCatalog", name: "Мебель для гостиниц" },
      ],
    },
  };
}

export function generateArticleSchema(
  title: string,
  description: string,
  image: string,
  datePublished: string,
  url: string,
) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    image,
    datePublished,
    dateModified: datePublished,
    author: {
      "@type": "Organization",
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.url,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_CONFIG.name,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_CONFIG.url}/android-chrome-512x512.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
  };
}
