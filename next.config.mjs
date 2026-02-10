/** @type {import('next').NextConfig} */
const nextConfig = {
  // Включаем поддержку src/ директории (файлы app/ лежат в src/app/)
  // Next.js автоматически находит src/app/

  // Транспиляция пакетов, которые поставляются как ESM
  transpilePackages: [
    "framer-motion",
    "lucide-react",
  ],

  // Настройка изображений
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
