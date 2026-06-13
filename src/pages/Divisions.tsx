import { useRef, useState, useEffect, type FC } from "react";
import { Link } from "react-router-dom";
import { useLang } from "../hooks/useLang";
import { useIsMobile } from "../hooks/useIsMobile";
import { useSheetData } from "../hooks/useSheetData";
import { Seo } from "../components/Seo";
import { BODY_FONT } from "../components/UI";
import { C } from "../theme";

const AC = "#4ade80";
const ACS = C.accent; // solid accent — uses CSS var, dark in light mode

// Pro и Semi-Pro скрыты по умолчанию, показываются одной кнопкой
const isProGroup = (label: string) => /^(pro|semi[- ]?pro)$/i.test(label.trim());

const T = {
  ru: {
    tag: "QUAKE LIVE",
    h1: "Дивизионы",
    h2: "& игроки",
    loading: "Загрузка...",
    error: "Не удалось загрузить данные. Попробуй позже.",
    cols: { div: "Дивизион", player: "Игрок", elo: "ELO" },
    search: "Поиск по нику...",
    notFound: "Никнейм не найден",
    footer: "ARENA 1 DIVISIONS · NON-PRO DUEL CUPS · 2026",
  },
  en: {
    tag: "QUAKE LIVE",
    h1: "Divisions",
    h2: "& players",
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
  const [showPro, setShowPro] = useState(false);
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
    // найденный игрок в скрытой Pro-части — раскрываем её
    if (isProGroup(found.division)) setShowPro(true);
    const id = setTimeout(() => {
      setMatch(found.name);
      rowRefs.current[found.name.toLowerCase()]?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 250);
    return () => clearTimeout(id);
  }, [query, found?.name, divisions.length]);

  const scrollToDiv = (label: string) => {
    divRefs.current[label]?.scrollIntoView({ behavior: "smooth", block: "start" });
    setActiveDiv(label);
  };

  const togglePro = () => {
    const next = !showPro;
    setShowPro(next);
    if (next) {
      const proLabel = divisions.find((d) => isProGroup(d.label))?.label;
      if (proLabel) setTimeout(() => divRefs.current[proLabel]?.scrollIntoView({ behavior: "smooth", block: "start" }), 60);
    }
  };

  // колонки таблицы: # | игрок | ELO | ± (границы колонок сквозные, поэтому grid)
  // # и ± одной ширины; ELO — впритык под 4 цифры
  const TCOLS = mob ? "48px 1fr 52px 48px" : "56px 1fr 62px 56px";
  const padV = mob ? 8 : 10;

  // Сквозная нумерация по ОТОБРАЖАЕМЫМ дивизионам:
  // Pro/Semi-Pro скрыты → счёт с 1 от DIV 1; раскрыты → с 1 от Pro.
  const startRank: Record<string, number> = {};
  let _r = 0;
  divisions.forEach((d) => {
    if (!showPro && isProGroup(d.label)) return; // скрытые не влияют на нумерацию
    startRank[d.label] = _r;
    _r += d.players.length;
  });

  return (
    <div>
      <Seo
        path="/divisions"
        title="Дивизионы и игроки"
        description="Рейтинг игроков Arena 1 по дивизионам: ELO, места, динамика. Pro, Semi-Pro и Non-Pro дивизионы Quake-сообщества."
      />

      {/* Hero */}
      <section
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
          padding: mob ? "92px 16px 12px" : "120px 20px 24px",
          textAlign: "center",
          background: `radial-gradient(ellipse at 50% 20%,rgba(var(--glow-rgb),0.06) 0%,transparent 60%)`,
        }}
      >
        <div style={{ position: "relative", zIndex: 1 }}>
          <img src="/quake-live-logo.png" alt="Quake Live" style={{ display: "block", height: mob ? 44 : 52, width: "auto", margin: "0 auto 14px" }} />
          <h1 style={{ fontSize: "clamp(24px,4.5vw,42px)", fontWeight: 900, margin: 0, lineHeight: 1.05, letterSpacing: -0.5, color: C.heading }}>
            {t.h1} <span style={{ color: ACS }}>{t.h2}</span>
          </h1>
        </div>
      </section>

      {/* Поиск + кнопки дивизионов — sticky-плашка по ширине контента, не полоса на весь экран */}
      <div style={{ position: "sticky", top: 80, zIndex: 99, display: "flex", justifyContent: "center", pointerEvents: "none" }}>
        <div style={{
          pointerEvents: "auto",
          display: "flex", flexDirection: "column", alignItems: "center",
          gap: 8,
          background: "transparent",
          padding: mob ? "6px 8px" : "6px 12px",
          maxWidth: "calc(100vw - 8px)",
        }}>
          {!loading && !error && divisions.length > 0 && (
            <div style={{ display: "flex", flexWrap: mob ? "wrap" : "nowrap", gap: 6, justifyContent: "center", maxWidth: mob ? 372 : "none" }}>
              {/* одна кнопка раскрывает Pro и Semi-Pro части таблицы */}
              {divisions.some((d) => isProGroup(d.label)) && (
                <button
                  onClick={togglePro}
                  style={{
                    padding: mob ? "6px 8px" : "7px 10px",
                    background: showPro ? ACS : C.inputBg,
                    color: showPro ? C.accentContrast : C.muted,
                    border: `1px solid ${showPro ? ACS : C.border}`,
                    fontFamily: "'Xolonium','Tektur',monospace",
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: 0.5,
                    textTransform: "uppercase",
                    textAlign: "center",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    flexShrink: 0,
                  }}
                >
                  PRO / SEMI-PRO
                </button>
              )}
              {divisions
                .filter((d) => !isProGroup(d.label))
                .map((d) => {
                  const active = activeDiv === d.label;
                  return (
                    <button
                      key={d.label}
                      onClick={() => scrollToDiv(d.label)}
                      style={{
                        minWidth: mob ? 54 : 58,
                        padding: mob ? "6px 8px" : "7px 10px",
                        background: active ? ACS : C.inputBg,
                        color: active ? C.accentContrast : C.muted,
                        border: `1px solid ${active ? ACS : C.border}`,
                        fontFamily: "'Xolonium','Tektur',monospace",
                        fontSize: 10,
                        fontWeight: 700,
                        letterSpacing: 0.5,
                        textTransform: "uppercase",
                        textAlign: "center",
                        cursor: "pointer",
                        transition: "all 0.2s",
                        flexShrink: 0,
                      }}
                      onMouseEnter={(e) => { if (!active) { e.currentTarget.style.borderColor = ACS; e.currentTarget.style.color = ACS; e.currentTarget.style.boxShadow = "0 0 14px rgba(var(--glow-rgb),0.4)"; } }}
                      onMouseLeave={(e) => { if (!active) { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted; e.currentTarget.style.boxShadow = "none"; } }}
                    >
                      {d.label.replace(/non-?pro\s*/i, "").trim()}
                    </button>
                  );
                })}
            </div>
          )}
          {/* поиск — под кнопками */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
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
                padding: "4px 12px",
                outline: "none",
                width: mob ? 200 : 240,
                caretColor: ACS,
              }}
            />
            {query && !found && (
              <span style={{ fontFamily: BODY_FONT, fontSize: 11, color: C.muted, whiteSpace: "nowrap" }}>{t.notFound}</span>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <section style={{ padding: mob ? "28px 10px 80px" : "36px 20px 120px", maxWidth: 520, margin: "0 auto" }}>
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
          <div style={{ position: "relative", background: C.bg, border: `1px solid ${C.accentBorder}`, display: "flex", flexDirection: "column", maxHeight: mob ? "calc(100vh - 260px)" : "calc(100vh - 230px)", overflow: "hidden" }}>
            {/* углы рамки — в стиле блока анонса */}
            {[{ top: -1, left: -1, borderWidth: "2px 0 0 2px" }, { top: -1, right: -1, borderWidth: "2px 2px 0 0" }, { bottom: -1, left: -1, borderWidth: "0 0 2px 2px" }, { bottom: -1, right: -1, borderWidth: "0 2px 2px 0" }].map((p, i) => (
              <div key={i} style={{ position: "absolute", width: 14, height: 14, borderStyle: "solid", borderColor: ACS, zIndex: 99, pointerEvents: "none", ...p }} />
            ))}

            {/* Header — закреплён сверху панели */}
            <div style={{
              display: "grid", gridTemplateColumns: TCOLS,
              borderBottom: `1px solid ${C.accentBorder}`,
              background: `linear-gradient(rgba(var(--glow-rgb),0.03),rgba(var(--glow-rgb),0.03)) ${C.bg}`,
              flexShrink: 0,
            }}>
              <span style={{ padding: `${padV + 2}px 0`, textAlign: "center", borderRight: `1px solid ${C.borderLight}`, fontSize: 10, letterSpacing: 1.5, color: C.muted, fontWeight: 700 }}>#</span>
              <span style={{ padding: `${padV + 2}px 12px`, borderRight: `1px solid ${C.borderLight}`, fontSize: 10, letterSpacing: 1.5, color: C.muted, fontWeight: 700, textTransform: "uppercase" }}>{t.cols.player}</span>
              <span style={{ padding: `${padV + 2}px 12px ${padV + 2}px 0`, textAlign: "right", borderRight: `1px solid ${C.borderLight}`, fontSize: 10, letterSpacing: 1.5, color: C.muted, fontWeight: 700, textTransform: "uppercase" }}>{t.cols.elo}</span>
              <span style={{ padding: `${padV + 2}px 0`, textAlign: "center", fontSize: 10, letterSpacing: 1.5, color: C.muted, fontWeight: 700 }}>±</span>
            </div>

            {/* Прокручивается только тело таблицы */}
            <div style={{ overflowY: "auto", flex: 1, minHeight: 0 }}>
            {/* Grouped by division; Pro/Semi-Pro только при showPro */}
            {divisions.filter((d) => showPro || !isProGroup(d.label)).map((div) => {
              const di = divisions.indexOf(div);
              return (
              <div key={div.label} ref={(el) => { divRefs.current[div.label] = el; }} style={{ scrollMarginTop: mob ? 258 : 168 }}>
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
                  const rank = (startRank[div.label] ?? 0) + pi + 1;
                  // "?" в таблице = неуверенный рейтинг: вся строка серая
                  const isTop3 = rank <= 3 && !p.uncertain;
                  const isMatch = match != null && p.name === match;
                  return (
                    <div
                      key={pi}
                      ref={(el) => { rowRefs.current[p.name.toLowerCase()] = el; }}
                      className={isMatch ? "a1-match" : undefined}
                      style={{
                        position: "relative", zIndex: isMatch ? 1 : undefined,
                        display: "grid", gridTemplateColumns: TCOLS, alignItems: "stretch",
                        borderBottom: `1px solid ${C.borderLight}`,
                        background: isMatch || isTop3 ? C.accentSubtle : "transparent",
                        scrollMarginTop: mob ? 150 : 160,
                      }}
                    >
                      <span style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: `${padV}px 0`, borderRight: `1px solid ${C.borderLight}`, fontFamily: BODY_FONT, fontSize: mob ? 10 : 11, color: isTop3 ? ACS : C.muted, fontWeight: isTop3 ? 700 : 400 }}>
                        {rank}
                      </span>
                      <div style={{ padding: `${padV}px 12px`, borderRight: `1px solid ${C.borderLight}`, overflow: "hidden" }}>
                        <Link
                          to={`/player/${encodeURIComponent(p.name)}`}
                          style={{ display: "block", fontFamily: BODY_FONT, fontSize: mob ? 12 : 13, color: p.uncertain ? C.muted : isTop3 ? C.heading : C.body, fontWeight: isTop3 ? 700 : 400, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", textDecoration: "none", cursor: "pointer" }}
                          onMouseEnter={(e) => (e.currentTarget.style.color = ACS)}
                          onMouseLeave={(e) => (e.currentTarget.style.color = p.uncertain ? C.muted : isTop3 ? C.heading : C.body)}
                        >
                          {p.name}
                        </Link>
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
              );
            })}
            </div>
          </div>
        )}
      </section>

      <footer style={{ position: "relative", background: C.bg, padding: mob ? "40px 16px" : "60px 20px", textAlign: "center", borderTop: `1px solid ${C.borderLight}` }}>
        <div style={{ fontSize: 16, fontWeight: 900, color: C.footer, letterSpacing: 4 }}>ARENA <span style={{ color: ACS }}>1</span></div>
        <div style={{ fontSize: 10, color: C.footer, letterSpacing: 3, marginTop: 8 }}>{t.footer}</div>
      </footer>
    </div>
  );
};

export default Divisions;
