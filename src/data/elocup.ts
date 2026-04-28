export interface Standing {
  place: string;
  players: string[];
}

export interface PastCup {
  name: string;
  date: string;
  bracketUrl: string;
  standings: Standing[];
}

export interface EloCupData {
  nav: string[];
  hero: { tag: string; t1: string; t2: string; sub: string };
  next: {
    num: string; label: string; t1: string; t2: string;
    name: string; date: string; elo: string; format: string;
    mappool: string; maps: string[]; prize: string; cta: string;
  };
  archive: { num: string; label: string; t1: string; t2: string; bracket: string };
  footer: string;
  standings: { place: string };
  past: PastCup[];
}

export const ELOCUP: Record<"ru" | "en", EloCupData> = {
  ru: {
    nav: ["ELO Cup", "Следующий", "Архив"],
    hero: {
      tag: "A R E N A  1  E L O  C U P",
      t1: "ELO", t2: "CUP",
      sub: "Еженедельные дуэльные турниры с ELO-ограничениями для верифицированных игроков. Докажи свой уровень в честном брекете.",
    },
    next: {
      num: "01", label: "СЛЕДУЮЩИЙ ТУРНИР", t1: "Следующий", t2: "турнир",
      name: "1000–2000 ELO Cup",
      date: "Дата уточняется",
      elo: "1000 – 2000",
      format: "Duel 1v1 Bracket",
      mappool: "Маппул",
      maps: ["Aerowalk", "Battleforged", "Blood Run", "Campgrounds", "Cure", "Dismemberment", "Furious Heights", "Lost World", "Hektik", "Silence", "Sinister", "Toxicity", "Vertical Vengeance"],
      prize: "1 000 RUB + donations",
      cta: "Перейти в Discord",
    },
    archive: { num: "02", label: "АРХИВ РЕЗУЛЬТАТОВ", t1: "Прошедшие", t2: "турниры", bracket: "Сетка турнира" },
    footer: "ARENA 1 ELO CUP · WEEKLY DUEL TOURNAMENT · 2026",
    standings: { place: "место" },
    past: [
      {
        name: "1000–2000 ELO Cup",
        date: "26 апреля 2026",
        bracketUrl: "https://shambler.site/id/brackets.php?cup=232",
        standings: [
          { place: "1", players: ["ARSENY"] },
          { place: "2", players: ["h3lldown"] },
          { place: "3", players: ["RELL"] },
          { place: "4", players: ["MIJKEEEE"] },
          { place: "5–6", players: ["blr_by", "n0p4a"] },
          { place: "7–8", players: ["arices_", "Folla"] },
          { place: "9–12", players: ["zowie9917", "dude", "alekseyjuzefovich", "mplusmrx_16948"] },
        ],
      },
    ],
  },
  en: {
    nav: ["ELO Cup", "Next", "Archive"],
    hero: {
      tag: "A R E N A  1  E L O  C U P",
      t1: "ELO", t2: "CUP",
      sub: "Weekly duel tournaments with ELO restrictions for verified players. Prove your level in a fair bracket.",
    },
    next: {
      num: "01", label: "NEXT TOURNAMENT", t1: "Next", t2: "tournament",
      name: "1000–2000 ELO Cup",
      date: "Date TBA",
      elo: "1000 – 2000",
      format: "Duel 1v1 Bracket",
      mappool: "Map pool",
      maps: ["Aerowalk", "Battleforged", "Blood Run", "Campgrounds", "Cure", "Dismemberment", "Furious Heights", "Lost World", "Hektik", "Silence", "Sinister", "Toxicity", "Vertical Vengeance"],
      prize: "1 000 RUB + donations",
      cta: "Join Discord",

    },
    archive: { num: "02", label: "RESULTS ARCHIVE", t1: "Past", t2: "tournaments", bracket: "Tournament bracket" },
    footer: "ARENA 1 ELO CUP · WEEKLY DUEL TOURNAMENT · 2026",
    standings: { place: "place" },
    past: [
      {
        name: "1000–2000 ELO Cup",
        date: "April 26, 2026",
        bracketUrl: "https://shambler.site/id/brackets.php?cup=232",
        standings: [
          { place: "1", players: ["ARSENY"] },
          { place: "2", players: ["h3lldown"] },
          { place: "3", players: ["RELL"] },
          { place: "4", players: ["MIJKEEEE"] },
          { place: "5–6", players: ["blr_by", "n0p4a"] },
          { place: "7–8", players: ["arices_", "Folla"] },
          { place: "9–12", players: ["zowie9917", "dude", "alekseyjuzefovich", "mplusmrx_16948"] },
        ],
      },
    ],
  },
};
