// Quake Live duel spawn-system data.
// Original visualization & map renders by Memento_Mori (March 2015).
// Source: https://www.esreality.com/?a=post&id=2219012
// Ported from the standalone HTML to React for arena1.gg.

export interface MapData {
  id: string; // matches /respawn-maps/<id>.png
  name: string;
  origin: [number, number, number]; // top, left, lowestSP
  end: [number, number, number]; // bottom, right, highestSP
  vis: [number, number, number]; // width, height, spSizeRange
  count: number; // number of active spawns
  middle: number; // closest spawns excluded from next spawn
  spawns: [number, number, number][]; // x, y, size(z)
}

export const MAPS: MapData[] = [
  {
    id: "aerowalk", name: "Aerowalk",
    origin: [-890, 776, -48], end: [1274, -846, 376], vis: [992, 744, 6],
    count: 8, middle: 4,
    spawns: [
      [960, -160, 144], [-132, 364, 144], [776, 12, 376], [160, -352, -48],
      [-608, -304, 144], [-384, -106, 360], [544, -668, 376], [408, 560, 376],
    ],
  },
  {
    id: "battleforged", name: "Battleforged",
    origin: [-1305, 1041, -496], end: [1287, -1369, -96], vis: [947, 882, 6],
    count: 9, middle: 5,
    spawns: [
      [1056, -152, -328], [232, -1200, -136], [-352, -600, -200], [-864, 432, -72],
      [104, -256, -472], [352, -16, -72], [1040, 472, -136], [-976, -152, 24], [392, -16, -296],
    ],
  },
  {
    id: "bloodrun", name: "Bloodrun",
    origin: [-1134, 1124, 24], end: [1648, -1662, 536], vis: [788, 788, 6],
    count: 10, middle: 5,
    spawns: [
      [-640, -848, 408], [864, -800, 88], [352, 480, 440], [1120, 224, 88], [496, -720, 440],
      [96, -40, 24], [96, -408, 24], [1232, -1312, 280], [240, -1136, 272], [-192, -848, 408],
    ],
  },
  {
    id: "campgrounds", name: "Campgrounds",
    origin: [-1796, 1268, 24], end: [1044, -1572, 538], vis: [800, 800, 6],
    count: 17, middle: 8,
    spawns: [
      [-208, 448, 24], [-576, 1088, 154], [40, -704, 538], [888, -768, 410], [-1616, 200, 24],
      [-856, 472, 24], [-64, -1088, 282], [-192, 64, 282], [-992, 192, 284], [464, -976, 538],
      [-352, -848, 282], [447, -160, 282], [-848, -832, 284], [-192, -960, 538], [8, -176, 26],
      [888, -512, 410], [-768, 1088, 154],
    ],
  },
  {
    id: "campgroundsintel", name: "Campgrounds (Intel)",
    origin: [-2051, 1319, 0], end: [1099, -1560, 512], vis: [1040, 943, 6],
    count: 17, middle: 8,
    spawns: [
      [-208, 448, 24], [-576, 1088, 154], [40, -704, 538], [888, -768, 410], [-1616, 200, 24],
      [-856, 472, 24], [-64, -1088, 282], [-216, 40, 282], [-992, 192, 284], [464, -976, 538],
      [-352, -848, 282], [447, -160, 282], [-848, -832, 284], [-192, -960, 538], [8, -176, 26],
      [888, -512, 410], [-768, 1088, 154],
    ],
  },
  {
    id: "cure", name: "Cure",
    origin: [-745, 1400, 24], end: [2039, -1398, 536], vis: [832, 832, 6],
    count: 12, middle: 6,
    spawns: [
      [-356, -96, -40], [416, -544, 408], [1168, 464, 216], [1024, -864, -104], [-356, 32, -40],
      [800, 544, -104], [-360, 488, 344], [-24, 92, -40], [1344, 32, -104], [416, -544, 152],
      [152, 872, 280], [1696, -160, -8],
    ],
  },
  {
    id: "furiousheights", name: "Furious Heights",
    origin: [-2300, 1650, 24], end: [692, -590, 472], vis: [1066, 800, 6],
    count: 17, middle: 8,
    spawns: [
      [16, 352, 24], [96, 736, 24], [-336, 960, 216], [-616, 920, 344], [288, -160, 472],
      [-528, 104, 472], [-1632, 800, 24], [-416, 864, 24], [96, 480, 24], [-544, 112, 24],
      [-1312, 800, 440], [-1952, -160, 88], [-928, 424, 24], [-1688, 608, 0], [-1264, 448, 24],
      [-864, 1440, 440], [-800, 608, 472],
    ],
  },
  {
    id: "hektik", name: "Hektik",
    origin: [-1405, 1477, -152], end: [1052, -912, 264], vis: [800, 800, 6],
    count: 9, middle: 4,
    spawns: [
      [600, 944, 256], [-616, 56, 56], [-104, 1032, 56], [-160, -160, -152], [-496, 400, 256],
      [-8, -544, 264], [288, -352, -8], [-976, 320, 160], [-528, -520, 224],
    ],
  },
  {
    id: "lostworld", name: "Lost World",
    origin: [-1088, 1490, 24], end: [1774, -656, 472], vis: [1067, 800, 6],
    count: 18, middle: 9,
    spawns: [
      [648, 488, 408], [928, -192, 472], [-96, 576, 472], [968, 328, 344], [-392, 784, 472],
      [912, 1060, 344], [100, 336, 24], [1142, 480, 408], [256, 656, 472], [1380, 468, 216],
      [552, 1240, 176], [-368, 288, 216], [-32, 40, 216], [744, 0, 408], [80, 1008, 472],
      [240, 804, 472], [976, 658, 344], [512, -64, 24],
    ],
  },
  {
    id: "silence", name: "Silence",
    origin: [-1425, 1250, -192], end: [1406, -1543, 450], vis: [941, 941, 6],
    count: 12, middle: 6,
    spawns: [
      [0, 800, 184], [216, -1240, -104], [-688, 800, 24], [-448, -672, 368], [-1024, 288, 184],
      [-672, -144, 88], [352, 32, -104], [-728, -96, 368], [416, 160, 184], [552, -1024, -40],
      [64, -1184, 312], [1032, -704, 184],
    ],
  },
  {
    id: "sinister", name: "Sinister",
    origin: [-805, 1663, -64], end: [1709, -832, 512], vis: [867, 867, 6],
    count: 11, middle: 5,
    spawns: [
      [1272, 488, 96], [1192, -384, 288], [1344, -424, 480], [-304, 688, 316], [56, 504, 8],
      [680, 352, 544], [408, 280, 8], [160, 384, 320], [-304, -208, 288], [-584, 352, 24],
      [1096, 1256, 544],
    ],
  },
  {
    id: "terminatria", name: "Terminatria",
    origin: [-2246, 1698, -640], end: [1304, -993, 128], vis: [1165, 897, 6],
    count: 13, middle: 6,
    spawns: [
      [-48, 688, -472], [-224, 960, -40], [-1520, 0, -520], [-1544, 360, -40], [-1152, 544, -40],
      [-1360, 1200, -360], [-592, 1200, -264], [976, 304, -520], [320, 320, -40], [-352, -288, -296],
      [-960, -288, -40], [-48, -208, -552], [640, 416, -296],
    ],
  },
  {
    id: "toxicity", name: "Toxicity",
    origin: [-1678, 2634, 1032], end: [364, 566, 1240], vis: [800, 800, 6],
    count: 8, middle: 4,
    spawns: [
      [-184, 1488, 1240], [80, 2256, 1208], [-1344, 1408, 1112], [-192, 928, 1208],
      [-512, 1240, 1032], [96, 1904, 1112], [-1312, 2072, 1000], [-976, 1776, 1240],
    ],
  },
  {
    id: "windsongkeep", name: "Windsong Keep",
    origin: [-825, 1412, -192], end: [2012, -1459, 200], vis: [930, 917, 6],
    count: 8, middle: 4,
    spawns: [
      [328, -276, 120], [1152, -176, 88], [576, 344, 152], [416, 224, -104], [-144, -896, 120],
      [1172, -480, -168], [192, -1312, 120], [1344, 808, -168],
    ],
  },
];

