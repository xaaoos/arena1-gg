// Экспорт HUD-раскладки в формат Quake Live (.menu + .cfg).
// Адаптация формата visualHUD (by namad) — реконструировано по рабочим эталонам
// (gist p4v qh.menu/qh.vhud, DimitarChristoff/quakelive). Координаты — сетка 640×480.
//
// Модель элемента совместима с .vhud (JSON visualHUD), чтобы можно было
// импортировать существующие пресеты.

export interface Coords { top: number; left: number; width: number; height: number; }
export interface ColorRange { range: [number | string, number | string]; color: string; name?: string; }

export interface HudItem {
  name: string; // healthIndicator | armorIndicator | ammoIndicator | timer | scoreBox | ...
  itemType?: string;
  label?: string;
  coordinates: Coords;
  iconCoordinates?: Partial<Coords>;
  textCoordinates?: Partial<Coords>;
  textColor?: string; // hex RRGGBB
  textSize?: number | string; // 100 => textscale 1
  textStyle?: number | string;
  textAlign?: number | string;
  teamColors?: boolean;
  colorRanges?: ColorRange[] | null;
  iconStyle?: number | string;
  color?: string; // для rect/chat фона
  opacity?: number | string; // 0..100
  text?: string;
}

export interface HudPreset { name: string; items: HudItem[]; }

const n = (v: number | string | undefined, d = 0): number => {
  const x = typeof v === "string" ? parseFloat(v) : v;
  return x == null || isNaN(x as number) ? d : (x as number);
};
const num = (v: number): string => {
  const r = Math.round(v * 1000) / 1000;
  return String(r);
};

// HEX RRGGBB -> "r g b" (0..1, до 3 знаков)
const hexToRgb = (hex?: string): string => {
  const h = (hex || "FFFFFF").replace("#", "").padEnd(6, "0");
  const c = (i: number) => num(parseInt(h.slice(i, i + 2), 16) / 255);
  return `${c(0)} ${c(2)} ${c(4)}`;
};

const rect = (c?: Partial<Coords>): string =>
  `${num(n(c?.left))} ${num(n(c?.top))} ${num(n(c?.width))} ${num(n(c?.height))}`;

// ownerdraw счётчика по имени элемента
const COUNTER_OWNERDRAW: Record<string, string> = {
  healthIndicator: "CG_PLAYER_HEALTH",
  armorIndicator: "CG_PLAYER_ARMOR_VALUE",
  ammoIndicator: "CG_PLAYER_AMMO_VALUE",
  timer: "CG_LEVELTIMER",
  fragsIndicator: "CG_PLAYER_SCORE",
};
// фон иконки (tga) по имени
const ICON_BG: Record<string, string> = {
  healthIndicator: "ui/assets/hud/health.tga",
  armorIndicator: "ui/assets/hud/armor.tga",
};

const TAB = "\t";
const colorRangeLines = (ranges?: ColorRange[] | null): string => {
  if (!ranges || !ranges.length) return "";
  return ranges
    .map((r) => `${TAB}${TAB}addColorRange ${n(r.range[0])} ${n(r.range[1])} ${hexToRgb(r.color)} 1`)
    .join("\n") + "\n";
};

// --- генераторы menuDef по типам элементов ---

function genIndicator(it: HudItem): string {
  // health / armor / ammo / frags: иконка + счётчик
  const od = COUNTER_OWNERDRAW[it.name] || "CG_PLAYER_HEALTH";
  const fore = `${hexToRgb(it.textColor)} 1`;
  const scale = num(n(it.textSize, 100) / 100);
  const style = n(it.textStyle, 0);
  const align = n(it.textAlign, 0);
  const iconBg = ICON_BG[it.name];

  let icon = "";
  if (it.name === "ammoIndicator") {
    // у аммо иконка — ownerdraw (меняется по оружию), без tga
    icon =
`${TAB}itemDef {
${TAB}${TAB}name "${it.name}Icon"
${TAB}${TAB}rect ${rect(it.iconCoordinates)}
${TAB}${TAB}visible 1
${TAB}${TAB}decoration
${TAB}${TAB}ownerdraw CG_PLAYER_AMMO_ICON
${TAB}}
`;
  } else if (iconBg) {
    icon =
`${TAB}itemDef {
${TAB}${TAB}name "${it.name}Icon"
${TAB}${TAB}rect ${rect(it.iconCoordinates)}
${TAB}${TAB}visible 1
${TAB}${TAB}decoration
${TAB}${TAB}style 1
${TAB}${TAB}backcolor 1 1 1 1
${TAB}${TAB}background "${iconBg}"
${it.teamColors ? `${TAB}${TAB}ownerdraw CG_TEAM_COLORIZED\n` : ""}${TAB}}
`;
  }

  const counter =
`${TAB}itemDef {
${TAB}${TAB}name "${it.name}Counter"
${TAB}${TAB}rect ${rect(it.textCoordinates)}
${TAB}${TAB}visible 1
${TAB}${TAB}textalign ${align}
${TAB}${TAB}decoration
${TAB}${TAB}textstyle ${style}
${TAB}${TAB}forecolor ${fore}
${TAB}${TAB}textscale ${scale}
${TAB}${TAB}ownerdraw ${od}
${colorRangeLines(it.colorRanges)}${TAB}}
`;

  return wrapMenu(it, icon + counter);
}

