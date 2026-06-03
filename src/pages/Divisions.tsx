import { useRef, useState, useEffect, type FC } from "react";
import { useLang } from "../hooks/useLang";
import { useIsMobile } from "../hooks/useIsMobile";
import { useSheetData } from "../hooks/useSheetData";
import { ScanLine, BODY_FONT } from "../components/UI";
import { C } from "../theme";

const AC = "#4ade80";
const ACS = C.accent; // solid accent — uses CSS var, dark in light mode

const T = {
  ru: {
    tag: "N O N - P R O",
    h1: "ДИВИЗИОНЫ",
    h2: "& ИГРОКИ",
    loading: "Загрузка...",
    error: "Не удалось загрузить данные. Попробуй позже.",
    cols: { div: "Дивизион", player: "Игрок", elo: "ELO" },
    search: "Поиск по нику...",
    notFound: "Никнейм не найден",
    footer: "ARENA 1 DIVISIONS · NON-PRO DUEL CUPS · 2026",
  },
  en: {
    tag: "N O N - P R O",
    h1: "DIVISIONS",
    h2: "& PLAYERS",
    loading: "Loading...",
    error: "Failed to load data. Please try again later.",
    cols: { div: "Division", player: "Player", elo: "ELO" },
    search: "Search by nickname...",
    notFound: "Nickname not found",
    footer: "ARENA 1 DIVISIONS · NON-PRO DUEL CUPS · 2026",
  },
};

