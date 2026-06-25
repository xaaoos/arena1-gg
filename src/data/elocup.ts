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
    ctaDivisions: string; ctaVerified: string; wantJoin: string;
    upcoming: string; cd: [string, string, string, string];
  };
  archive: {
    num: string; label: string; t1: string; t2: string; bracket: string;
    search: string; notFound: string; more: string; results: string;
  };
  footer: string;
  standings: { place: string };
  past: PastCup[];
}

export const ELOCUP: Record<"ru" | "en", EloCupData> = {
  ru: {
    nav: ["Анонс", "Результаты"],
    hero: {
      tag: "QUAKE LIVE",
      t1: "Следующие", t2: "турниры",
      sub: "Еженедельные дуэльные турниры для игроков любого уровня.",
    },
    next: {
      num: "01", label: "СЛЕДУЮЩИЙ ТУРНИР", t1: "Следующий", t2: "турнир",
      name: "600–1350 ELO Cup",
      date: "16 мая 2026, 15:00 MSK (14:00 CEST)",
      elo: "600 – 1350",
      format: "Duel 1v1 Bracket",
      mappool: "Маппул",
      maps: ["Aerowalk", "Battleforged", "Blood Run", "Campgrounds", "Cure", "Dismemberment", "Furious Heights", "Lost World", "Hektik", "Silence", "Sinister", "Toxicity", "Vertical Vengeance"],
      prize: "1 000 RUB + donations",
      cta: "Регистрация — Discord",
      ctaDivisions: "Дивизионы и игроки",
      ctaVerified: "Верифицированные игроки",
      wantJoin: "Хочу участвовать",
      upcoming: "Далее",
      cd: ["дни", "часы", "мин", "сек"],
    },
    archive: {
      num: "02", label: "АРХИВ РЕЗУЛЬТАТОВ", t1: "Прошедшие", t2: "турниры", bracket: "Сетка турнира",
      search: "Поиск игрока по нику...", notFound: "Игрок не найден", more: "Ранее", results: "Результаты",
    },
    footer: "ARENA 1 NON-PRO DUEL CUPS · WEEKLY DUEL TOURNAMENT · 2026",
    standings: { place: "место" },
    past: [
      {
        name: "600–1200 ELO Cup",
        date: "10 мая 2026",
        bracketUrl: "https://shambler.site/id/brackets.php?cup=237",
        standings: [
          { place: "1", players: ["d0n_kih0t"] },
          { place: "2", players: ["trist_woods"] },
          { place: "3", players: ["gadzillaa."] },
          { place: "4", players: ["mplusmrx_16948"] },
          { place: "5–6", players: ["maxwinsman", "narayanasupramati"] },
          { place: "7–8", players: ["_ivvi_", "hoopieble"] },
          { place: "9–12", players: ["dude", "alekseyjuzefovich", "fey5334", "niewi_jr"] },
          { place: "13", players: ["razor101010"] },
        ],
      },
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
    nav: ["Announce", "Results"],
    hero: {
      tag: "QUAKE LIVE",
      t1: "Upcoming", t2: "tournaments",
      sub: "Weekly duel tournaments for players of any level.",
    },
    next: {
      num: "01", label: "NEXT TOURNAMENT", t1: "Next", t2: "tournament",
      name: "600–1350 ELO Cup",
      date: "May 16, 2026, 15:00 MSK (14:00 CEST)",
      elo: "600 – 1350",
      format: "Duel 1v1 Bracket",
      mappool: "Map pool",
      maps: ["Aerowalk", "Battleforged", "Blood Run", "Campgrounds", "Cure", "Dismemberment", "Furious Heights", "Lost World", "Hektik", "Silence", "Sinister", "Toxicity", "Vertical Vengeance"],
      prize: "1 000 RUB + donations",
      cta: "Register — Discord",
      ctaDivisions: "Divisions & Players",
      ctaVerified: "Verified Players",
      wantJoin: "I want to join",
      upcoming: "Upcoming",
      cd: ["days", "hrs", "min", "sec"],
    },
    archive: {
      num: "02", label: "RESULTS ARCHIVE", t1: "Past", t2: "tournaments", bracket: "Tournament bracket",
      search: "Search player by nickname...", notFound: "Player not found", more: "Earlier", results: "Results",
    },
    footer: "ARENA 1 NON-PRO DUEL CUPS · WEEKLY DUEL TOURNAMENT · 2026",
    standings: { place: "place" },
    past: [
      {
        name: "600–1200 ELO Cup",
        date: "May 10, 2026",
        bracketUrl: "https://shambler.site/id/brackets.php?cup=237",
        standings: [
          { place: "1", players: ["d0n_kih0t"] },
          { place: "2", players: ["trist_woods"] },
          { place: "3", players: ["gadzillaa."] },
          { place: "4", players: ["mplusmrx_16948"] },
          { place: "5–6", players: ["maxwinsman", "narayanasupramati"] },
          { place: "7–8", players: ["_ivvi_", "hoopieble"] },
          { place: "9–12", players: ["dude", "alekseyjuzefovich", "fey5334", "niewi_jr"] },
          { place: "13", players: ["razor101010"] },
        ],
      },
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
