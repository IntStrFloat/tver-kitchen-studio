/** @type {import('next').NextConfig} */
const nextConfig = {
  // Транспиляция пакетов, которые поставляются как ESM
  transpilePackages: [
    "framer-motion",
    "lucide-react",
  ],

  // Настройка изображений
  images: {
    formats: ["image/avif", "image/webp"],
  },

  // === Оптимизация билда для серверов с ограниченными ресурсами ===

  // Пропускаем проверку TypeScript при билде.
  // TS проверяется локально/в CI командой `tsc --noEmit`.
  // Это экономит ~300-500 МБ RAM и 30-60 сек на сервере.
  typescript: {
    ignoreBuildErrors: true,
  },

  // Уменьшаем потребление памяти при генерации статических страниц
  experimental: {
    workerThreads: false,
    cpus: 1,
  },
};

export default nextConfig;
