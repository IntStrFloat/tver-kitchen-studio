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
    // Пытаемся использовать системный Chromium, если он установлен
    let executablePath;
    try {
      const { execSync } = await import("child_process");
      try {
        const chromiumPath = execSync("which chromium", {
          encoding: "utf-8",
        }).trim();
        if (chromiumPath) {
          executablePath = chromiumPath;
          console.log(`[prerender] Using system Chromium: ${executablePath}`);
        }
      } catch {
        // chromium не найден, пробуем chromium-browser
        try {
          const chromiumBrowserPath = execSync("which chromium-browser", {
            encoding: "utf-8",
          }).trim();
          if (chromiumBrowserPath) {
            executablePath = chromiumBrowserPath;
            console.log(`[prerender] Using system Chromium: ${executablePath}`);
          }
        } catch {
          // Используем Chrome из Puppeteer
        }
      }
    } catch {
      // Используем Chrome из Puppeteer
    }

    const browser = await puppeteer.default.launch({
      headless: true,
      executablePath,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
        "--disable-software-rasterizer",
        "--disable-extensions",
      ],
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

    // Проверяем, является ли это ошибкой отсутствующих библиотек
    if (error.message && error.message.includes("shared libraries")) {
      console.error(
        "\n[prerender] ⚠️  Отсутствуют системные библиотеки для Chrome/Chromium.",
      );
      console.error("[prerender] Установите зависимости:");
      console.error("\n  Рекомендуемый способ (Ubuntu 24.04+):");
      console.error("    sudo apt-get update");
      console.error("    sudo apt-get install -y chromium chromium-driver");
      console.error("\n  Для Ubuntu 24.04+ (все зависимости):");
      console.error("    sudo apt-get update");
      console.error("    sudo apt-get install -y \\");
      console.error("      chromium \\");
      console.error("      libnspr4 \\");
      console.error("      libnss3 \\");
      console.error("      libatk1.0-0t64 \\");
      console.error("      libatk-bridge2.0-0t64 \\");
      console.error("      libcups2t64 \\");
      console.error("      libdrm2 \\");
      console.error("      libxkbcommon0 \\");
      console.error("      libxcomposite1 \\");
      console.error("      libxdamage1 \\");
      console.error("      libxfixes3 \\");
      console.error("      libxrandr2 \\");
      console.error("      libgbm1 \\");
      console.error("      libasound2t64");
      console.error("\n  Для Ubuntu 20.04/22.04:");
      console.error("    sudo apt-get update");
      console.error("    sudo apt-get install -y chromium-browser");
      console.error(
        "\n[prerender] После установки скрипт автоматически использует системный Chromium.",
      );
    }

    process.exit(1);
  } finally {
    server.close();
  }
}

prerender();
