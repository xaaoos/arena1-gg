import { useState, useRef, type FC } from "react";
import { Link } from "react-router-dom";
import { useLang } from "../hooks/useLang";
import { useIsMobile } from "../hooks/useIsMobile";
import { ELOCUP } from "../data/elocup";
import { useArchiveData, formatArchiveDate, type ArchiveCup } from "../hooks/useArchiveData";
import { ScanLine, SL, ST, BODY_FONT } from "../components/UI";
import { Icon } from "../components/Icons";
import { C } from "../theme";

const AC = "#4ade80";
const PLACE_C: Record<string, string> = { "1": C.place1, "2": C.place2, "3": C.place3 };

const EloCup: FC = () => {
  const { lang } = useLang();
  const t = ELOCUP[lang];
  const mob = useIsMobile();
  const { cups, loading: archiveLoading, error: archiveError } = useArchiveData();
  const [selected, setSelected] = useState<ArchiveCup | null>(null);
  const archiveRef = useRef<HTMLElement | null>(null);

  return (
    <div style={{ overflowX: "hidden" }}>
      <ScanLine />

      {/* Sub-nav */}
      <nav style={{ position: "sticky", top: 48, zIndex: 99, background: C.bgNavSub, backdropFilter: "blur(12px)", borderBottom: `1px solid ${AC}18`, display: "flex", justifyContent: "center", transition: "background 0.3s" }}>
        <button onClick={() => archiveRef.current?.scrollIntoView({ behavior: "smooth" })} style={{ background: "none", border: "none", cursor: "pointer", color: AC, fontSize: mob ? 10 : 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", padding: mob ? "10px 16px" : "12px 20px", borderBottom: `2px solid ${AC}`, fontFamily: "'Orbitron',sans-serif" }}>
          {lang === "ru" ? "Результаты" : "Results"}
        </button>
      </nav>

      {/* Hero */}
      <section style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", position: "relative", padding: mob ? "100px 16px 40px" : "120px 20px 40px", textAlign: "center", background: `radial-gradient(ellipse at 50% 20%,rgba(74,222,128,0.06) 0%,transparent 60%)` }}>
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", backgroundImage: `linear-gradient(rgba(74,222,128,var(--grid-line)) 1px,transparent 1px),linear-gradient(90deg,rgba(74,222,128,var(--grid-line)) 1px,transparent 1px)`, backgroundSize: "60px 60px" }} />
        <div style={{ position: "relative", zIndex: 1, maxWidth: 700, width: "100%" }}>
          <div style={{ marginBottom: mob ? 24 : 40, display: "flex", justifyContent: "center" }}><Icon type="trophy" color={AC} size={mob ? 36 : 48} /></div>
          <div style={{ fontSize: mob ? 9 : 11, letterSpacing: mob ? 3 : 6, color: AC, marginBottom: 20, fontWeight: 600 }}>{t.hero.tag}</div>
          <h1 style={{ fontSize: "clamp(28px,6vw,64px)", fontWeight: 900, margin: 0, lineHeight: 1, letterSpacing: -1, color: C.heading, whiteSpace: "nowrap" }}>
            {t.hero.t1}{t.hero.t1 && " "}<span style={{ color: AC }}>{t.hero.t2}</span>
          </h1>
          <div style={{ fontFamily: BODY_FONT, fontSize: mob ? 13 : 15, color: C.body, lineHeight: 1.8, maxWidth: 560, margin: "28px auto 0" }}>{t.hero.sub}</div>
          <div style={{ marginTop: mob ? 32 : 44, display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center" }}>
            <a href="https://discord.gg/dgPwNAph2j" target="_blank" rel="noopener noreferrer" style={{ padding: mob ? "12px 28px" : "14px 40px", background: AC, color: "#08080c", fontSize: mob ? 11 : 12, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", fontFamily: "'Orbitron',monospace", textDecoration: "none", display: "inline-block", whiteSpace: "nowrap" }}>{t.next.cta}</a>
            <Link to="/divisions" style={{ padding: mob ? "12px 28px" : "14px 40px", background: "transparent", border: `1px solid ${AC}`, color: AC, fontSize: mob ? 11 : 12, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", fontFamily: "'Orbitron',monospace", textDecoration: "none", display: "inline-block", whiteSpace: "nowrap" }}>{t.next.ctaDivisions}</Link>
          </div>
        </div>
      </section>

      {/* Archive */}
      <section ref={archiveRef} style={{ padding: mob ? "60px 16px 80px" : "120px 20px 120px", maxWidth: 900, margin: "0 auto" }}>
        <SL num={t.archive.num} text={t.archive.label} color={AC} />
        <ST>{t.archive.t1}<br /><span style={{ color: AC }}>{t.archive.t2}</span></ST>

        {archiveLoading && (
          <div style={{ textAlign: "center", color: C.muted, padding: "40px 0", fontFamily: BODY_FONT, fontSize: 13, letterSpacing: 2 }}>
            {lang === "ru" ? "Загрузка..." : "Loading..."}
          </div>
        )}
        {archiveError && (
          <div style={{ textAlign: "center", color: "#ff3e3e", padding: "40px 0", fontFamily: BODY_FONT, fontSize: 13 }}>
            {lang === "ru" ? "Не удалось загрузить архив" : "Failed to load archive"}
          </div>
        )}

        {!archiveLoading && !archiveError && (
          <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr 1fr" : "repeat(3, 1fr)", gap: mob ? 10 : 14 }}>
            {cups.map((cup, ci) => {
              const winner = cup.standings.find(s => s.place === "1")?.players[0] ?? "—";
              return (
                <div
                  key={ci}
                  onClick={() => setSelected(cup)}
                  style={{
                    background: C.bgCard,
                    border: `1px solid ${C.border}`,
                    padding: mob ? "14px 12px" : "20px 20px",
                    cursor: "pointer",
                    display: "flex", flexDirection: "column", gap: 8,
                    transition: "border-color 0.2s",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = `${AC}66`)}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = C.border)}
                >
                  <div style={{ fontSize: mob ? 11 : 12, fontWeight: 800, color: C.heading, letterSpacing: 0.5, lineHeight: 1.3 }}>{cup.name}</div>
                  <div style={{ fontFamily: BODY_FONT, fontSize: mob ? 10 : 11, color: C.muted }}>{formatArchiveDate(cup.rawDate, lang)}</div>
                  <div style={{ fontFamily: BODY_FONT, fontSize: mob ? 11 : 12, color: C.place1, marginTop: 4 }}>🥇 {winner}</div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <footer style={{ padding: mob ? "40px 16px" : "60px 20px", textAlign: "center", borderTop: `1px solid ${C.borderLight}` }}>
        <div style={{ fontSize: 16, fontWeight: 900, color: C.footer, letterSpacing: 4 }}>ARENA <span style={{ color: AC }}>1</span></div>
        <div style={{ fontSize: 10, color: C.footer, letterSpacing: 3, marginTop: 8 }}>{t.footer}</div>
        <div style={{ fontSize: 10, color: C.footer, letterSpacing: 2, marginTop: 16, opacity: 0.5 }}>developed by <a href="https://selzio.com" target="_blank" rel="noopener noreferrer" style={{ color: "inherit", textDecoration: "underline" }}>selzio.com</a></div>
      </footer>

      {/* Modal */}
      {selected && (
        <div
          onClick={() => setSelected(null)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", zIndex: 500, display: "flex", alignItems: "center", justifyContent: "center", padding: mob ? 12 : 24, backdropFilter: "blur(4px)" }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{ background: C.bg, border: `1px solid ${AC}33`, width: "100%", maxWidth: 520, maxHeight: "85vh", overflow: "auto", display: "flex", flexDirection: "column" }}
          >
            {/* Modal header */}
            <div style={{ padding: mob ? "16px 16px" : "20px 24px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, position: "sticky", top: 0, background: C.bg, zIndex: 1 }}>
              <div>
                <div style={{ fontSize: mob ? 14 : 16, fontWeight: 900, color: C.heading, letterSpacing: 0.5 }}>{selected.name}</div>
                <div style={{ fontFamily: BODY_FONT, fontSize: 11, color: C.muted, marginTop: 4 }}>{formatArchiveDate(selected.rawDate, lang)}</div>
              </div>
              <div style={{ display: "flex", gap: 8, alignItems: "center", flexShrink: 0 }}>
                <a href={selected.bracketUrl} target="_blank" rel="noopener noreferrer" style={{ fontFamily: BODY_FONT, fontSize: 10, color: AC, letterSpacing: 1, textDecoration: "none", padding: "6px 12px", border: `1px solid ${AC}33`, whiteSpace: "nowrap" }}>
                  {t.archive.bracket} ↗
                </a>
                <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", cursor: "pointer", color: C.muted, fontSize: 18, lineHeight: 1, padding: "4px 6px" }}>✕</button>
              </div>
            </div>

            {/* Standings */}
            <div>
              {selected.standings.map((s, si) => {
                const pc = PLACE_C[s.place] ?? C.body;
                const isTop3 = ["1", "2", "3"].includes(s.place);
                return (
                  <div key={si} style={{ display: "grid", gridTemplateColumns: mob ? "44px 1fr" : "56px 1fr", alignItems: "center", padding: mob ? "11px 16px" : "13px 24px", borderTop: si > 0 ? `1px solid ${C.borderLight}` : "none", background: isTop3 ? C.accentSubtle : "transparent" }}>
                    <div style={{ fontSize: isTop3 ? (mob ? 15 : 17) : 12, fontWeight: isTop3 ? 900 : 600, color: pc, fontFamily: "'Orbitron',monospace" }}>
                      {s.place === "1" ? "🥇" : s.place === "2" ? "🥈" : s.place === "3" ? "🥉" : `#${s.place}`}
                    </div>
                    <div style={{ fontFamily: BODY_FONT, fontSize: isTop3 ? (mob ? 13 : 14) : (mob ? 12 : 13), color: isTop3 ? C.heading : C.body, fontWeight: isTop3 ? 700 : 400, overflowWrap: "break-word" }}>
                      {s.players.join(", ")}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EloCup;
