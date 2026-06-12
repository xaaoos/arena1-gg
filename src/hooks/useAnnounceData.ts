import { useState, useEffect } from "react";
import { parseCSVFull } from "./useArchiveData";

// Таблица анонсов (Павел). Формат — блоки «ключ-значение» по вертикали:
// col[1]=ключ (название / Date / Elo limit / Mappool / Prize Pool / Brackets / инфо), col[2]=значение.
// Новый блок начинается со строки «название». Время в Date указывать MSK первым.
const ANNOUNCE_URL =
  "https://docs.google.com/spreadsheets/d/1X-11DKj8qvSFHlU4lacf0JHFDfR4qEN_zwmtSGwTr_E/export?format=csv&gid=0";

export interface CupAnnounce {
  name: string;
  rawDate: string; // показывается как есть
  date: Date | null; // для отсчёта и фильтра будущих
  link: string;
  details: string[];
}

const REGISTER_LINK = "https://discord.gg/dgPwNAph2j";

const MONTHS: Record<string, number> = {
  january: 0, february: 1, march: 2, april: 3, may: 4, june: 5,
  july: 6, august: 7, september: 8, october: 9, november: 10, december: 11,
  января: 0, февраля: 1, марта: 2, апреля: 3, мая: 4, июня: 5,
  июля: 6, августа: 7, сентября: 8, октября: 9, ноября: 10, декабря: 11,
};

// "14th June 2026, 16:00 MSK (15:00 CEST)" или "14.06.2026 16:00" → Date (время = MSK, UTC+3)
export function parseAnnounceDate(raw: string): Date | null {
  const time = raw.match(/(\d{1,2}):(\d{2})/);
  const h = time ? +time[1] : 0;
  const min = time ? +time[2] : 0;
  const dm = raw.match(/(\d{1,2})\.(\d{1,2})\.(\d{4})/);
  if (dm) return new Date(Date.UTC(+dm[3], +dm[2] - 1, +dm[1], h - 3, min));
  const em = raw.match(/(\d{1,2})(?:st|nd|rd|th)?\s+([A-Za-zа-яёА-ЯЁ]+),?\s+(\d{4})/);
  if (em) {
    const mon = MONTHS[em[2].toLowerCase()];
    if (mon === undefined) return null;
    return new Date(Date.UTC(+em[3], mon, +em[1], h - 3, min));
  }
  return null;
}

const isNameKey = (k: string) => /назв|name/i.test(k);
const isDateKey = (k: string) => /date|дата/i.test(k);

function blockToAnnounce(entries: [string, string][]): CupAnnounce | null {
  const name = entries.find(([k]) => isNameKey(k))?.[1] ?? "";
  const rawDate = entries.find(([k]) => isDateKey(k))?.[1] ?? "";
  if (!name || !rawDate) return null;

  const httpVal = entries.find(([, v]) => v.startsWith("http"))?.[1];
  const details = entries
    .filter(([k, v]) => !isNameKey(k) && !isDateKey(k) && v && !v.startsWith("http"))
    .map(([k, v]) => `${k.replace(/:\s*$/, "")}: ${v}`);

  return { name, rawDate, date: parseAnnounceDate(rawDate), link: httpVal ?? REGISTER_LINK, details };
}

function parseAnnounceCSV(csv: string): CupAnnounce[] {
  const rows = parseCSVFull(csv);
  const blocks: [string, string][][] = [];
  let cur: [string, string][] = [];

  for (const cols of rows) {
    const key = cols[1]?.trim() ?? "";
    const val = cols[2]?.trim() ?? "";
    if (!key && !val) continue;
    // строка «название» открывает новый блок
    if (key && isNameKey(key) && cur.some(([k]) => isNameKey(k))) {
      blocks.push(cur);
      cur = [];
    }
    if (key || val) cur.push([key, val]);
  }
  if (cur.length) blocks.push(cur);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return blocks
    .map(blockToAnnounce)
    .filter((a): a is CupAnnounce => a !== null && a.date !== null && a.date >= today)
    .sort((a, b) => a.date!.getTime() - b.date!.getTime());
}

export function useAnnounceData() {
  const [announces, setAnnounces] = useState<CupAnnounce[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(ANNOUNCE_URL)
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.text();
      })
      .then((csv) => {
        setAnnounces(parseAnnounceCSV(csv));
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, []);

  return { announces, loading, error };
}
