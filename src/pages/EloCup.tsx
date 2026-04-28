import { useState, useEffect, useRef, type FC } from "react";
import { useLang } from "../hooks/useLang";
import { ELOCUP } from "../data/elocup";
import { ScanLine, SL, ST, BODY_FONT } from "../components/UI";
import { Icon } from "../components/Icons";

const AC = "#4ade80";
const PLACE_C: Record<string, string> = { "1": "#ffd700", "2": "#c0c0c0", "3": "#cd7f32" };
const NAV_IDS = ["hero", "next", "archive"];

const EloCup: FC = () => {
  const { lang } = useLang();
  const t = ELOCUP[lang];
  const [active, setActive] = useState("hero");
  const refs = useRef<Record<string, HTMLElement | null>>({});
  const setRef = (id: string) => (el: HTMLElement | null) => { refs.current[id] = el; };

  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.getAttribute("data-section") ?? ""); });
    }, { threshold: 0.25 });
    NAV_IDS.forEach((id) => { if (refs.current[id]) obs.observe(refs.current[id]!); });
    return () => obs.disconnect();
  }, []);

  const scrollTo = (id: string) => refs.current[id]?.scrollIntoView({ behavior: "smooth" });

  return (
    <div>
      <ScanLine />
      {/* Sub-nav */}
      <nav style={{ position: "fixed", top: 48, left: 0, right: 0, zIndex: 99, background: "rgba(8,8,12,0.92)", backdropFilter: "blur(12px)", borderBottom: `1px solid ${AC}18`, display: "flex", justifyContent: "center", overflowX: "auto" }}>
        {NAV_IDS.map((id, i) => (
          <button key={id} onClick={() => scrollTo(id)} style={{ background: "none", border: "none", cursor: "pointer", color: active === id ? AC : "#555", fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", padding: "12px 14px", whiteSpace: "nowrap", borderBottom: active === id ? `2px solid ${AC}` : "2px solid transparent", transition: "all 0.3s", fontFamily: "'Orbitron',sans-serif" }}>{t.nav[i]}</button>
        ))}
      </nav>

      {/* Hero */}
      <section ref={setRef("hero")} data-section="hero" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", position: "relative", padding: "120px 20px 40px", textAlign: "center", background: `radial-gradient(ellipse at 50% 20%,rgba(74,222,128,0.06) 0%,transparent 60%)` }}>
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", backgroundImage: `linear-gradient(rgba(74,222,128,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(74,222,128,0.03) 1px,transparent 1px)`, backgroundSize: "60px 60px" }} />
        <div style={{ position: "relative", zIndex: 1, maxWidth: 700 }}>
          <div style={{ marginBottom: 40, display: "flex", justifyContent: "center" }}><Icon type="trophy" color={AC} size={48} /></div>
          <div style={{ fontSize: 11, letterSpacing: 6, color: AC, marginBottom: 20, fontWeight: 600 }}>{t.hero.tag}</div>
          <h1 style={{ fontSize: "clamp(48px,11vw,110px)", fontWeight: 900, margin: 0, lineHeight: 0.85, letterSpacing: -2, color: "#fff" }}>{t.hero.t1} <span style={{ color: AC }}>{t.hero.t2}</span></h1>
          <div style={{ fontFamily: BODY_FONT, fontSize: 15, color: "#888", marginTop: 28, lineHeight: 1.8, maxWidth: 560, margin: "28px auto 0" }}>{t.hero.sub}</div>
          <a href="https://discord.gg/dgPwNAph2j" target="_blank" rel="noopener noreferrer" style={{ marginTop: 44, padding: "14px 40px", background: AC, border: "none", color: "#08080c", fontSize: 12, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", cursor: "pointer", fontFamily: "'Orbitron',monospace", textDecoration: "none", display: "inline-block" }}>{t.next.cta}</a>
        </div>
      </section>

      {/* Next tournament */}
      <section ref={setRef("next")} data-section="next" style={{ padding: "120px 20px", maxWidth: 860, margin: "0 auto" }}>
        <SL num={t.next.num} text={t.next.label} color={AC} />
        <ST>{t.next.t1}<br /><span style={{ color: AC }}>{t.next.t2}</span></ST>

        <div style={{ background: "rgba(255,255,255,0.02)", border: `1px solid ${AC}22`, overflow: "hidden" }}>
          {/* Header */}
          <div style={{ padding: "28px 32px", borderBottom: `1px solid ${AC}18`, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
            <div>
              <div style={{ fontSize: "clamp(20px,4vw,28px)", fontWeight: 900, color: "#fff", letterSpacing: 1 }}>{t.next.name}</div>
              <div style={{ fontFamily: BODY_FONT, fontSize: 13, color: "#666", marginTop: 6 }}>{t.next.date}</div>
            </div>
            <a href="https://discord.gg/dgPwNAph2j" target="_blank" rel="noopener noreferrer" style={{ padding: "12px 32px", background: AC, border: "none", color: "#08080c", fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", cursor: "pointer", fontFamily: "'Orbitron',monospace", textDecoration: "none", display: "inline-block" }}>{t.next.cta}</a>
          </div>

          {/* Info grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 1, background: `${AC}12` }}>
            {[
              { label: "ELO", value: t.next.elo },
              { label: "FORMAT", value: t.next.format },
              { label: "PRIZE", value: t.next.prize },
            ].map((item) => (
              <div key={item.label} style={{ background: "#08080c", padding: "24px 28px" }}>
                <div style={{ fontSize: 9, letterSpacing: 3, color: "#555", marginBottom: 8, textTransform: "uppercase" }}>{item.label}</div>
                <div style={{ fontFamily: BODY_FONT, fontSize: 15, color: "#fff", fontWeight: 600 }}>{item.value}</div>
              </div>
            ))}
          </div>

          {/* Map pool */}
          <div style={{ padding: "24px 32px", borderTop: `1px solid ${AC}12` }}>
            <div style={{ fontSize: 9, letterSpacing: 3, color: "#555", marginBottom: 14, textTransform: "uppercase" }}>{t.next.mappool}</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {t.next.maps.map((m) => (
                <span key={m} style={{ fontFamily: BODY_FONT, fontSize: 12, color: AC, padding: "6px 12px", background: "rgba(74,222,128,0.06)", border: "1px solid rgba(74,222,128,0.12)", letterSpacing: 0.5 }}>{m}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Archive */}
      <section ref={setRef("archive")} data-section="archive" style={{ padding: "120px 20px", maxWidth: 860, margin: "0 auto" }}>
        <SL num={t.archive.num} text={t.archive.label} color={AC} />
        <ST>{t.archive.t1}<br /><span style={{ color: AC }}>{t.archive.t2}</span></ST>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {t.past.map((cup, ci) => (
            <div key={ci} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid #1a1a1a", overflow: "hidden" }}>
              {/* Cup header */}
              <div style={{ padding: "24px 28px", borderBottom: "1px solid #1a1a1a", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: "#fff", letterSpacing: 1 }}>{cup.name}</div>
                  <div style={{ fontFamily: BODY_FONT, fontSize: 12, color: "#555", marginTop: 4 }}>{cup.date}</div>
                </div>
                <a href={cup.bracketUrl} target="_blank" rel="noopener noreferrer" style={{ fontFamily: BODY_FONT, fontSize: 11, color: AC, letterSpacing: 1, textDecoration: "none", padding: "8px 16px", border: `1px solid ${AC}33`, transition: "all 0.3s" }}>{t.archive.bracket} &#8599;</a>
              </div>

              {/* Standings */}
              <div style={{ display: "flex", flexDirection: "column" }}>
                {cup.standings.map((s, si) => {
                  const pc = PLACE_C[s.place] ?? "#888";
                  const isTop3 = ["1", "2", "3"].includes(s.place);
                  return (
                    <div key={si} style={{ display: "grid", gridTemplateColumns: "64px 1fr", alignItems: "center", padding: "14px 28px", borderTop: si > 0 ? "1px solid rgba(255,255,255,0.03)" : "none", background: isTop3 ? `${pc}08` : "transparent" }}>
                      <div style={{ fontSize: isTop3 ? 18 : 13, fontWeight: isTop3 ? 900 : 600, color: pc, fontFamily: "'Orbitron',monospace" }}>
                        {s.place === "1" ? "🥇" : s.place === "2" ? "🥈" : s.place === "3" ? "🥉" : `#${s.place}`}
                      </div>
                      <div style={{ fontFamily: BODY_FONT, fontSize: isTop3 ? 15 : 13, color: isTop3 ? "#fff" : "#888", fontWeight: isTop3 ? 700 : 400, letterSpacing: 0.5 }}>
                        {s.players.join(", ")}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer style={{ padding: "60px 20px", textAlign: "center", borderTop: `1px solid ${AC}10` }}>
        <div style={{ fontSize: 16, fontWeight: 900, color: "#333", letterSpacing: 4 }}>ARENA <span style={{ color: AC }}>1</span></div>
        <div style={{ fontSize: 10, color: "#333", letterSpacing: 3, marginTop: 8 }}>{t.footer}</div>
      </footer>
    </div>
  );
};

export default EloCup;