export const SPAWNS_TXT = {
  ru: {
    title: "SPAWN MAPS",
    subtitle: "Интерактивная карта спаунов Quake Live · дуэль",
    intro:
      "Система спаунов в дуэли QL не случайна. Следующая точка появления зависит от того, где находятся игроки. Наведи курсор на карту (твоя/чужая позиция) — зелёные точки покажут возможные спауны, красные исключены как слишком близкие.",
    hintDesktop: "Наведи курсор на карту",
    hintMobile: "Веди пальцем по карте",
    legendPossible: "возможный спаун",
    legendRejected: "исключён",
    legendSize: "размер кружка = высота точки спауна",
    creditTitle: "Источник данных",
    creditBody:
      "Визуализация и рендеры карт — Memento_Mori (март 2015). Перенесено на arena1.gg с сохранением авторства.",
    creditLink: "Оригинальный пост на ESReality",
  },
  en: {
    title: "SPAWN MAPS",
    subtitle: "Interactive Quake Live spawn map · duel",
    intro:
      "The QL duel spawn system is not random. The next spawn point depends on where the players are. Hover over the map (your / opponent position) — green dots show possible spawns, red ones are excluded as too close.",
    hintDesktop: "Move your cursor over the map",
    hintMobile: "Drag your finger across the map",
    legendPossible: "possible spawn",
    legendRejected: "rejected",
    legendSize: "circle size = spawn height",
    creditTitle: "Data source",
    creditBody:
      "Visualization & map renders by Memento_Mori (March 2015). Ported to arena1.gg with original credit preserved.",
    creditLink: "Original post on ESReality",
  },
};
