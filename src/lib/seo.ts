// ===== SEO CONSTANTS & UTILITIES =====
// Централизованные SEO-настройки для всего сайта TverKuhni

export const SITE_CONFIG = {
  name: "TverKuhni",
  url: "https://kuhnitver.ru",
  defaultTitle: "Кухни на заказ в Твери от производителя | TverKuhni",
  titleTemplate: "%s | TverKuhni",
  defaultDescription:
    "Производство кухонь на заказ в Твери от 20 дней. Европейские материалы, установка включена. Гарантия 1 год.",
  defaultOgImage: "https://kuhnitver.ru/og-image.jpg",
  locale: "ru_RU",
  language: "ru",
  phone: "+7-903-630-29-09",
  phoneClean: "+79036302909",
  email: "m-btd@mail.ru",
  address: {
    street: "ул. Коминтерна, 95",
    locality: "Тверь",
    region: "Тверская область",
    postalCode: "170000",
    country: "RU",
  },
  geo: {
    latitude: 56.8584,
    longitude: 35.9006,
  },
  social: {
    telegram: "https://t.me/mebelshik_tver",
  },
} as const;

// ===== SEO TEMPLATES PER PAGE TYPE =====
export const SEO_TEMPLATES = {
  home: {
    title: "Кухни на заказ в Твери от производителя",
    description:
      "Производство кухонь на заказ в Твери от 20 дней. Европейские материалы, установка включена. Гарантия 1 год. Звоните!",
  },
  catalog: {
    title: "Каталог кухонь — стили и цены",
    description:
      "Каталог кухонь на заказ: лофт, минимализм, скандинавский стиль, премиум. Индивидуальный дизайн.",
  },
  notFound: {
    title: "Страница не найдена — 404",
    description:
      "Запрашиваемая страница не найдена. Перейдите на главную страницу TverKuhni.",
  },
} as const;

// ===== STRUCTURED DATA GENERATORS =====

export function generateLocalBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${SITE_CONFIG.url}/#localbusiness`,
    name: SITE_CONFIG.name,
    description:
      "Производство кухонь на заказ в Твери и Тверской области. Собственное производство, европейские материалы, гарантия 1 год.",
    url: SITE_CONFIG.url,
    telephone: SITE_CONFIG.phone,
    email: SITE_CONFIG.email,
    image: SITE_CONFIG.defaultOgImage,
    logo: `${SITE_CONFIG.url}/favicon.svg`,
    priceRange: "$$",
    currenciesAccepted: "RUB",
    paymentAccepted: "Наличные, Банковские карты, Безналичный расчёт",
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE_CONFIG.address.street,
      addressLocality: SITE_CONFIG.address.locality,
      addressRegion: SITE_CONFIG.address.region,
      postalCode: SITE_CONFIG.address.postalCode,
      addressCountry: SITE_CONFIG.address.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: SITE_CONFIG.geo.latitude,
      longitude: SITE_CONFIG.geo.longitude,
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ],
      opens: "10:00",
      closes: "19:00",
    },
    areaServed: [
      { "@type": "City", name: "Тверь" },
      { "@type": "City", name: "Торжок" },
      { "@type": "City", name: "Ржев" },
      { "@type": "City", name: "Конаково" },
      { "@type": "City", name: "Кимры" },
      { "@type": "City", name: "Вышний Волочёк" },
    ],
    sameAs: [SITE_CONFIG.social.telegram],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "127",
      bestRating: "5",
      worstRating: "1",
    },
  };
}

export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_CONFIG.url}/#organization`,
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
    logo: `${SITE_CONFIG.url}/favicon.svg`,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: SITE_CONFIG.phone,
      contactType: "sales",
      areaServed: "RU",
      availableLanguage: "Russian",
    },
    sameAs: [SITE_CONFIG.social.telegram],
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

export function generateProductSchema(
  name: string,
  description: string,
  image: string,
  price: string,
  url: string,
) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    image,
    url,
    brand: {
      "@type": "Brand",
      name: SITE_CONFIG.name,
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "RUB",
      price,
      priceValidUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      availability: "https://schema.org/InStock",
      seller: {
        "@id": `${SITE_CONFIG.url}/#organization`,
      },
    },
  };
}

export function generateReviewSchema(
  author: string,
  reviewBody: string,
  ratingValue: number,
) {
  return {
    "@type": "Review",
    author: {
      "@type": "Person",
      name: author,
    },
    reviewBody,
    reviewRating: {
      "@type": "Rating",
      ratingValue,
      bestRating: 5,
      worstRating: 1,
    },
  };
}

export function generateServiceSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
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
    offers: {
      "@type": "AggregateOffer",
      lowPrice: "25000",
      highPrice: "150000",
      priceCurrency: "RUB",
    },
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
        url: `${SITE_CONFIG.url}/favicon.svg`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
  };
}
