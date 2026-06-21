export const TRY_ON_GROUPS = [
  { id: "kitchens", label: "Кухни" },
  { id: "wardrobes", label: "Шкафы" },
  { id: "walk-in", label: "Гардеробные" },
  { id: "other", label: "Другая мебель" },
] as const;

export type TryOnGroupId = (typeof TRY_ON_GROUPS)[number]["id"];

export interface TryOnProduct {
  readonly id: string;
  readonly groupId: TryOnGroupId;
  readonly name: string;
  readonly description: string;
  readonly thumbnail: string;
  readonly references: readonly string[];
}

export const IS_DEMO_CATALOG = true;

const DEMO_DISCLAIMER = "Демо для проверки интерфейса";

export const TRY_ON_PRODUCTS: readonly TryOnProduct[] = [
  {
    id: "demo-kitchen-scandi",
    groupId: "kitchens",
    name: "Демо-кухня «Сканди»",
    description: `${DEMO_DISCLAIMER}. Не является реальным товаром.`,
    thumbnail: "/images/kitchen-scandi.jpg",
    references: ["/images/kitchen-scandi.jpg", "/images/kitchen-modern.jpg"],
  },
  {
    id: "demo-wardrobe-modern",
    groupId: "wardrobes",
    name: "Демо-шкаф «Модерн»",
    description: `${DEMO_DISCLAIMER}. Не является реальным товаром.`,
    thumbnail: "/images/kitchen-modern.jpg",
    references: ["/images/kitchen-modern.jpg", "/images/kitchen-loft.jpg"],
  },
  {
    id: "demo-walk-in-emerald",
    groupId: "walk-in",
    name: "Демо-гардеробная «Изумруд»",
    description: `${DEMO_DISCLAIMER}. Не является реальным товаром.`,
    thumbnail: "/images/kitchen-emerald.jpg",
    references: ["/images/kitchen-emerald.jpg", "/images/kitchen-classic.jpg"],
  },
  {
    id: "demo-other-classic",
    groupId: "other",
    name: "Демо-мебель «Классика»",
    description: `${DEMO_DISCLAIMER}. Не является реальным товаром.`,
    thumbnail: "/images/kitchen-classic.jpg",
    references: ["/images/kitchen-classic.jpg", "/images/kitchen-scandi.jpg"],
  },
] as const;
