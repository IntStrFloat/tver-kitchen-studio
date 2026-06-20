export const TRY_ON_GROUPS = [
  { id: "kitchens", label: "Кухни" },
  { id: "wardrobes", label: "Шкафы" },
  { id: "walk-in", label: "Гардеробные" },
  { id: "other", label: "Другая мебель" },
] as const;

export type TryOnGroupId = (typeof TRY_ON_GROUPS)[number]["id"];

export interface TryOnProduct {
  id: string;
  groupId: TryOnGroupId;
  name: string;
  description: string;
  thumbnail: string;
  references: readonly string[];
}

export const TRY_ON_PRODUCTS: readonly TryOnProduct[] = [];
