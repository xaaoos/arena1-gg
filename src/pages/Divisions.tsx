import { useRef, useState, useEffect, type FC } from "react";
import { useLang } from "../hooks/useLang";
import { useIsMobile } from "../hooks/useIsMobile";
import { useSheetData } from "../hooks/useSheetData";
import { useParallax } from "../hooks/useParallax";
import { BODY_FONT } from "../components/UI";
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
  const heroRef = useParallax<HTMLDivElement>(0.3);
  const [activeDiv, setActiveDiv] = useState("");
  const [search, setSearch] = useState("");
  const divRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const query = search.trim().toLowerCase();
  const allPlayers = divisions.flatMap((d) =>
    d.players.map((p) => ({ ...p, division: d.label }))
  );
  // поиск не фильтрует таблицу — скроллит к первому совпадению и подсвечивает строку
  const found = query ? allPlayers.find((p) => p.name.toLowerCase().includes(query)) ?? null : null;
  const rowRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [match, setMatch] = useState<string | null>(null);

  useEffect(() => {
    if (!query || !found) {
      setMatch(null);
      return;
    }
    const id = setTimeout(() => {
      setMatch(found.name);
      rowRefs.current[found.name.toLowerCase()]?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 250);
    return () => clearTimeout(id);
  }, [query, found?.name, divisions.length]);

  useEffect(() => {
    if (divisions.length > 0 && !activeDiv) setActiveDiv(divisions[0].label);
  }, [divisions]);

  const scrollToDiv = (label: string) => {
    divRefs.current[label]?.scrollIntoView({ behavior: "smooth", block: "start" });
    setActiveDiv(label);
  };

  // колонки таблицы: # | игрок | ELO | ± (границы колонок сквозные, поэтому grid)
  const TCOLS = mob ? "44px 1fr 84px 48px" : "54px 1fr 100px 60px";
  const padV = mob ? 8 : 10;

  // Compute overall start rank per division
  let _r = 0;
  const divStartRank = divisions.map(d => { const s = _r; _r += d.players.length; return s; });

  return (
    <div>

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
          background: `radial-gradient(ellipse at 50% 20%,rgba(var(--glow-rgb),0.06) 0%,transparent 60%)`,
        }}
      >
        <div ref={heroRef} style={{ position: "relative", zIndex: 1 }}>
          <div style={{ fontSize: mob ? 10 : 12, letterSpacing: mob ? 3 : 5, color: ACS, marginBottom: 20, fontWeight: 600 }}>{t.tag}</div>
          <h1 style={{ fontSize: "clamp(20px,4vw,44px)", fontWeight: 900, margin: 0, lineHeight: 1.1, letterSpacing: mob ? 3 : 5, color: C.heading, fontFamily: "'Xolonium','Tektur',sans-serif" }}>
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
                  fontSize: 16,
                  padding: mob ? "10px 14px" : "12px 18px",
                  outline: "none",
                  width: mob ? 220 : 280,
                  caretColor: ACS,
                }}
              />
              {query && !found && (
                <div style={{ fontFamily: BODY_FONT, fontSize: 11, color: C.muted }}>{t.notFound}</div>
              )}
              {/* Прыжок к дивизиону — кнопки; Pro и Semi-Pro не нужны (видны сразу), "non-pro" в подписи опускаем */}
              {!query && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: mob ? 8 : 10, justifyContent: "center", maxWidth: mob ? 300 : 420 }}>
                  {divisions
                    .filter((d) => !/^(pro|semi[- ]?pro)$/i.test(d.label.trim()))
                    .map((d) => {
                      const active = activeDiv === d.label;
                      return (
                        <button
                          key={d.label}
                          onClick={() => scrollToDiv(d.label)}
                          style={{
                            background: active ? ACS : C.inputBg,
                            color: active ? C.accentContrast : C.muted,
                            border: `1px solid ${active ? ACS : C.border}`,
                            fontFamily: "'Xolonium','Tektur',monospace",
                            fontSize: mob ? 10 : 11,
                            fontWeight: 700,
                            letterSpacing: 1.5,
                            textTransform: "uppercase",
                            padding: mob ? "8px 14px" : "9px 18px",
                            cursor: "pointer",
                            transition: "all 0.2s",
                          }}
                        >
                          {d.label.replace(/non-?pro\s*/i, "").trim()}
                        </button>
                      );
                    })}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Table */}
      <section style={{ padding: mob ? "0 10px 80px" : "0 20px 120px", maxWidth: 520, margin: "0 auto" }}>
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
          <div style={{ position: "relative", background: C.bg, border: `1px solid ${C.accentBorder}` }}>
            {/* углы рамки — в стиле блока анонса */}
            {[{ top: -1, left: -1, borderWidth: "2px 0 0 2px" }, { top: -1, right: -1, borderWidth: "2px 2px 0 0" }, { bottom: -1, left: -1, borderWidth: "0 0 2px 2px" }, { bottom: -1, right: -1, borderWidth: "0 2px 2px 0" }].map((p, i) => (
              <div key={i} style={{ position: "absolute", width: 14, height: 14, borderStyle: "solid", borderColor: ACS, zIndex: 99, pointerEvents: "none", ...p }} />
            ))}

            {/* Header */}
            <div style={{
              display: "grid", gridTemplateColumns: TCOLS,
              borderBottom: `1px solid ${C.accentBorder}`,
              // непрозрачный фон: sticky-плашка, строки не должны просвечивать
              background: `linear-gradient(rgba(var(--glow-rgb),0.03),rgba(var(--glow-rgb),0.03)) ${C.bg}`,
              position: "sticky", top: 80, zIndex: 98,
            }}>
              <span style={{ padding: `${padV + 2}px 0`, textAlign: "center", borderRight: `1px solid ${C.borderLight}`, fontSize: 10, letterSpacing: 1.5, color: C.muted, fontWeight: 700 }}>#</span>
              <span style={{ padding: `${padV + 2}px 12px`, borderRight: `1px solid ${C.borderLight}`, fontSize: 10, letterSpacing: 1.5, color: C.muted, fontWeight: 700, textTransform: "uppercase" }}>{t.cols.player}</span>
              <span style={{ padding: `${padV + 2}px 12px ${padV + 2}px 0`, textAlign: "right", borderRight: `1px solid ${C.borderLight}`, fontSize: 10, letterSpacing: 1.5, color: C.muted, fontWeight: 700, textTransform: "uppercase" }}>{t.cols.elo}</span>
              <span style={{ padding: `${padV + 2}px 0`, textAlign: "center", fontSize: 10, letterSpacing: 1.5, color: C.muted, fontWeight: 700 }}>±</span>
            </div>

            {/* Grouped by division */}
            {divisions.map((div, di) => (
              <div key={div.label} ref={(el) => { divRefs.current[div.label] = el; }} style={{ scrollMarginTop: mob ? 112 : 116 }}>
                {/* Division header row */}
                <div style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: mob ? "10px 16px" : "12px 24px",
                  background: C.bgCard,
                  borderTop: di > 0 ? `2px solid ${C.border}` : "none",
                  borderBottom: `1px solid ${C.border}`,
                }}>
                  <span style={{ fontSize: mob ? 10 : 11, fontWeight: 700, letterSpacing: 2, color: ACS, textTransform: "uppercase", fontFamily: "'Xolonium','Tektur',sans-serif" }}>
                    {div.label}
                  </span>
                  <span style={{ fontSize: 11, color: C.muted, fontFamily: BODY_FONT }}>
                    {div.players[div.players.length - 1]?.elo}–{div.players[0]?.elo} ELO · {div.players.length} игроков
                  </span>
                </div>
                {div.players.map((p, pi) => {
                  const rank = p.rank ?? divStartRank[di] + pi + 1;
                  // "?" в таблице = неуверенный рейтинг: вся строка серая
                  const isTop3 = rank <= 3 && !p.uncertain;
                  const isMatch = match != null && p.name === match;
                  return (
                    <div
                      key={pi}
                      ref={(el) => { rowRefs.current[p.name.toLowerCase()] = el; }}
                      style={{
                        display: "grid", gridTemplateColumns: TCOLS, alignItems: "stretch",
                        borderBottom: `1px solid ${C.borderLight}`,
                        background: isMatch || isTop3 ? C.accentSubtle : "transparent",
                        boxShadow: isMatch ? `inset 0 0 0 1px ${ACS}` : "none",
                        scrollMarginTop: mob ? 150 : 160,
                      }}
                    >
                      <span style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: `${padV}px 0`, borderRight: `1px solid ${C.borderLight}`, fontFamily: BODY_FONT, fontSize: mob ? 10 : 11, color: isTop3 ? ACS : C.muted, fontWeight: isTop3 ? 700 : 400 }}>
                        {rank}
                      </span>
                      <div style={{ padding: `${padV}px 12px`, borderRight: `1px solid ${C.borderLight}`, fontFamily: BODY_FONT, fontSize: mob ? 12 : 13, color: p.uncertain ? C.muted : isTop3 ? C.heading : C.body, fontWeight: isTop3 ? 700 : 400, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {p.name}
                      </div>
                      <span style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", padding: `${padV}px 12px ${padV}px 0`, borderRight: `1px solid ${C.borderLight}`, fontFamily: BODY_FONT, fontSize: mob ? 12 : 13, color: p.uncertain ? C.muted : ACS, fontWeight: 600, letterSpacing: 1 }}>
                        {p.elo}
                      </span>
                      <span style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: `${padV}px 0`, fontFamily: BODY_FONT, fontSize: mob ? 10 : 11, fontWeight: 700, color: p.uncertain ? C.muted : p.delta != null && p.delta < 0 ? "#ff3e3e" : ACS }}>
                        {p.delta != null && p.delta !== 0 ? (p.delta > 0 ? `▲${p.delta}` : `▼${-p.delta}`) : p.uncertain ? "?" : ""}
                      </span>
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
