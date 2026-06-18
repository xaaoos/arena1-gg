import type { HudItem, HudPreset } from "./export";

// Каталог доступных элементов с дефолтами (на сетке 640×480).
// Координаты/значения — из рабочего эталона visualHUD (пресет qh).

export const ELEMENT_LIBRARY: Record<string, () => HudItem> = {
  healthIndicator: () => ({
    name: "healthIndicator", label: "Health", itemType: "general",
    coordinates: { left: 255, top: 444, width: 125, height: 36 },
    iconCoordinates: { left: 0, top: 10, width: 16, height: 16 },
    textCoordinates: { left: 21, top: 0, width: 104, height: 36 },
    textColor: "FF0000", textSize: 100, textStyle: 0, textAlign: 0, teamColors: true,
    colorRanges: [
      { name: "Low", range: [-999, 80], color: "FF0000" },
      { name: "Normal", range: [81, 100], color: "CC7F00" },
      { name: "High", range: [101, 999], color: "4ACC00" },
    ],
    text: "100",
  }),
  armorIndicator: () => ({
    name: "armorIndicator", label: "Armor", itemType: "general",
    coordinates: { left: 415, top: 445, width: 109, height: 32 },
    iconCoordinates: { left: 0, top: 8, width: 16, height: 16 },
    textCoordinates: { left: 16, top: 0, width: 93, height: 32 },
    textColor: "FFFFFF", textSize: 90, textStyle: 0, textAlign: 0, teamColors: true,
    colorRanges: [
      { name: "Low", range: [-999, 50], color: "FF0000" },
      { name: "Normal", range: [51, 100], color: "CC7F00" },
      { name: "High", range: [101, 999], color: "4ACC00" },
    ],
    text: "50",
  }),
  ammoIndicator: () => ({
    name: "ammoIndicator", label: "Ammo", itemType: "general",
    coordinates: { left: 125, top: 450, width: 98, height: 29 },
    iconCoordinates: { left: 0, top: 7, width: 15, height: 15 },
    textCoordinates: { left: 15, top: 0, width: 83, height: 29 },
    textColor: "FFFFFF", textSize: 80, textStyle: 0, textAlign: 0,
    colorRanges: [
      { name: "Low", range: [-999, 5], color: "FF0000" },
      { name: "Normal", range: [6, 99], color: "FFFFFF" },
      { name: "High", range: [100, 999], color: "FFFFFF" },
    ],
    text: "25",
  }),
  timer: () => ({
    name: "timer", label: "Game Clock", itemType: "general",
    coordinates: { left: 280, top: 410, width: 84, height: 25 },
    textCoordinates: { left: 0, top: 0, width: 84, height: 25 },
    textColor: "FFFFFF", textSize: 70, textStyle: 3, textAlign: 0,
    colorRanges: null, text: "12:58",
  }),
  scoreBox: () => ({
    name: "scoreBox", label: "Score", itemType: "scoreBox",
    coordinates: { left: 589, top: 447, width: 50, height: 32 },
    textColor: "FFFFFF", textSize: 26, text: "12",
  }),
  playerItem: () => ({
    name: "playerItem", label: "Player Item", itemType: "iconItem",
    coordinates: { left: 53, top: 457, width: 20, height: 20 },
  }),
  CTFPowerupIndicator: () => ({
    name: "CTFPowerupIndicator", label: "CTF Powerup", itemType: "iconItem",
    coordinates: { left: 28, top: 457, width: 20, height: 20 },
  }),
  flagIndicator: () => ({
    name: "flagIndicator", label: "CTF Flag", itemType: "iconItem",
    coordinates: { left: 3, top: 457, width: 20, height: 20 },
  }),
  powerupIndicator: () => ({
    name: "powerupIndicator", label: "Powerup", itemType: "iconItem",
    coordinates: { left: 6, top: 230, width: 60, height: 30 },
    textColor: "FFFFFF", textSize: 55, text: "0:18",
  }),
  chatArea: () => ({
    name: "chatArea", label: "Chat", itemType: "chatArea",
    coordinates: { left: 0, top: 245, width: 640, height: 160 },
    color: "000000", opacity: 75,
  }),
  rectangleBox: () => ({
    name: "rectangleBox", label: "Box", itemType: "rect",
    coordinates: { left: 278, top: 409, width: 90, height: 30 },
    color: "9933E6", opacity: 60,
  }),
};

export const ELEMENT_ORDER = [
  "healthIndicator", "armorIndicator", "ammoIndicator", "timer",
  "scoreBox", "powerupIndicator", "playerItem", "CTFPowerupIndicator",
  "flagIndicator", "chatArea", "rectangleBox",
];

export const DEFAULT_PRESET: HudPreset = {
  name: "arena1",
  items: ["healthIndicator", "armorIndicator", "ammoIndicator", "timer", "scoreBox"].map((k) => ELEMENT_LIBRARY[k]()),
};
