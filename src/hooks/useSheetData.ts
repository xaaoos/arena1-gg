import { useState, useEffect } from "react";

const SHEET_URL =
  "https://docs.google.com/spreadsheets/d/1Fbu4iDV6m7XxY98s78OjEEfQF0HelkJKFH-xeZBdvhA/export?format=csv&gid=0";

export interface SheetPlayer {
  name: string;
  elo: number;
  uncertain: boolean;
}

export interface SheetDivision {
  label: string;
  players: SheetPlayer[];
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

const isNum = (s: string | undefined) =>
  s !== undefined && s.trim() !== "" && !isNaN(Number(s.trim())) && Number(s.trim()) > 0;

function parseSheetData(csv: string): SheetDivision[] {
  const lines = csv.split("\n");
  const divisions: SheetDivision[] = [];
  let current: SheetDivision = { label: "Pro", players: [] };
  divisions.push(current);

  for (const line of lines) {
    const cols = parseRow(line);
    const nonEmpty = cols.filter((c) => c !== "");
    if (nonEmpty.length === 0) continue;

    const c0 = (cols[0] ?? "").toLowerCase();
    const isDivLabel = c0.startsWith("div") || c0.includes("non-pro");

    if (isDivLabel) {
      current = { label: cols[0].trim(), players: [] };
      divisions.push(current);
    }

    let name = "";
    let elo = 0;
    let uncertain = false;

    // Format 1 (first table): col[0]=name, col[1]=elo
    if (cols[0]?.trim() && !isDivLabel && isNum(cols[1])) {
      name = cols[0].trim();
      elo = Number(cols[1].trim());
    }
    // Format 2 (second table): col[0]=div_or_empty, col[1]=name, col[2]=elo
    else if (cols[1]?.trim() && isNum(cols[2])) {
      name = cols[1].trim();
      elo = Number(cols[2].trim());
      uncertain = cols[3]?.trim() === "?";
    }

    if (name && elo > 0) {
      current.players.push({ name, elo, uncertain });
    }
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