const Divisions: FC = () => {
  const { lang } = useLang();
  const mob = useIsMobile();
  const t = T[lang];
  const { divisions, loading, error } = useSheetData();
  const [activeDiv, setActiveDiv] = useState("");
  const [search, setSearch] = useState("");
  const divRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const query = search.trim().toLowerCase();
  const allPlayers = divisions.flatMap((d) =>
    d.players.map((p) => ({ ...p, division: d.label }))
  );
  const filtered = query
    ? allPlayers.filter((p) => p.name.toLowerCase().includes(query))
    : null;

  useEffect(() => {
    if (divisions.length > 0 && !activeDiv) setActiveDiv(divisions[0].label);
  }, [divisions]);

  const scrollToDiv = (label: string) => {
    divRefs.current[label]?.scrollIntoView({ behavior: "smooth", block: "start" });
    setActiveDiv(label);
  };

  const ROW_COLS = "1fr";
  // kept for search results (div | player | elo)
  const COLS = mob ? "120px 1fr 52px" : "140px 1fr 80px";

  // Compute overall start rank per division
  let _r = 0;
  const divStartRank = divisions.map(d => { const s = _r; _r += d.players.length; return s; });

  return (
    <div style={{ overflowX: "hidden" }}>
      <ScanLine />

      {/* Hero */}
      <section
        style={{
          minHeight: "35vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
          padding: mob ? "160px 16px 60px" : "180px 20px 80px",
          textAlign: "center",
          background: `radial-gradient(ellipse at 50% 20%,rgba(74,222,128,0.06) 0%,transparent 60%)`,
        }}
      >
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", backgroundImage: `linear-gradient(rgba(74,222,128,var(--grid-line)) 1px,transparent 1px),linear-gradient(90deg,rgba(74,222,128,var(--grid-line)) 1px,transparent 1px)`, backgroundSize: "60px 60px" }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ fontSize: mob ? 9 : 11, letterSpacing: mob ? 3 : 6, color: ACS, marginBottom: 20, fontWeight: 600 }}>{t.tag}</div>
          <h1 style={{ fontSize: "clamp(20px,4vw,44px)", fontWeight: 900, margin: 0, lineHeight: 1.1, letterSpacing: mob ? 3 : 5, color: C.heading, fontFamily: "'Orbitron', sans-serif" }}>
            {t.h1} <span style={{ color: ACS }}>{t.h2}</span>
          </h1>
          {!loading && !error && divisions.length > 0 && (
            <div style={{ marginTop: mob ? 28 : 36, display: "flex", flexDirection: "column", gap: 12, alignItems: "center" }}>
              {/* Search */}
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t.search}
                style={{
                  background: C.inputBg,
                  border: `1px solid ${C.border}`,
                  color: C.heading,
                  fontFamily: BODY_FONT,
                  fontSize: mob ? 13 : 14,
                  padding: mob ? "10px 14px" : "12px 18px",
                  outline: "none",
                  width: mob ? 220 : 280,
                  caretColor: AC,
                }}
              />
              {/* Jump to division — hidden while searching */}
              {!query && (
                <select
                  value={activeDiv}
                  onChange={(e) => scrollToDiv(e.target.value)}
                  style={{
                    background: C.inputBg,
                    border: `1px solid ${C.border}`,
                    color: C.muted,
                    fontFamily: "'Orbitron',monospace",
                    fontSize: mob ? 9 : 10,
                    fontWeight: 700,
                    letterSpacing: 2,
                    textTransform: "uppercase",
                    padding: mob ? "8px 32px 8px 12px" : "10px 36px 10px 16px",
                    cursor: "pointer",
                    outline: "none",
                    width: mob ? 220 : 280,
                  }}
                >
                  {divisions.map((d) => (
                    <option key={d.label} value={d.label}>{d.label}</option>
                  ))}
                </select>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Table */}
      <section style={{ padding: mob ? "0 0 80px" : "0 20px 120px", maxWidth: 520, margin: "0 auto" }}>
        {loading && (
          <div style={{ textAlign: "center", color: C.muted, padding: "80px 0", fontFamily: BODY_FONT, fontSize: 13, letterSpacing: 2 }}>
            {t.loading}
          </div>
        )}
        {error && (
          <div style={{ textAlign: "center", color: "#ff3e3e", padding: "80px 0", fontFamily: BODY_FONT, fontSize: 13 }}>
            {t.error}
          </div>
        )}

        {!loading && !error && (
          <div>
            {/* Header */}
            <div style={{
              display: "grid", gridTemplateColumns: ROW_COLS,
              padding: mob ? "10px 16px" : "12px 24px",
              borderBottom: `1px solid ${AC}33`,
              background: `${AC}08`,
              position: "sticky", top: 80, zIndex: 98,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: 9, letterSpacing: 3, color: C.muted, fontWeight: 700, textTransform: "uppercase" }}>{t.cols.player}</span>
                <span style={{ fontSize: 9, letterSpacing: 3, color: C.muted, fontWeight: 700, textTransform: "uppercase" }}>{t.cols.elo}</span>
              </div>
            </div>

            {/* Search results */}
            {filtered !== null && (
              filtered.length === 0
                ? <div style={{ textAlign: "center", color: C.muted, padding: "40px 0", fontFamily: BODY_FONT, fontSize: 13 }}>{t.notFound}</div>
                : filtered.map((p, i) => (
                  <div key={i} style={{ display: "grid", gridTemplateColumns: COLS, padding: mob ? "9px 16px" : "11px 24px", borderBottom: `1px solid ${C.borderLight}`, alignItems: "center" }}>
                    <div style={{ fontSize: mob ? 9 : 10, fontWeight: 700, letterSpacing: mob ? 1 : 2, color: ACS, textTransform: "uppercase", fontFamily: "'Orbitron',sans-serif", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", paddingRight: 8 }}>
                      {p.division}
                    </div>
                    <div style={{ fontFamily: BODY_FONT, fontSize: mob ? 12 : 13, color: C.heading, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {p.name}
                    </div>
                    <div style={{ fontFamily: BODY_FONT, fontSize: mob ? 12 : 13, color: ACS, fontWeight: 600, letterSpacing: 1, textAlign: "right" }}>
                      {p.elo}
                    </div>
                  </div>
                ))
            )}

            {/* Grouped by division */}
            {filtered === null && divisions.map((div, di) => (
              <div key={div.label} ref={(el) => { divRefs.current[div.label] = el; }} style={{ scrollMarginTop: mob ? 80 : 84 }}>
                {/* Division header row */}
                <div style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: mob ? "10px 16px" : "12px 24px",
                  background: C.bgCard,
                  borderTop: di > 0 ? `2px solid ${C.border}` : "none",
                  borderBottom: `1px solid ${C.border}`,
                  marginTop: di > 0 ? 8 : 0,
                }}>
                  <span style={{ fontSize: mob ? 9 : 10, fontWeight: 700, letterSpacing: 3, color: ACS, textTransform: "uppercase", fontFamily: "'Orbitron',sans-serif" }}>
                    {div.label}
                  </span>
                  <span style={{ fontSize: 10, color: C.muted, fontFamily: BODY_FONT }}>
                    {div.players[div.players.length - 1]?.elo}–{div.players[0]?.elo} ELO · {div.players.length} игроков
                  </span>
                </div>
                {div.players.map((p, pi) => {
                  const rank = divStartRank[di] + pi + 1;
                  const isTop3 = rank <= 3;
                  const medal = rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : null;
                  return (
                    <div key={pi} style={{ padding: mob ? "8px 16px" : "10px 24px", borderBottom: `1px solid ${C.borderLight}`, background: isTop3 ? C.accentSubtle : "transparent" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, overflow: "hidden" }}>
                        <div style={{ fontFamily: BODY_FONT, fontSize: mob ? 12 : 13, color: isTop3 ? C.heading : C.body, fontWeight: isTop3 ? 700 : 400, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {p.name}
                        </div>
                        <div style={{ fontFamily: BODY_FONT, fontSize: mob ? 12 : 13, color: ACS, fontWeight: 600, letterSpacing: 1, flexShrink: 0 }}>
                          {p.elo}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        )}
      </section>

      <footer style={{ padding: mob ? "40px 16px" : "60px 20px", textAlign: "center", borderTop: `1px solid ${C.borderLight}` }}>
        <div style={{ fontSize: 16, fontWeight: 900, color: C.footer, letterSpacing: 4 }}>ARENA <span style={{ color: ACS }}>1</span></div>
        <div style={{ fontSize: 10, color: C.footer, letterSpacing: 3, marginTop: 8 }}>{t.footer}</div>
      </footer>
    </div>
  );
};

export default Divisions;
