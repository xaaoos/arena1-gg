import { useState, useEffect, useRef, type FC } from "react";
import { useLang } from "../hooks/useLang";
import { useCountdown } from "../hooks/useCountdown";
import { CHAMP, LAUNCH_DATE } from "../data/championship";
import { ScanLine, GlitchText, CUnit, Sep, SL, ST, BODY_FONT } from "../components/UI";
import { Icon } from "../components/Icons";

const WHY_ICONS = ["crown", "crosshair", "bolt"] as const;
const WATCH_ICONS = ["broadcast", "trophy", "film"] as const;
const WATCH_COLORS = ["#ffd700", "#ff3e3e", "#ffd700"];
const NAV_IDS = ["hero", "why", "about", "watch", "verify"];

const Championship: FC = () => {
  const { lang } = useLang();
  const t = CHAMP[lang];
  const cd = useCountdown(LAUNCH_DATE);
  const [active, setActive] = useState("hero");
  const [checks, setChecks] = useState<Record<string, boolean>>({});
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
  const toggleCheck = (id: string) => setChecks((p) => ({ ...p, [id]: !p[id] }));
  const checkedCount = Object.values(checks).filter(Boolean).length;
  const allChecked = t.verify.steps.every((s) => checks[s.id]);

  return (
    <div>
      <ScanLine />
      {/* Sub-nav */}
      <nav style={{ position: "fixed", top: 48, left: 0, right: 0, zIndex: 99, background: "rgba(8,8,12,0.92)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(255,62,62,0.12)", display: "flex", justifyContent: "center", overflowX: "auto" }}>
        {NAV_IDS.map((id, i) => (
          <button key={id} onClick={() => scrollTo(id)} style={{ background: "none", border: "none", cursor: "pointer", color: active === id ? "#ff3e3e" : "#555", fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", padding: "12px 14px", whiteSpace: "nowrap", borderBottom: active === id ? "2px solid #ff3e3e" : "2px solid transparent", transition: "all 0.3s", fontFamily: "'Orbitron',sans-serif" }}>{t.nav[i]}</button>
        ))}
      </nav>

      {/* Hero */}
      <section ref={setRef("hero")} data-section="hero" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", position: "relative", padding: "120px 20px 40px", textAlign: "center", background: "radial-gradient(ellipse at 50% 20%,rgba(255,62,62,0.06) 0%,transparent 60%)" }}>
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", backgroundImage: "linear-gradient(rgba(255,62,62,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,62,62,0.03) 1px,transparent 1px)", backgroundSize: "60px 60px" }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ fontSize: 11, letterSpacing: 6, color: "#ff3e3e", marginBottom: 8, fontWeight: 600 }}>{t.hero.tag}</div>
          <GlitchText><h1 style={{ fontSize: "clamp(48px,11vw,130px)", fontWeight: 900, margin: 0, lineHeight: 0.85, letterSpacing: -2, color: "#fff" }}>ARENA <span style={{ color: "#ff3e3e" }}>1</span></h1></GlitchText>
          <div style={{ fontSize: "clamp(12px,1.8vw,16px)", letterSpacing: 6, color: "#ffd700", marginTop: 16, fontWeight: 500, fontStyle: "italic" }}>{t.hero.slogan}</div>
          <div style={{ fontFamily: BODY_FONT, fontSize: 14, color: "#777", marginTop: 24, lineHeight: 1.8 }}>{t.hero.sub}</div>
          <div style={{ marginTop: 48, display: "flex", gap: 20, justifyContent: "center", flexWrap: "wrap", alignItems: "flex-start" }}>
            <CUnit value={cd.days} label={t.cd.d} /><Sep /><CUnit value={cd.hours} label={t.cd.h} /><Sep /><CUnit value={cd.minutes} label={t.cd.m} /><Sep /><CUnit value={cd.seconds} label={t.cd.s} />
          </div>
          <div style={{ marginTop: 14, fontSize: 11, color: "#444", letterSpacing: 3 }}>{t.hero.date}</div>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", marginTop: 40, flexWrap: "wrap" }}>
            <button onClick={() => scrollTo("verify")} style={{ padding: "14px 36px", background: "#ff3e3e", border: "none", color: "#fff", fontSize: 12, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", cursor: "pointer", fontFamily: "'Orbitron',monospace", transition: "all 0.3s" }}>{t.hero.cta1}</button>
            <button onClick={() => scrollTo("watch")} style={{ padding: "14px 36px", background: "transparent", border: "1px solid #444", color: "#888", fontSize: 12, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", cursor: "pointer", fontFamily: "'Orbitron',monospace", transition: "all 0.3s" }}>{t.hero.cta2}</button>
          </div>
        </div>
      </section>

      {/* Why */}
      <section ref={setRef("why")} data-section="why" style={{ padding: "120px 20px", maxWidth: 860, margin: "0 auto" }}>
        <SL num={t.why.num} text={t.why.label} />
        <ST>{t.why.t1}<br /><span style={{ color: "#ff3e3e" }}>{t.why.t2}</span></ST>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))", gap: 2, marginBottom: 40 }}>
          {t.why.points.map((p, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,0.02)", padding: "32px 24px", borderTop: `3px solid ${p.color}` }}>
              <div style={{ marginBottom: 20 }}><Icon type={WHY_ICONS[i]} color={p.color} size={24} /></div>
              <div style={{ fontSize: 15, fontWeight: 800, color: p.color, letterSpacing: 0.5, marginBottom: 14, lineHeight: 1.3 }}>{p.title}</div>
              <div style={{ fontFamily: BODY_FONT, fontSize: 13, color: "#888", lineHeight: 1.8 }}>{p.desc}</div>
            </div>
          ))}
        </div>
        <div style={{ padding: "24px 32px", background: "rgba(255,62,62,0.04)", borderLeft: "3px solid #ff3e3e", textAlign: "center" }}>
          <div style={{ fontFamily: BODY_FONT, fontSize: 16, color: "#fff", fontStyle: "italic", lineHeight: 1.6, fontWeight: 500 }}>{t.why.quote}</div>
        </div>
      </section>

      {/* Format */}
      <section ref={setRef("about")} data-section="about" style={{ padding: "120px 20px", maxWidth: 860, margin: "0 auto" }}>
        <SL num={t.format.num} text={t.format.label} />
        <ST>{t.format.t1}<br /><span style={{ color: "#00f0ff" }}>{t.format.t2}</span></ST>
        <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 40 }}>
          {t.format.rounds.map((r, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "110px 1fr 1fr 60px", alignItems: "center", padding: "16px 24px", background: r.final ? "rgba(255,62,62,0.06)" : "rgba(255,255,255,0.02)", borderLeft: `3px solid ${r.final ? "#ff3e3e" : "#333"}` }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: r.final ? "#ff3e3e" : "#fff", letterSpacing: 1 }}>{r.r}</div>
              <div style={{ fontFamily: BODY_FONT, fontSize: 13, color: "#888" }}>{r.p}</div>
              <div style={{ fontFamily: BODY_FONT, fontSize: 13, color: r.final ? "#ff3e3e" : "#666", fontWeight: r.final ? 700 : 400 }}>{r.a}</div>
              <div style={{ fontFamily: BODY_FONT, fontSize: 13, color: "#555", textAlign: "right" }}>{r.t}</div>
            </div>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: 1, background: "rgba(255,62,62,0.1)" }}>
          {t.format.stats.map((s, i) => (
            <div key={i} style={{ background: "#08080c", padding: "28px 20px", textAlign: "center" }}>
              <div style={{ fontSize: 36, fontWeight: 900, color: "#ff3e3e", fontFamily: "'Orbitron',monospace" }}>{s.v}</div>
              <div style={{ fontSize: 10, letterSpacing: 2, color: "#555", marginTop: 8, textTransform: "uppercase" }}>{s.l}</div>
            </div>
          ))}
        </div>
        <div style={{ fontFamily: BODY_FONT, fontSize: 12, color: "#444", marginTop: 24, letterSpacing: 1, textAlign: "center" }}>{t.format.footer}</div>
      </section>

      {/* Watch */}
      <section ref={setRef("watch")} data-section="watch" style={{ padding: "120px 20px", maxWidth: 860, margin: "0 auto" }}>
        <SL num={t.watch.num} text={t.watch.label} />
        <ST>{t.watch.t1}<br /><span style={{ color: "#ffd700" }}>{t.watch.t2}</span></ST>
        <div style={{ borderLeft: "3px solid #ffd700", padding: "20px 28px", marginBottom: 48, background: "rgba(255,215,0,0.03)" }}>
          <div style={{ fontFamily: BODY_FONT, fontSize: 14, color: "#ccc", lineHeight: 1.8, fontStyle: "italic" }}>{t.watch.text}</div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 2 }}>
          {t.watch.features.map((f, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,0.02)", padding: "28px 24px", borderLeft: "3px solid #333", transition: "all 0.3s" }}
              onMouseEnter={(e) => { e.currentTarget.style.borderLeftColor = WATCH_COLORS[i]; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderLeftColor = "#333"; }}>
              <div style={{ marginBottom: 16 }}><Icon type={WATCH_ICONS[i]} color={WATCH_COLORS[i]} size={22} /></div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", letterSpacing: 0.5, marginBottom: 10 }}>{f.title}</div>
              <div style={{ fontFamily: BODY_FONT, fontSize: 13, color: "#888", lineHeight: 1.7 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Verify */}
      <section ref={setRef("verify")} data-section="verify" style={{ padding: "120px 20px", maxWidth: 700, margin: "0 auto" }}>
        <SL num={t.verify.num} text={t.verify.label} />
        <ST>{t.verify.t1}<br /><span style={{ color: "#00f0ff" }}>{t.verify.t2}</span></ST>
        <p style={{ fontFamily: BODY_FONT, fontSize: 13, color: "#666", marginBottom: 48, lineHeight: 1.6 }}>{t.verify.desc}</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {t.verify.steps.map((step) => {
            const ch = !!checks[step.id];
            return (
              <div key={step.id} onClick={() => toggleCheck(step.id)} style={{ display: "grid", gridTemplateColumns: "48px 1fr", alignItems: "center", padding: "18px 24px", background: ch ? "rgba(0,240,255,0.04)" : "rgba(255,255,255,0.02)", borderLeft: `3px solid ${ch ? "#00f0ff" : "#333"}`, cursor: "pointer", transition: "all 0.3s", userSelect: "none" }}>
                <div style={{ width: 22, height: 22, border: `2px solid ${ch ? "#00f0ff" : "#444"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, color: "#00f0ff", background: ch ? "rgba(0,240,255,0.1)" : "transparent", transition: "all 0.3s" }}>{ch ? "✓" : ""}</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: ch ? "#fff" : "#aaa", letterSpacing: 0.5 }}>{step.label}</div>
                  <div style={{ fontFamily: BODY_FONT, fontSize: 11, color: "#555", marginTop: 3 }}>{step.detail}</div>
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ marginTop: 28 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 10, color: "#555", letterSpacing: 2 }}>{t.verify.progress}</span>
            <span style={{ fontSize: 10, letterSpacing: 2, fontWeight: 700, color: allChecked ? "#00f0ff" : "#ff3e3e" }}>{checkedCount}/{t.verify.steps.length}</span>
          </div>
          <div style={{ height: 3, background: "#1a1a1a", overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${(checkedCount / t.verify.steps.length) * 100}%`, background: allChecked ? "linear-gradient(90deg,#00f0ff,#00ff88)" : "linear-gradient(90deg,#ff3e3e,#ff8800)", transition: "all 0.5s ease-out" }} />
          </div>
        </div>
        {allChecked && (
          <div style={{ marginTop: 36, padding: "24px 32px", background: "rgba(0,240,255,0.04)", border: "1px solid rgba(0,240,255,0.2)", textAlign: "center" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#00f0ff", letterSpacing: 2, marginBottom: 8 }}>{t.verify.done}</div>
            <div style={{ fontFamily: BODY_FONT, fontSize: 12, color: "#666" }}>{t.verify.doneDesc}</div>
          </div>
        )}
      </section>

      <footer style={{ padding: "60px 20px", textAlign: "center", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
        <div style={{ fontSize: 20, fontWeight: 900, color: "#333", letterSpacing: 4 }}>ARENA <span style={{ color: "#ff3e3e" }}>1</span></div>
        <div style={{ fontSize: 10, color: "#333", letterSpacing: 3, marginTop: 8 }}>{t.footer}</div>
      </footer>
    </div>
  );
};

export default Championship;