function genTimer(it: HudItem): string {
  const fore = `${hexToRgb(it.textColor)} 1`;
  const scale = num(n(it.textSize, 100) / 100);
  const style = n(it.textStyle, 3);
  const counter =
`${TAB}itemDef {
${TAB}${TAB}name "timerCounter"
${TAB}${TAB}rect ${rect(it.textCoordinates)}
${TAB}${TAB}visible 1
${TAB}${TAB}textalign ${n(it.textAlign, 0)}
${TAB}${TAB}decoration
${TAB}${TAB}textstyle ${style}
${TAB}${TAB}forecolor ${fore}
${TAB}${TAB}textscale ${scale}
${TAB}${TAB}ownerdraw CG_LEVELTIMER
${TAB}}
`;
  return wrapMenu(it, counter);
}

function genRect(it: HudItem): string {
  const a = num(n(it.opacity, 100) / 100);
  const inner =
`${TAB}itemDef {
${TAB}${TAB}name "boxBackground"
${TAB}${TAB}rect 0 0 ${num(n(it.coordinates.width))} ${num(n(it.coordinates.height))}
${TAB}${TAB}visible 1
${TAB}${TAB}style WINDOW_STYLE_FILLED
${TAB}${TAB}backcolor ${hexToRgb(it.color)} ${a}
${TAB}}
`;
  return wrapMenu(it, inner);
}

function genIconItem(it: HudItem, ownerdraw: string, extra = ""): string {
  const inner =
`${TAB}itemDef {
${TAB}${TAB}name "${it.name}Icon"
${TAB}${TAB}rect 0 0 ${num(n(it.coordinates.width))} ${num(n(it.coordinates.height))}
${TAB}${TAB}visible 1
${TAB}${TAB}decoration
${extra}${TAB}${TAB}ownerdraw ${ownerdraw}
${TAB}}
`;
  return wrapMenu(it, inner);
}

function genChat(it: HudItem): string {
  const a = num(n(it.opacity, 75) / 100);
  const w = num(n(it.coordinates.width, 640));
  const h = num(n(it.coordinates.height, 160));
  const inner =
`${TAB}itemDef {
${TAB}${TAB}name "chatBackground"
${TAB}${TAB}rect 0 0 ${w} ${h}
${TAB}${TAB}visible 1
${TAB}${TAB}style WINDOW_STYLE_FILLED
${TAB}${TAB}ownerdrawflag CG_SHOW_IF_CHAT_VISIBLE
${TAB}${TAB}backcolor ${hexToRgb(it.color)} ${a}
${TAB}}

${TAB}itemDef {
${TAB}${TAB}name "chatWindow"
${TAB}${TAB}rect 3 1 ${num(n(it.coordinates.width, 640) - 6)} ${num(n(it.coordinates.height, 160) - 6)}
${TAB}${TAB}visible 1
${TAB}${TAB}decoration
${TAB}${TAB}ownerdraw CG_AREA_NEW_CHAT
${TAB}}
`;
  return wrapMenu(it, inner);
}

function wrapMenu(it: HudItem, inner: string): string {
  return (
`menuDef {
${TAB}name "${it.name}"
${TAB}fullScreen MENU_FALSE
${TAB}visible MENU_TRUE
${TAB}rect ${rect(it.coordinates)}
${inner}}
`
  );
}

function genItem(it: HudItem): string {
  switch (it.name) {
    case "healthIndicator":
    case "armorIndicator":
    case "ammoIndicator":
    case "fragsIndicator":
      return genIndicator(it);
    case "timer":
      return genTimer(it);
    case "rectangleBox":
      return genRect(it);
    case "chatArea":
      return genChat(it);
    case "playerItem":
      return genIconItem(it, "CG_PLAYER_ITEM");
    case "CTFPowerupIndicator":
      return genIconItem(it, "CG_CTF_POWERUP");
    case "powerupIndicator":
      return genIconItem(it, "CG_AREA_POWERUP", `${TAB}${TAB}textscale 0.25\n`);
    case "flagIndicator":
      return genIconItem(it, "CG_PLAYER_HASFLAG", `${TAB}${TAB}style 1\n`);
    case "scoreBox":
      return genIconItem(it, "CG_1ST_PLACE_SCORE", `${TAB}${TAB}textscale 0.26\n`);
    default:
      // неизвестный тип — пропускаем с комментарием
      return `// (skipped unknown element: ${it.name})\n`;
  }
}

export function exportMenu(preset: HudPreset): string {
  const head = `#include "ui/menudef.h"\n\n// Generated by arena1.gg HUD editor — adaptation of visualHUD (by namad)\n\n`;
  const body = preset.items.map(genItem).join("\n");
  return head + body;
}

export function exportCfg(presetName: string): string {
  return `// Quake Live HUD config — arena1.gg\n{\n  loadMenu { "ui/${presetName}.menu" }\n}\n`;
}

export function exportHud(preset: HudPreset): { cfg: string; menu: string } {
  const safe = (preset.name || "arena1hud").replace(/[^a-z0-9_-]/gi, "_");
  return { cfg: exportCfg(safe), menu: exportMenu(preset) };
}
