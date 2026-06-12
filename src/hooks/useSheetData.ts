import { useState, useEffect } from "react";

const SHEET_URL =
  "https://docs.google.com/spreadsheets/d/1Fbu4iDV6m7XxY98s78OjEEfQF0HelkJKFH-xeZBdvhA/export?format=csv&gid=0";

export interface SheetPlayer {
  name: string;
  elo: number;
  uncertain: boolean;
  delta: number | null; // изменение ELO с прошлого кубка, null если не указано
}

export interface SheetDivision {
  label: string;
  players: SheetPlayer[];
}

function parseRow(line: string): string[] {
  const cols: string[] = [];
  let cur = "";
  let inQuote = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
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

const isNum = (s: string | undefined) =>
  !!s && s.trim() !== "" && !isNaN(Number(s.trim())) && Number(s.trim()) > 0;

function parseSheetData(csv: string): SheetDivision[] {
  const lines = csv.split("\n");
  const divisions: SheetDivision[] = [];
  // CSV structure: col[0]=empty, col[1]=div_label, col[2]=player_name, col[3]=elo, col[4]=?
  let current: SheetDivision = { label: "Pro", players: [] };
  divisions.push(current);

  for (const line of lines) {
    const cols = parseRow(line);
    const divLabel = cols[1]?.trim() ?? "";
    const name = cols[2]?.trim() ?? "";
    const eloStr = cols[3]?.trim() ?? "";
    const col4 = cols[4]?.trim() ?? "";
    const col5 = cols[5]?.trim() ?? "";
    const uncertain = col4 === "?";
    // дельта ELO: "+25" / "-13" в col[4] или col[5] (col[4] может быть занята "?")
    const deltaStr = [col4, col5].find((s) => /^[+-]\d+$/.test(s));
    const delta = deltaStr ? Number(deltaStr) : null;

    if (!name || !isNum(eloStr)) continue;
    // skip header/meta rows
    if (name.toLowerCase().includes("рейтинг")) continue;

    if (divLabel) {
      current = { label: divLabel, players: [] };
      divisions.push(current);
    }

    current.players.push({ name, elo: Number(eloStr), uncertain, delta });
  }

  return divisions.filter((d) => d.players.length > 0);
}

export function useSheetData() {
  const [divisions, setDivisions] = useState<SheetDivision[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(SHEET_URL)
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.text();
      })
      .then((csv) => {
        setDivisions(parseSheetData(csv));
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, []);

  return { divisions, loading, error };
}
