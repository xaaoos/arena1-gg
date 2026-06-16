// Пререндер статичных роутов: поднимаем vite preview, обходим маршруты headless-браузером,
// сохраняем отрендеренный HTML (с проставленными helmet-мета) в dist/<route>/index.html.
// Так краулеры и соц-боты (которые не выполняют JS) получают готовый контент и OG-теги.
import { preview } from "vite";
import { chromium } from "playwright";
import { writeFileSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url)) + "/..";
const dist = join(root, "dist");
const SITE = "https://arena1.gg";

// слаги блога вытягиваем из исходника, чтобы sitemap не устаревал
const blogSrc = readFileSync(join(root, "src/data/blog.ts"), "utf8");
const blogSlugs = [...blogSrc.matchAll(/slug:\s*["'`]([^"'`]+)["'`]/g)].map((m) => m[1]);

// роуты для пререндера и sitemap (championship/verified скрыты — не индексируем)
const indexable = ["/", "/non-pro-duel-cups", "/divisions", "/trainer", "/spawns", "/blog", ...blogSlugs.map((s) => `/blog/${s}`)];
const hidden = ["/championship", "/verified"];
const routes = [...indexable, ...hidden];

const server = await preview({ root, preview: { port: 4188 } });
const base = "http://localhost:4188";
const browser = await chromium.launch();
const page = await browser.newPage();

for (const route of routes) {
  try {
    await page.goto(base + route, { waitUntil: "networkidle", timeout: 20000 });
  } catch {
    // данные из Google Sheets могут не догрузиться в CI — статичный контент и мета всё равно сохраняем
    await page.waitForTimeout(1500);
  }
  await page.waitForTimeout(800); // helmet проставляет <head>
  // убираем статичные мета из index.html, которые helmet продублировал (canonical, og:*, twitter:*, description)
  await page.evaluate(() => {
    const keyOf = (el) =>
      el.tagName + ":" + (el.getAttribute("property") || el.getAttribute("name") || el.getAttribute("rel") || "");
    const managed = new Set();
    document.querySelectorAll("head [data-rh]").forEach((el) => managed.add(keyOf(el)));
    document.querySelectorAll("head meta, head link[rel='canonical']").forEach((el) => {
      if (!el.hasAttribute("data-rh") && managed.has(keyOf(el))) el.remove();
    });
  });
  const html = "<!DOCTYPE html>\n" + (await page.evaluate(() => document.documentElement.outerHTML));
  const outDir = route === "/" ? dist : join(dist, route);
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, "index.html"), html);
  console.log("prerendered", route);
}

// sitemap.xml
const now = new Date().toISOString().slice(0, 10);
const urls = indexable
  .map((r) => `  <url><loc>${SITE}${r === "/" ? "" : r}</loc><lastmod>${now}</lastmod></url>`)
  .join("\n");
writeFileSync(
  join(dist, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
);
console.log("sitemap.xml written:", indexable.length, "urls");

await browser.close();
await server.httpServer.close();
process.exit(0);
