import { SITE_CONFIG } from "@/lib/seo";
import { COMMERCIAL_TERMS, cities, kitchenStyles } from "@/lib/data";

// Текущий формат «Услуги» поддерживает договорную цену без фиктивного нуля.
// https://yandex.ru/support/webmaster/ru/search-appearance/offices/about
// Категория подключения в Вебмастере: «Услуги». Принятие проверяется в кабинете.
export const dynamic = "force-static";

function esc(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;")
    .replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}

export async function GET(): Promise<Response> {
  const base = SITE_CONFIG.url;
  const updatedAt = [COMMERCIAL_TERMS.updatedAt, SITE_CONFIG.contactsVerifiedAt, ...kitchenStyles.map((style) => style.updatedAt)].sort().at(-1);
  const services = [
    ...kitchenStyles.map((style) => ({
      id: `kuhnitver-${style.slug}`,
      name: `${style.heading ?? `Кухни в стиле ${style.name}`} на заказ`,
      url: `${base}/catalog/${style.slug}`,
      description: `${style.fullDescription} ${COMMERCIAL_TERMS.pricingText}`,
    })),
    { id: "kuhnitver-zamer", name: "Замер кухни", url: `${base}/price`, description: COMMERCIAL_TERMS.measurementText },
    { id: "kuhnitver-dostavka", name: "Доставка и установка кухни", url: `${base}/dostavka`, description: `${COMMERCIAL_TERMS.deliveryText} ${COMMERCIAL_TERMS.installationText}` },
  ];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<services_feed date="${updatedAt}T00:00:00+03:00">
  <source>
    <name>${esc(SITE_CONFIG.name)}</name>
    <url>${esc(base)}</url>
    <favicon>${esc(`${base}/favicon.ico`)}</favicon>
    <locale>ru</locale>
    <redirect_service>1</redirect_service>
  </source>
  <categories><category><persistent_id>kitchens</persistent_id><name>Кухни на заказ</name></category></categories>
  <executors><executor>
    <persistent_id>kuhnitver</persistent_id>
    <url>${esc(`${base}/contacts`)}</url>
    <is_organization>1</is_organization>
    <name>${esc(SITE_CONFIG.name)}</name>
    <description>${esc(SITE_CONFIG.defaultDescription)}</description>
    <contacts><phones><phone is_primary="1">${esc(SITE_CONFIG.phoneClean)}</phone></phones><sites><site>${esc(base)}</site></sites></contacts>
    <geo_info>
      <addresses><address><text>${esc(`${SITE_CONFIG.address.locality}, ${SITE_CONFIG.address.street}`)}</text></address></addresses>
      <service_areas>${cities.map((city) => `<area><text>${esc(city.name)}</text></area>`).join("")}</service_areas>
    </geo_info>
    <services>${services.map((service) => `
      <service>
        <persistent_id>${esc(service.id)}</persistent_id>
        <url>${esc(service.url)}</url>
        <name>${esc(service.name)}</name>
        <category_id>kitchens</category_id>
        <price><is_negotiable>1</is_negotiable></price>
        <description>${esc(service.description)}</description>
      </service>`).join("")}
    </services>
  </executor></executors>
</services_feed>`;
  return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
}
