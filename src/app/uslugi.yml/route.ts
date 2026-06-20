import { SITE_CONFIG } from "@/lib/seo";
import { kitchenStyles } from "@/lib/data";

// YML-фид для блока «Услуги/Исполнители» в Поиске Яндекса.
// Kuhnitver выступает исполнителем услуги «кухни на заказ». Формат — по
// официальному образцу https://edu.s3.yandex.net/sample/services.yml
// Регион показа задаётся в Вебмастере (Тверь); дублируем в param «Регион».
// Доступен по адресу https://kuhnitver.ru/uslugi.yml
export const dynamic = "force-static";

// === Бизнес-факты — ПРОВЕРЬТЕ перед отправкой фида в Вебмастер ===
const FOUNDED_YEAR = 2014; // компания работает с 2014 г. (упоминается в блоге)
const RATING = 0; // нет подтверждённых отзывов — честно указываем 0
const REVIEWS_COUNT = 0; // появятся после подключения Яндекс.Бизнеса
const REGION = "Тверь";

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

export async function GET(): Promise<Response> {
  const base = SITE_CONFIG.url;
  const logo = `${base}/android-chrome-512x512.png`;
  const now = new Date();
  const date = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(
    now.getDate(),
  )} ${pad(now.getHours())}:${pad(now.getMinutes())}`;
  const years = Math.max(1, now.getFullYear() - FOUNDED_YEAR);

  // Обязательный набор параметров (одинаков для всех предложений)
  const requiredParams = [
    `        <param name="Рейтинг">${RATING}</param>`,
    `        <param name="Число отзывов">${REVIEWS_COUNT}</param>`,
    `        <param name="Годы опыта">${years}</param>`,
    `        <param name="Регион">${esc(REGION)}</param>`,
    `        <param name="Конверсия">1</param>`,
  ].join("\n");

  // Необязательные параметры (правдивые факты о компании)
  const optionalParams = [
    `        <param name="Организация">да</param>`,
    `        <param name="Выезд на дом">да</param>`,
    `        <param name="Работа по договору">да</param>`,
    `        <param name="Наличный расчет">да</param>`,
    `        <param name="Безналичный расчет">да</param>`,
  ].join("\n");

  type OfferInput = {
    id: string;
    url: string;
    price: number;
    from: boolean;
    notes: string;
    categoryId: number;
    set: string;
    picture: string;
    description: string;
  };

  const buildOffer = (o: OfferInput) =>
    [
      `      <offer id="${o.id}">`,
      `        <name>${esc(SITE_CONFIG.name)}</name>`,
      `        <url>${esc(o.url)}</url>`,
      `        <price${o.from ? ' from="true"' : ""}>${o.price}</price>`,
      `        <currencyId>RUR</currencyId>`,
      `        <sales_notes>${esc(o.notes)}</sales_notes>`,
      `        <categoryId>${o.categoryId}</categoryId>`,
      `        <set-ids>${o.set}</set-ids>`,
      `        <picture>${esc(o.picture)}</picture>`,
      `        <description>${esc(o.description)}</description>`,
      `        <adult>false</adult>`,
      `        <expiry>P1Y</expiry>`,
      requiredParams,
      optionalParams,
      `      </offer>`,
    ].join("\n");

  // Предложения по стилям кухонь — каждое ведёт на свою страницу каталога
  const styleOffers = kitchenStyles.map((s) => {
    const heading = s.heading ?? `Кухня в стиле ${s.name}`;
    return buildOffer({
      id: `kuhnitver-${s.slug}`,
      url: `${base}/catalog/${s.slug}`,
      price: s.priceFrom,
      from: true,
      notes: "за погонный метр",
      categoryId: 2,
      set: "s1",
      picture: `${base}${s.image}`,
      description: `${heading} на заказ по индивидуальным размерам в Твери`,
    });
  });

  // Сервисные предложения: замер и доставка/установка
  const serviceOffers = [
    buildOffer({
      id: "kuhnitver-zamer",
      url: `${base}/price`,
      price: 1500,
      from: false,
      notes: "вычитается из стоимости заказа",
      categoryId: 3,
      set: "s2",
      picture: logo,
      description: "Замер кухни в Твери с выездом на дом и консультацией дизайнера",
    }),
    buildOffer({
      id: "kuhnitver-dostavka",
      url: `${base}/dostavka`,
      price: 0,
      from: false,
      notes: "бесплатно по Твери",
      categoryId: 4,
      set: "s3",
      picture: logo,
      description: "Доставка и профессиональная установка кухни в Твери и области",
    }),
  ];

  const xml = `<?xml version="1.0" encoding="utf-8" standalone="yes"?>
<yml_catalog date="${date}">
  <shop>
    <name>${esc(SITE_CONFIG.name)}</name>
    <company>${esc(SITE_CONFIG.name)}</company>
    <url>${esc(base)}</url>
    <email>${esc(SITE_CONFIG.email)}</email>
    <currencies>
      <currency id="RUR" rate="1" />
    </currencies>
    <categories>
      <category id="1">Исполнитель</category>
      <category id="2" parentId="1">Кухни на заказ</category>
      <category id="3" parentId="1">Замер и проектирование кухни</category>
      <category id="4" parentId="1">Доставка и установка кухни</category>
    </categories>
    <sets>
      <set id="s1">
        <name>Кухни на заказ в Твери</name>
        <url>${esc(`${base}/catalog`)}</url>
      </set>
      <set id="s2">
        <name>Замер кухни в Твери</name>
        <url>${esc(`${base}/price`)}</url>
      </set>
      <set id="s3">
        <name>Доставка и установка кухни в Твери</name>
        <url>${esc(`${base}/dostavka`)}</url>
      </set>
    </sets>
    <offers>
${[...styleOffers, ...serviceOffers].join("\n")}
    </offers>
  </shop>
</yml_catalog>
`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
