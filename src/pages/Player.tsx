import { type FC } from "react";
import { useParams, Link } from "react-router-dom";
import { useLang } from "../hooks/useLang";
import { useIsMobile } from "../hooks/useIsMobile";
import { useSheetData } from "../hooks/useSheetData";
import { useArchiveData, formatArchiveDate } from "../hooks/useArchiveData";
import { BODY_FONT } from "../components/UI";
import { C } from "../theme";

const AC = "#4ade80";
const ACS = C.accent;
const PLACE_C: Record<string, string> = { "1": C.place1, "2": C.place2, "3": C.place3 };

const placeLabel = (place: string) =>
  place === "1" ? "🥇" : place === "2" ? "🥈" : place === "3" ? "🥉" : `#${place}`;

// для статистики: первое число из "5-6" → 5
const placeNum = (place: string) => parseInt(place, 10);

const T = {
  ru: {
    back: "← К дивизионам",
    notInDiv: "Нет в текущем рейтинге",
    division: "Дивизион",
    rank: "Место",
    cups: "Турниров",
    wins: "Побед",
    podiums: "Топ-3",
    best: "Лучший",
    history: "История выступлений",
    noHistory: "Пока нет сыгранных турниров",
    results: "Результаты",
    bracket: "сетка",
    notFound: "Игрок не найден",
    notFoundSub: "Нет ни в рейтинге, ни в архиве турниров",
    loading: "Загрузка...",
  },
  en: {
    back: "← To divisions",
    notInDiv: "Not in current rating",
    division: "Division",
    rank: "Rank",
    cups: "Tournaments",
    wins: "Wins",
    podiums: "Top-3",
    best: "Best",
    history: "Match history",
    noHistory: "No tournaments played yet",
    results: "Results",
    bracket: "bracket",
    notFound: "Player not found",
    notFoundSub: "Not in the rating nor in the tournament archive",
    loading: "Loading...",
  },
};

