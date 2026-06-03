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

function parseRow(row: string): string[] {
  const cols: string[] = [];
  let cur = "";
  let inQuote = false;
  for (let i = 0; i < row.length; i++) {
    const ch = row[i];
    if (ch === '"') {
      inQuote = !inQuote;
    } else if (ch === "," && !inQuote) {
      cols.push(cur.trim());
      cur = "";
    } else {
      cur += ch;
    }
  }
  cols.push(cur.trim());
  return cols;
}

function parseStandingsText(text: string): { name: string; standings: ArchiveStanding[] } {
  const idx = text.indexOf(" Standings:");
  const name = idx > -1 ? text.slice(0, idx).trim() : text;
  const body = idx > -1 ? text.slice(idx + 11).trim() : "";

  // Split on whitespace before a placement pattern like "5-6. " or "13. "
  const tokens = body.split(/\s+(?=\d+(?:-\d+)?\. )/);
  const standings: ArchiveStanding[] = [];

  for (const token of tokens) {
    const m = token.match(/^(\d+(?:-\d+)?)\.[ ]+([\s\S]*)/);
    if (m) {
      const players = m[2]
        .trim()
        .split(/,\s*/)
        .map((p) => p.trim())
        .filter(Boolean);
      standings.push({ place: m[1], players });
    }
  }

  return { name, standings };
}

function parseArchiveCSV(csv: string): ArchiveCup[] {
  const lines = csv.split("\n");
  const cups: ArchiveCup[] = [];

  for (const line of lines) {
    const cols = parseRow(line);
    const rawDate = cols[0]?.trim() ?? "";
    const bracketUrl = cols[1]?.trim() ?? "";
    const standingsText = cols[2]?.trim() ?? "";

    // Skip header row or empty rows
    if (!rawDate.match(/^\d{2}\.\d{2}\.\d{4}/) || !bracketUrl.startsWith("http")) continue;

    const { name, standings } = parseStandingsText(standingsText);
    cups.push({ name, rawDate, bracketUrl, standings });
  }

  // Newest first
  return cups.reverse();
}

export function useArchiveData() {
  const [cups, setCups] = useState<ArchiveCup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(ARCHIVE_URL)
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.text();
      })
      .then((csv) => {
        setCups(parseArchiveCSV(csv));
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, []);

  return { cups, loading, error };
}
