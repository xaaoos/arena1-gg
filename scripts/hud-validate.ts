// Офлайн-валидация экспортёра: qh.vhud -> .menu, сверка с эталонным qh.menu.
// Запуск: node scripts/hud-validate.ts
import { readFileSync } from "node:fs";
import { exportMenu, type HudPreset } from "../src/hud/export.ts";

const REF = "/tmp/vhud_src";
const vhud = JSON.parse(readFileSync(`${REF}/qh.vhud`, "utf8"));
const preset: HudPreset = (Array.isArray(vhud) ? vhud : [vhud])[0];
const refMenu = readFileSync(`${REF}/qh.menu`, "utf8");

const out = exportMenu(preset);
console.log("=== СГЕНЕРИРОВАННЫЙ .menu (фрагмент) ===");
console.log(out.split("\n").slice(0, 60).join("\n"));

const checks: [string, boolean][] = [];
const has = (s: string) => out.includes(s);

// все элементы превратились в menuDef
const menuCount = (out.match(/menuDef\s*{/g) || []).length;
checks.push([`menuDef на каждый элемент (${menuCount}/${preset.items.length})`, menuCount === preset.items.length]);

// ключевые ownerdraw присутствуют
for (const od of ["CG_PLAYER_HEALTH", "CG_PLAYER_ARMOR_VALUE", "CG_PLAYER_AMMO_VALUE", "CG_PLAYER_AMMO_ICON", "CG_LEVELTIMER", "CG_PLAYER_ITEM", "CG_CTF_POWERUP", "CG_AREA_NEW_CHAT"]) {
  checks.push([`ownerdraw ${od}`, has(od) && refMenu.includes(od)]);
}

// rect health = координаты из модели
const health = preset.items.find((i) => i.name === "healthIndicator")!;
const expRect = `${health.coordinates.left} ${health.coordinates.top} ${health.coordinates.width} ${health.coordinates.height}`;
checks.push([`rect health = "${expRect}"`, has(`rect ${expRect}`)]);

// число цветовых диапазонов health
const hCount = (out.split('name "healthIndicatorCounter"')[1] || "").split("addColorRange").length - 1;
checks.push([`health colorRanges = ${health.colorRanges?.length}`, hCount === (health.colorRanges?.length || 0)]);

// forecolor health = FF0000 -> 1 0 0
checks.push([`health forecolor 1 0 0`, has("forecolor 1 0 0 1")]);

// textscale armor = 90/100 = 0.9
checks.push([`armor textscale 0.9`, has("textscale 0.9")]);

console.log("\n=== ПРОВЕРКИ ===");
let ok = 0;
for (const [name, pass] of checks) {
  console.log(`${pass ? "✓" : "✗"} ${name}`);
  if (pass) ok++;
}
console.log(`\n${ok}/${checks.length} прошло`);
process.exit(ok === checks.length ? 0 : 1);
