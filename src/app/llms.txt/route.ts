import { SITE_CONFIG, BUSINESS_IDENTITY_TEXT } from "@/lib/seo";
import { COMMERCIAL_TERMS, kitchenStyles, cities, blogPosts } from "@/lib/data";
import { getPublishedPortfolioCases } from "@/lib/portfolio";

export const dynamic = "force-static";

export function GET(): Response {
  const link = (name: string, path: string, detail?: string) =>
    `- [${name}](${SITE_CONFIG.url}${path})${detail ? `: ${detail}` : ""}`;
  const content = [
    `# ${SITE_CONFIG.name}`,
    "",
    "> Кухни по индивидуальным размерам в Твери и Тверской области. Публичные условия и способы обращения.",
    "",
    `Адрес: ${SITE_CONFIG.address.locality}, ${SITE_CONFIG.address.street}. Основной телефон: ${SITE_CONFIG.phone}. Max: ${SITE_CONFIG.maxPhone}. Контакты подтверждены ${SITE_CONFIG.contactsVerifiedAt}.`,
    BUSINESS_IDENTITY_TEXT,
    `[Карточка «${SITE_CONFIG.businessCard.name}»](${SITE_CONFIG.businessCard.url})`,
    "",
    COMMERCIAL_TERMS.pricingText,
    COMMERCIAL_TERMS.measurementText,
    COMMERCIAL_TERMS.productionText,
    COMMERCIAL_TERMS.deliveryText,
    COMMERCIAL_TERMS.installationText,
    COMMERCIAL_TERMS.warrantyText,
    "",
    "## Основные страницы",
    link("Контакты", "/contacts", "действующий адрес, телефоны, время визита"),
    link("О Kuhnitver", "/about", "процесс заказа и условия обращения"),
    link("Стоимость кухни", "/price", "индивидуальный расчёт, состав и исключения сметы"),
    link("Доставка и установка", "/dostavka", "условия по городам; дату согласуют после готовности кухни"),
    link("Вопросы и ответы", "/faq"),
    link("Получить предварительный расчёт", "/#quiz", "форма заявки; расчёт готовит специалист после уточнения комплектации"),
    link("Фото и идеи кухонь", "/portfolio", "фото из карточки «Мебельщик» с источником и отдельная подборка дизайн-референсов"),
    "",
    "## Каталог направлений",
    ...kitchenStyles.map((style) => link(style.heading ?? style.name, `/catalog/${style.slug}`, "изготовление на заказ, индивидуальная смета")),
    "",
    "## География обслуживания",
    ...cities.map((city) => link(city.name, `/kuhni/${city.slug}`)),
    "",
    "## Статьи",
    ...blogPosts.map((post) => link(post.title, `/blog/${post.slug}`)),
    ...getPublishedPortfolioCases().flatMap((project) => ["", link(project.title, `/portfolio/${project.slug}`, "подтверждённый выполненный проект")]),
    "",
  ].join("\n");
  return new Response(content, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
