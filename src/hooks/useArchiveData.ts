import { useState, useEffect } from "react";

const ARCHIVE_URL =
  "https://docs.google.com/spreadsheets/d/1TpT3Q3H_AZEUhDun28hQTuTm3qu4YWpEZddwo1EsrI8/export?format=csv&gid=0";

export interface ArchiveStanding {
  place: string;
  players: string[];
}

export interface ArchiveCup {
  name: string;
  rawDate: string;
  bracketUrl: string;
  standings: ArchiveStanding[];
}

// Анонс — строка той же таблицы: дата есть, результатов ещё нет.
// Когда заполняются результаты, строка автоматически становится карточкой архива.
export interface CupAnnounce {
  name: string;
  rawDate: string; // "дд.мм.гггг" + опционально время/таймзона текстом
  link: string; // ссылка регистрации (Discord и т.п.), может быть пустой
  details: string[]; // остальные строки из ячейки анонса (ELO-диапазон, приз...)
}

const RU_MONTHS = [
  "января","февраля","марта","апреля","мая","июня",
  "июля","августа","сентября","октября","ноября","декабря",
];
const EN_MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

export function formatArchiveDate(rawDate: string, lang: "ru" | "en"): string {
  const m = rawDate.match(/^(\d{2})\.(\d{2})\.(\d{4})/);
  if (!m) return rawDate;
  const day = parseInt(m[1], 10);
  const month = parseInt(m[2], 10) - 1;
  const year = m[3];
  return lang === "ru"
    ? `${day} ${RU_MONTHS[month]} ${year}`
    : `${EN_MONTHS[month]} ${day}, ${year}`;
}

// Дата анонса: "14.06.2026 19:00 MSK" → "14 июня 2026, 19:00 MSK"
export function formatAnnounceDate(rawDate: string, lang: "ru" | "en"): string {
  const extra = rawDate.replace(/^\d{2}\.\d{2}\.\d{4}\s*/, "").trim();
  const base = formatArchiveDate(rawDate, lang);
  return extra ? `${base}, ${extra}` : base;
}

// Full CSV parser that handles multi-line quoted cells
function parseCSVFull(csv: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < csv.length; i++) {
    const ch = csv[i];

    if (inQuotes) {
      if (ch === '"' && csv[i + 1] === '"') {
        field += '"';
        i++;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        field += ch;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === ',') {
        row.push(field.trim());
        field = "";
      } else if (ch === '\n') {
        row.push(field.trim());
        if (row.some((c) => c !== "")) rows.push(row);
        row = [];
        field = "";
      } else if (ch === '\r') {
        // skip
      } else {
        field += ch;
      }
    }
  }

  if (field.trim() || row.length > 0) {
    row.push(field.trim());
    if (row.some((c) => c !== "")) rows.push(row);
  }

  return rows;
}

// Standings text is multi-line: "CupName\nStandings:\n1. P1\n2. P2..."
function parseStandingsText(text: string): { name: string; standings: ArchiveStanding[] } {
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  const name = lines[0] ?? "";
  const bodyStart = lines.findIndex((l) => l.toLowerCase() === "standings:");
  const placementLines = bodyStart > -1 ? lines.slice(bodyStart + 1) : lines.slice(1);

  const standings: ArchiveStanding[] = [];
  for (const line of placementLines) {
    const m = line.match(/^(\d+(?:-\d+)?)\.[ ]+(.*)/);
    if (m) {
      const players = m[2].split(/,\s*/).map((p) => p.trim()).filter(Boolean);
      standings.push({ place: m[1], players });
    }
  }

  return { name, standings };
}

export function parseDate(raw: string): Date | null {
  const m = raw.match(/^(\d{2})\.(\d{2})\.(\d{4})(?:\s+(\d{1,2}):(\d{2}))?/);
  if (!m) return null;
  return new Date(+m[3], +m[2] - 1, +m[1], m[4] ? +m[4] : 0, m[5] ? +m[5] : 0);
}

function parseArchiveCSV(csv: string): { cups: ArchiveCup[]; announces: CupAnnounce[] } {
  const rows = parseCSVFull(csv);
  const cups: ArchiveCup[] = [];
  const announces: CupAnnounce[] = [];

  for (const cols of rows) {
    // CSV structure: col[0]=empty, col[1]=date, col[2]=bracketUrl, col[3]=standings, col[4]=discord
    const rawDate = cols[1]?.trim() ?? "";
    const url = cols[2]?.trim() ?? "";
    const standingsText = cols[3]?.trim() ?? "";

    if (!rawDate.match(/^\d{2}\.\d{2}\.\d{4}/)) continue;

    const { name, standings } = parseStandingsText(standingsText);

    if (standings.length > 0 && url.startsWith("http")) {
      cups.push({ name, rawDate, bracketUrl: url, standings });
    } else if (standings.length === 0) {
      // строка без результатов = анонс будущего кубка
      const lines = standingsText.split("\n").map((l) => l.trim()).filter(Boolean);
      announces.push({
        name: lines[0] ?? "Non-Pro Duel Cup",
        rawDate,
        link: url.startsWith("http") ? url : "",
        details: lines.slice(1).filter((l) => l.toLowerCase() !== "standings:"),
      });
    }
  }

  // анонсы с датой сегодня или позже, ближайший первым
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const upcoming = announces
    .map((a) => ({ a, d: parseDate(a.rawDate) }))
    .filter((x): x is { a: CupAnnounce; d: Date } => x.d !== null && x.d >= today)
    .sort((x, y) => x.d.getTime() - y.d.getTime());

  return { cups: cups.reverse(), announces: upcoming.map((x) => x.a) };
}

export function useArchiveData() {
  const [cups, setCups] = useState<ArchiveCup[]>([]);
  const [announces, setAnnounces] = useState<CupAnnounce[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(ARCHIVE_URL)
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.text();
      })
      .then((csv) => {
        const parsed = parseArchiveCSV(csv);
        setCups(parsed.cups);
        setAnnounces(parsed.announces);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, []);

  return { cups, announces, loading, error };
}