const Player: FC = () => {
  const { nick = "" } = useParams();
  const decoded = decodeURIComponent(nick);
  const key = decoded.toLowerCase();
  const { lang } = useLang();
  const mob = useIsMobile();
  const t = T[lang];
  const { divisions, loading: divLoading } = useSheetData();
  const { cups, loading: cupsLoading } = useArchiveData();

  const loading = divLoading || cupsLoading;

  // запись в дивизионе + общее место (fallback по позиции)
  let overall = 0;
  let sheet: { elo: number; delta: number | null; uncertain: boolean; rank: number; division: string } | null = null;
  for (const d of divisions) {
    for (const p of d.players) {
      overall += 1;
      if (p.name.toLowerCase() === key && !sheet) {
        sheet = { elo: p.elo, delta: p.delta, uncertain: p.uncertain, rank: p.rank ?? overall, division: d.label };
      }
    }
  }

  // история по всем кубкам (ник может стоять в "1. a, b")
  const history = cups
    .map((cup) => {
      const st = cup.standings.find((s) => s.players.some((pl) => pl.toLowerCase() === key));
      return st ? { cup, place: st.place } : null;
    })
    .filter((x): x is { cup: typeof cups[number]; place: string } => x !== null);

  const wins = history.filter((h) => h.place === "1").length;
  const podiums = history.filter((h) => ["1", "2", "3"].includes(h.place)).length;
  const best = history.length
    ? history.reduce((m, h) => Math.min(m, placeNum(h.place)), Infinity)
    : null;

  const displayName =
    divisions.flatMap((d) => d.players).find((p) => p.name.toLowerCase() === key)?.name ??
    history.find((h) => h.cup.standings.some((s) => s.players.some((pl) => pl.toLowerCase() === key)))
      ?.cup.standings.flatMap((s) => s.players).find((pl) => pl.toLowerCase() === key) ??
    decoded;

  const exists = sheet !== null || history.length > 0;

  return (
    <div style={{ overflowX: "hidden", minHeight: "100vh" }}>
      <section style={{ maxWidth: 720, margin: "0 auto", padding: mob ? "110px 14px 80px" : "140px 20px 120px" }}>
        <Link to="/divisions" style={{ fontFamily: BODY_FONT, fontSize: mob ? 11 : 12, color: C.muted, textDecoration: "none", letterSpacing: 1 }}>
          {t.back}
        </Link>

        {loading && (
          <div style={{ textAlign: "center", color: C.muted, padding: "80px 0", fontFamily: BODY_FONT, fontSize: 13, letterSpacing: 2 }}>{t.loading}</div>
        )}

        {!loading && !exists && (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <div style={{ fontSize: mob ? 22 : 28, fontWeight: 900, color: C.heading, fontFamily: "'Xolonium','Tektur',sans-serif" }}>{decoded}</div>
            <div style={{ marginTop: 12, color: ACS, fontFamily: BODY_FONT, fontSize: 14, fontWeight: 700 }}>{t.notFound}</div>
            <div style={{ marginTop: 6, color: C.muted, fontFamily: BODY_FONT, fontSize: 12 }}>{t.notFoundSub}</div>
          </div>
        )}

        {!loading && exists && (
          <>
            {/* Хедер игрока */}
            <div style={{ position: "relative", marginTop: 18, border: `1px solid ${C.accentBorder}`, background: C.bg, padding: mob ? "26px 16px" : "36px 32px" }}>
              {[{ top: -1, left: -1, borderWidth: "2px 0 0 2px" }, { top: -1, right: -1, borderWidth: "2px 2px 0 0" }, { bottom: -1, left: -1, borderWidth: "0 0 2px 2px" }, { bottom: -1, right: -1, borderWidth: "0 2px 2px 0" }].map((p, i) => (
                <div key={i} style={{ position: "absolute", width: 14, height: 14, borderStyle: "solid", borderColor: ACS, pointerEvents: "none", ...p }} />
              ))}

              <div style={{ fontSize: mob ? 9 : 10, letterSpacing: 3, color: ACS, fontWeight: 700, textTransform: "uppercase", fontFamily: "'Xolonium','Tektur',sans-serif" }}>
                {sheet ? sheet.division : "ARENA 1"}
              </div>
              <h1 style={{ fontSize: "clamp(26px,6vw,48px)", fontWeight: 900, color: C.heading, margin: "10px 0 0", lineHeight: 1.05, fontFamily: "'Xolonium','Tektur',sans-serif", wordBreak: "break-word" }}>
                {displayName}
              </h1>

              {/* ELO / место */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: mob ? 18 : 28, marginTop: mob ? 20 : 26 }}>
                {sheet ? (
                  <>
                    <Stat label="ELO" mob={mob} value={
                      <span>
                        <span style={{ color: sheet.uncertain ? C.muted : ACS }}>{sheet.elo}</span>
                        {sheet.delta != null && sheet.delta !== 0 && (
                          <span style={{ fontSize: mob ? 11 : 13, marginLeft: 8, color: sheet.delta > 0 ? ACS : "#ff3e3e" }}>
                            {sheet.delta > 0 ? `▲${sheet.delta}` : `▼${-sheet.delta}`}
                          </span>
                        )}
                        {sheet.uncertain && <span style={{ fontSize: mob ? 11 : 13, marginLeft: 8, color: C.muted }}>?</span>}
                      </span>
                    } />
                    <Stat label={t.rank} value={`#${sheet.rank}`} mob={mob} />
                  </>
                ) : (
                  <div style={{ fontFamily: BODY_FONT, fontSize: 12, color: C.muted }}>{t.notInDiv}</div>
                )}
              </div>
            </div>

            {/* Статистика по турнирам */}
            {history.length > 0 && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: mob ? 8 : 12, marginTop: mob ? 12 : 16 }}>
                <Box label={t.cups} value={String(history.length)} mob={mob} />
                <Box label={t.wins} value={String(wins)} mob={mob} color={wins > 0 ? C.place1 : undefined} />
                <Box label={t.podiums} value={String(podiums)} mob={mob} />
                <Box label={t.best} value={best ? placeLabel(String(best)) : "—"} mob={mob} />
              </div>
            )}

            {/* История */}
            <div style={{ marginTop: mob ? 28 : 40 }}>
              <div style={{ fontSize: mob ? 10 : 11, letterSpacing: 2, color: C.muted, fontWeight: 700, textTransform: "uppercase", marginBottom: 12 }}>{t.history}</div>
              {history.length === 0 ? (
                <div style={{ fontFamily: BODY_FONT, fontSize: 13, color: C.muted, padding: "20px 0" }}>{t.noHistory}</div>
              ) : (
                history.map((h, i) => (
                  <div key={i} style={{
                    display: "flex", alignItems: "center", gap: mob ? 10 : 16,
                    padding: mob ? "12px 12px" : "14px 18px",
                    background: C.bgCard, border: `1px solid ${C.border}`,
                    borderTop: i > 0 ? "none" : `1px solid ${C.border}`,
                  }}>
                    <div style={{ fontSize: mob ? 14 : 16, fontWeight: 900, color: PLACE_C[h.place] ?? C.heading, fontFamily: "'Xolonium','Tektur',monospace", minWidth: mob ? 36 : 44, flexShrink: 0 }}>
                      {placeLabel(h.place)}
                    </div>
                    <div style={{ overflow: "hidden", flex: 1 }}>
                      <div style={{ fontSize: mob ? 11 : 12, fontWeight: 800, color: C.heading, letterSpacing: 0.5, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{h.cup.name}</div>
                      <div style={{ fontFamily: BODY_FONT, fontSize: mob ? 10 : 11, color: C.muted, marginTop: 3 }}>{formatArchiveDate(h.cup.rawDate, lang)}</div>
                    </div>
                    <a href={h.cup.bracketUrl} target="_blank" rel="noopener noreferrer" style={{ fontFamily: BODY_FONT, fontSize: mob ? 10 : 11, color: C.muted, textDecoration: "none", padding: mob ? "6px 8px" : "6px 12px", border: `1px solid ${C.border}`, whiteSpace: "nowrap", flexShrink: 0 }}>
                      {t.bracket} ↗
                    </a>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </section>
    </div>
  );
};

const Stat: FC<{ label: string; value: React.ReactNode; mob: boolean }> = ({ label, value, mob }) => (
  <div>
    <div style={{ fontSize: mob ? 9 : 10, letterSpacing: 2, color: C.muted, fontWeight: 700, textTransform: "uppercase", marginBottom: 6 }}>{label}</div>
    <div style={{ fontSize: mob ? 24 : 32, fontWeight: 900, color: C.heading, fontFamily: "'Xolonium','Tektur',monospace", lineHeight: 1 }}>{value}</div>
  </div>
);

const Box: FC<{ label: string; value: string; mob: boolean; color?: string }> = ({ label, value, mob, color }) => (
  <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, padding: mob ? "12px 6px" : "16px 10px", textAlign: "center" }}>
    <div style={{ fontSize: mob ? 18 : 24, fontWeight: 900, color: color ?? C.heading, fontFamily: "'Xolonium','Tektur',monospace", lineHeight: 1 }}>{value}</div>
    <div style={{ fontSize: mob ? 8 : 9, letterSpacing: 1.5, color: C.muted, fontWeight: 700, textTransform: "uppercase", marginTop: 8 }}>{label}</div>
  </div>
);

export default Player;
