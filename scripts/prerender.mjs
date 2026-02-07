/**
 * Prerender Script для TverKuhni SPA
 * ====================================
 * Этот скрипт запускается ПОСЛЕ `vite build` и генерирует
 * статический HTML для основных маршрутов.
 *
 * Принцип работы:
 * 1. Поднимает локальный HTTP-сервер с файлами из dist/
 * 2. Открывает каждый маршрут через puppeteer
 * 3. Дожидается рендеринга React-приложения
 * 4. Сохраняет итоговый HTML обратно в dist/
 *
 * Установка: npm install --save-dev puppeteer
 * Запуск: node scripts/prerender.mjs
 *
 * ВАЖНО: Для CI/CD необходим Chrome/Chromium.
 * В Docker используйте образ с Chromium (например, node:20-bullseye + chromium).
 */

import { createServer } from "http";
import { readFile, writeFile, mkdir } from "fs/promises";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { existsSync } from "fs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST_DIR = join(__dirname, "..", "dist");
const PORT = 4173;

// Маршруты для пререндеринга
const ROUTES = ["/"];

/**
 * Простой статический HTTP-сервер для файлов из dist/
 */
function createStaticServer(distDir, port) {
  return new Promise((resolve) => {
    const server = createServer(async (req, res) => {
      let filePath = join(distDir, req.url === "/" ? "index.html" : req.url);

      // SPA fallback: если файл не найден, отдаём index.html
      if (!existsSync(filePath)) {
        filePath = join(distDir, "index.html");
      }

      try {
        const content = await readFile(filePath);
        const ext = filePath.split(".").pop();
        const mimeTypes = {
          html: "text/html",
          js: "application/javascript",
          css: "text/css",
          json: "application/json",
          png: "image/png",
          jpg: "image/jpeg",
          svg: "image/svg+xml",
          ico: "image/x-icon",
        };
        res.writeHead(200, {
          "Content-Type": mimeTypes[ext] || "application/octet-stream",
        });
        res.end(content);
      } catch {
        res.writeHead(404);
        res.end("Not found");
      }
    });

    server.listen(port, () => {
      console.log(
        `[prerender] Static server running on http://localhost:${port}`,
      );
      resolve(server);
    });
  });
}

async function prerender() {
  console.log("[prerender] Starting prerender process...");
  console.log(`[prerender] Dist directory: ${DIST_DIR}`);

  if (!existsSync(DIST_DIR)) {
    console.error(
      "[prerender] ERROR: dist/ directory not found. Run `npm run build` first.",
    );
    process.exit(1);
  }

  // Проверяем, установлен ли puppeteer
  let puppeteer;
  try {
    puppeteer = await import("puppeteer");
  } catch {
    console.warn("[prerender] WARNING: puppeteer not installed.");
    console.warn(
      "[prerender] Install it with: npm install --save-dev puppeteer",
    );
    console.warn(
      "[prerender] Skipping prerendering. The site will work as SPA.",
    );
    console.warn(
      "[prerender] Google can still index SPA content (uses Chromium for rendering).",
    );
    process.exit(0);
  }

  const server = await createStaticServer(DIST_DIR, PORT);

  try {
    const browser = await puppeteer.default.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    for (const route of ROUTES) {
      console.log(`[prerender] Rendering route: ${route}`);

      const page = await browser.newPage();
      await page.goto(`http://localhost:${PORT}${route}`, {
        waitUntil: "networkidle0",
        timeout: 30000,
      });

      // Ждём пока React отрендерит контент
      await page.waitForSelector("#root > *", { timeout: 10000 });

      // Получаем финальный HTML
      const html = await page.content();
      await page.close();

      // Определяем путь для сохранения
      const filePath =
        route === "/"
          ? join(DIST_DIR, "index.html")
          : join(DIST_DIR, route, "index.html");

      // Создаём директорию, если нужно
      const dir = dirname(filePath);
      await mkdir(dir, { recursive: true });

      // Сохраняем пререндеренный HTML
      await writeFile(filePath, html, "utf-8");
      console.log(`[prerender] Saved: ${filePath}`);
    }

    await browser.close();
    console.log("[prerender] All routes prerendered successfully!");
  } catch (error) {
    console.error("[prerender] Error during prerendering:", error);
    process.exit(1);
  } finally {
    server.close();
  }
}

prerender();
