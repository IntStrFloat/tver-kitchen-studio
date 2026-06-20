import type { Metadata } from "next";

import TryOnWizard from "@/components/try-on/TryOnWizard";

export const metadata: Metadata = {
  title: "Примерить мебель в своём интерьере | Kuhnitver",
  description: "Загрузите фото комнаты и посмотрите выбранную мебель Kuhnitver в своём интерьере.",
  robots: { index: false, follow: false },
};

export default function TryOnPage() {
  return <main className="min-h-screen pt-20"><TryOnWizard /></main>;
}
