import { useRef, useState, useEffect, type FC } from "react";
import { useLang } from "../hooks/useLang";
import { useIsMobile } from "../hooks/useIsMobile";
import { useSheetData } from "../hooks/useSheetData";
import { ScanLine, BODY_FONT } from "../components/UI";
import { C } from "../theme";

const AC = "#4ade80";

const T = {
  ru: {
    tag: "N O N - P R O",
    h1: "ДИВИЗИОНЫ",
    h2: "& ИГРОКИ",
    loading: "Загрузка...",
    error: "Не удалось загрузить данные. Попробуй позже.",
    cols: { div: "Дивизион", player: "Игрок", elo: "ELO" },
    footer: "ARENA 1 DIVISIONS · NON-PRO DUEL CUPS · 2026",
  },
  en: {
    tag: "N O N - P R O",
    h1: "DIVISIONS",
    h2: "& PLAYERS",
    loading: "Loading...",
    error: "Failed to load data. Please try again later.",
    cols: { div: "Division", player: "Player", elo: "ELO" },
    footer: "ARENA 1 DIVISIONS · NON-PRO DUEL CUPS · 2026",
  },
};

const Divisions: FC = () => {
  const { lang } = useLang();
  const mob = useIsMobile();
  const t = T[lang];
  const { divisions, loading, error } = useSheetData();
  const [activeDiv, setActiveDiv] = useState("");
  const divRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    if (divisions.length > 0 && !activeDiv) setActiveDiv(divisions[0].label);
  }, [divisions]);

  const scrollToDiv = (label: string) => {
    divRefs.current[label]?.scrollIntoView({ behavior: "smooth", block: "start" });
    setActiveDiv(label);
  };

  const COLS = mob ? "120px 1fr 52px" : "140px 1fr 80px";

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
          padding: mob ? "100px 16px 60px" : "120px 20px 80px",
          textAlign: "center",
          background: `radial-gradient(ellipse at 50% 20%,rgba(74,222,128,0.06) 0%,transparent 60%)`,
        }}
      >
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", backgroundImage: `linear-gradient(rgba(74,222,128,var(--grid-line)) 1px,transparent 1px),linear-gradient(90deg,rgba(74,222,128,var(--grid-line)) 1px,transparent 1px)`, backgroundSize: "60px 60px" }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ fontSize: mob ? 9 : 11, letterSpacing: mob ? 3 : 6, color: AC, marginBottom: 20, fontWeight: 600 }}>{t.tag}</div>
          <h1 style={{ fontSize: "clamp(36px,8vw,80px)", fontWeight: 900, margin: 0, lineHeight: 0.9, letterSpacing: -2, color: C.heading }}>
            {t.h1} <span style={{ color: AC }}>{t.h2}</span>
          </h1>
        </div>
      </section>

      {/* Division select */}
      {!loading && !error && divisions.length > 0 && (
        <div style={{
          position: "sticky", top: 48, zIndex: 99,
          background: C.bgNavSub, backdropFilter: "blur(12px)",
          borderBottom: `1px solid ${C.border}`,
          display: "flex", justifyContent: "flex-start", alignItems: "center",
          padding: mob ? "8px 16px" : "8px 24px",
          transition: "background 0.3s",
        }}>
          <select
            value={activeDiv}
            onChange={(e) => scrollToDiv(e.target.value)}
            style={{
              background: C.inputBg,
              border: `1px solid ${C.inputBorder}`,
              color: C.body,
              fontFamily: "'Orbitron',monospace",
              fontSize: mob ? 9 : 10,
              fontWeight: 700,
              letterSpacing: 2,
              textTransform: "uppercase",
              padding: "6px 10px",
              cursor: "pointer",
              outline: "none",
              maxWidth: mob ? 200 : 260,
            }}
          >
            {divisions.map((d) => (
              <option key={d.label} value={d.label}>{d.label}</option>
            ))}
          </select>
        </div>
      )}

      {/* Table */}
      <section style={{ padding: mob ? "0 0 80px" : "0 20px 120px", maxWidth: 900, margin: "0 auto" }}>
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
              display: "grid", gridTemplateColumns: COLS,
              padding: mob ? "10px 16px" : "12px 24px",
              borderBottom: `1px solid ${AC}33`,
              background: `${AC}08`,
              position: "sticky", top: mob ? 80 : 84, zIndex: 98,
            }}>
              {[t.cols.div, t.cols.player, t.cols.elo].map((col, i) => (
                <div key={i} style={{
                  fontSize: 9, letterSpacing: 3, color: C.muted,
                  fontWeight: 700, textTransform: "uppercase",
                  textAlign: i === 2 ? "right" : "left",
                }}>
                  {col}
                </div>
              ))}
            </div>

            {/* Rows grouped by division */}
            {divisions.map((div) => (
              <div key={div.label} ref={(el) => { divRefs.current[div.label] = el; }} style={{ scrollMarginTop: mob ? 112 : 120 }}>
                {div.players.map((p, pi) => {
                  const isFirst = pi === 0;
                  const isTop3Overall =
                    pi < 3 && divisions[0].label === div.label;

                  return (
                    <div
                      key={pi}
                      style={{
                        display: "grid",
                        gridTemplateColumns: COLS,
                        padding: mob ? "9px 16px" : "11px 24px",
                        borderBottom: `1px solid ${C.borderLight}`,
                        alignItems: "center",
                        background: isTop3Overall ? C.accentSubtle : "transparent",
                      }}
                    >
                      {/* Division — only on first row of each division */}
                      <div style={{
                        fontSize: mob ? 9 : 10, fontWeight: 700,
                        letterSpacing: mob ? 1 : 2,
                        color: isFirst ? AC : "transparent",
                        textTransform: "uppercase",
                        fontFamily: "'Orbitron',sans-serif",
                        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                        paddingRight: 8,
                      }}>
                        {isFirst ? div.label : ""}
                      </div>

                      {/* Player */}
                      <div style={{
                        fontFamily: BODY_FONT,
                        fontSize: mob ? 12 : 13,
                        color: isTop3Overall ? C.heading : C.body,
                        fontWeight: isTop3Overall ? 700 : 400,
                        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                      }}>
                        {p.name}
                      </div>

                      {/* ELO */}
                      <div style={{
                        fontFamily: BODY_FONT,
                        fontSize: mob ? 12 : 13,
                        color: AC, fontWeight: 600,
                        letterSpacing: 1, textAlign: "right",
                      }}>
                        {p.elo}
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
        <div style={{ fontSize: 16, fontWeight: 900, color: C.footer, letterSpacing: 4 }}>ARENA <span style={{ color: AC }}>1</span></div>
        <div style={{ fontSize: 10, color: C.footer, letterSpacing: 3, marginTop: 8 }}>{t.footer}</div>
      </footer>
    </div>
  );
};

export default Divisions;
