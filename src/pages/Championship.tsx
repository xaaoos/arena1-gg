import { useState, useEffect, useRef, type FC } from "react";
import { useLang } from "../hooks/useLang";
import { useCountdown } from "../hooks/useCountdown";
import { useIsMobile } from "../hooks/useIsMobile";
import { CHAMP, LAUNCH_DATE } from "../data/championship";
import { GlitchText, CUnit, Sep, SL, ST, BODY_FONT } from "../components/UI";
import { Seo } from "../components/Seo";
import { Icon } from "../components/Icons";
import { C } from "../theme";

const WHY_ICONS = ["crown", "crosshair", "bolt"] as const;
const WATCH_ICONS = ["broadcast", "trophy", "film"] as const;
const WATCH_COLORS = ["#ffd700", "#ff3e3e", "#ffd700"];
const NAV_IDS = ["hero", "why", "about", "watch", "verify"];

const Championship: FC = () => {
  const { lang } = useLang();
  const t = CHAMP[lang];
  const cd = useCountdown(LAUNCH_DATE);
  const m = useIsMobile();
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
  const pad = m ? "60px 16px" : "120px 20px";

  return (
    <div style={{ overflowX: "hidden" }}>
      <Seo path="/championship" title="Championship" description="Arena 1 Championship." noindex />
      <nav style={{ position: "fixed", top: 48, left: 0, right: 0, zIndex: 99, background: C.bgNavSub, backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(255,62,62,0.12)", display: "flex", justifyContent: m ? "flex-start" : "center", overflowX: "auto", WebkitOverflowScrolling: "touch", transition: "background 0.3s" }}>
        {NAV_IDS.map((id, i) => (
          <button key={id} onClick={() => scrollTo(id)} style={{ background: "none", border: "none", cursor: "pointer", color: active === id ? "#ff3e3e" : C.muted, fontSize: m ? 10 : 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", padding: m ? "10px 10px" : "12px 14px", whiteSpace: "nowrap", borderBottom: active === id ? "2px solid #ff3e3e" : "2px solid transparent", transition: "all 0.3s", fontFamily: "'Xolonium','Tektur',sans-serif", flexShrink: 0 }}>{t.nav[i]}</button>
        ))}
      </nav>

      {/* Hero */}
      <section ref={setRef("hero")} data-section="hero" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", position: "relative", padding: m ? "100px 16px 40px" : "120px 20px 40px", textAlign: "center", background: "radial-gradient(ellipse at 50% 20%,rgba(255,62,62,0.06) 0%,transparent 60%)" }}>
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", backgroundImage: `linear-gradient(rgba(255,62,62,${C.scanline === "var(--scanline)" ? "var(--grid-line)" : "0.03"}) 1px,transparent 1px),linear-gradient(90deg,rgba(255,62,62,var(--grid-line)) 1px,transparent 1px)`, backgroundSize: "60px 60px" }} />
        <div style={{ position: "relative", zIndex: 1, maxWidth: "100%" }}>
          <div style={{ fontSize: m ? 9 : 11, letterSpacing: m ? 3 : 6, color: "#ff3e3e", marginBottom: 8, fontWeight: 600 }}>{t.hero.tag}</div>
          <GlitchText><h1 style={{ fontSize: "clamp(48px,11vw,130px)", fontWeight: 900, margin: 0, lineHeight: 0.85, letterSpacing: -2, color: C.heading }}>ARENA <span style={{ color: "#ff3e3e" }}>1</span></h1></GlitchText>
          <div style={{ fontSize: "clamp(10px,1.8vw,16px)", letterSpacing: m ? 3 : 6, color: "#ffd700", marginTop: 16, fontWeight: 500, fontStyle: "italic" }}>{t.hero.slogan}</div>
          <div style={{ fontFamily: BODY_FONT, fontSize: m ? 13 : 14, color: C.body, marginTop: 24, lineHeight: 1.8 }}>{t.hero.sub}</div>
          <div style={{ marginTop: m ? 32 : 48, display: "flex", gap: m ? 8 : 20, justifyContent: "center", flexWrap: "nowrap", alignItems: "flex-start" }}>
            <CUnit value={cd.days} label={t.cd.d} /><Sep /><CUnit value={cd.hours} label={t.cd.h} /><Sep /><CUnit value={cd.minutes} label={t.cd.m} /><Sep /><CUnit value={cd.seconds} label={t.cd.s} />
          </div>
          <div style={{ marginTop: 14, fontSize: m ? 9 : 11, color: C.subtle, letterSpacing: m ? 1 : 3 }}>{t.hero.date}</div>
          <div style={{ display: "flex", gap: m ? 8 : 14, justifyContent: "center", marginTop: m ? 28 : 40, flexWrap: "wrap" }}>
            <button onClick={() => scrollTo("verify")} style={{ padding: m ? "12px 24px" : "14px 36px", background: "#ff3e3e", border: "none", color: "#fff", fontSize: m ? 11 : 12, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer", fontFamily: "'Xolonium','Tektur',monospace" }}>{t.hero.cta1}</button>
            <button onClick={() => scrollTo("watch")} style={{ padding: m ? "12px 24px" : "14px 36px", background: "transparent", border: `1px solid ${C.subtle}`, color: C.body, fontSize: m ? 11 : 12, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer", fontFamily: "'Xolonium','Tektur',monospace" }}>{t.hero.cta2}</button>
          </div>
        </div>
      </section>

      {/* Why */}
      <section ref={setRef("why")} data-section="why" style={{ padding: pad, maxWidth: 860, margin: "0 auto" }}>
        <SL num={t.why.num} text={t.why.label} />
        <ST>{t.why.t1}<br /><span style={{ color: "#ff3e3e" }}>{t.why.t2}</span></ST>
        <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "repeat(auto-fit,minmax(250px,1fr))", gap: 2, marginBottom: 40 }}>
          {t.why.points.map((p, i) => (
            <div key={i} style={{ background: C.bgCard, padding: m ? "24px 16px" : "32px 24px", borderTop: `3px solid ${p.color}` }}>
              <div style={{ marginBottom: 20 }}><Icon type={WHY_ICONS[i]} color={p.color} size={24} /></div>
              <div style={{ fontSize: 15, fontWeight: 800, color: p.color, letterSpacing: 0.5, marginBottom: 14, lineHeight: 1.3 }}>{p.title}</div>
              <div style={{ fontFamily: BODY_FONT, fontSize: 13, color: C.body, lineHeight: 1.8 }}>{p.desc}</div>
            </div>
          ))}
        </div>
        <div style={{ padding: m ? "20px 16px" : "24px 32px", background: "rgba(255,62,62,0.04)", borderLeft: "3px solid #ff3e3e", textAlign: "center" }}>
          <div style={{ fontFamily: BODY_FONT, fontSize: m ? 14 : 16, color: C.heading, fontStyle: "italic", lineHeight: 1.6, fontWeight: 500 }}>{t.why.quote}</div>
        </div>
      </section>

      {/* Format */}
      <section ref={setRef("about")} data-section="about" style={{ padding: pad, maxWidth: 860, margin: "0 auto" }}>
        <SL num={t.format.num} text={t.format.label} />
        <ST>{t.format.t1}<br /><span style={{ color: "#00f0ff" }}>{t.format.t2}</span></ST>
        <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 40, overflowX: m ? "auto" : "visible" }}>
          {t.format.rounds.map((r, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: m ? "80px 1fr 1fr 44px" : "110px 1fr 1fr 60px", alignItems: "center", padding: m ? "12px 12px" : "16px 24px", background: r.final ? "rgba(255,62,62,0.06)" : C.bgCard, borderLeft: `3px solid ${r.final ? "#ff3e3e" : C.border}`, minWidth: 0 }}>
              <div style={{ fontSize: m ? 11 : 13, fontWeight: 700, color: r.final ? "#ff3e3e" : C.heading, letterSpacing: 1 }}>{r.r}</div>
              <div style={{ fontFamily: BODY_FONT, fontSize: m ? 11 : 13, color: C.body }}>{r.p}</div>
              <div style={{ fontFamily: BODY_FONT, fontSize: m ? 11 : 13, color: r.final ? "#ff3e3e" : C.secondary, fontWeight: r.final ? 700 : 400 }}>{r.a}</div>
              <div style={{ fontFamily: BODY_FONT, fontSize: m ? 11 : 13, color: C.muted, textAlign: "right" }}>{r.t}</div>
            </div>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: m ? "repeat(2,1fr)" : "repeat(auto-fit,minmax(140px,1fr))", gap: 1, background: "rgba(255,62,62,0.1)" }}>
          {t.format.stats.map((s, i) => (
            <div key={i} style={{ background: C.bg, padding: m ? "20px 12px" : "28px 20px", textAlign: "center" }}>
              <div style={{ fontSize: m ? 28 : 36, fontWeight: 900, color: "#ff3e3e", fontFamily: "'Xolonium','Tektur',monospace" }}>{s.v}</div>
              <div style={{ fontSize: m ? 9 : 10, letterSpacing: 2, color: C.muted, marginTop: 8, textTransform: "uppercase" }}>{s.l}</div>
            </div>
          ))}
        </div>
        <div style={{ fontFamily: BODY_FONT, fontSize: m ? 11 : 12, color: C.subtle, marginTop: 24, letterSpacing: 1, textAlign: "center" }}>{t.format.footer}</div>
      </section>

      {/* Watch */}
      <section ref={setRef("watch")} data-section="watch" style={{ padding: pad, maxWidth: 860, margin: "0 auto" }}>
        <SL num={t.watch.num} text={t.watch.label} />
        <ST>{t.watch.t1}<br /><span style={{ color: "#ffd700" }}>{t.watch.t2}</span></ST>
        <div style={{ borderLeft: "3px solid #ffd700", padding: m ? "16px 16px" : "20px 28px", marginBottom: 48, background: "rgba(255,215,0,0.03)" }}>
          <div style={{ fontFamily: BODY_FONT, fontSize: m ? 13 : 14, color: C.link, lineHeight: 1.8, fontStyle: "italic" }}>{t.watch.text}</div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "repeat(auto-fit,minmax(240px,1fr))", gap: 2 }}>
          {t.watch.features.map((f, i) => (
            <div key={i} style={{ background: C.bgCard, padding: m ? "20px 16px" : "28px 24px", borderLeft: `3px solid ${C.border}` }}>
              <div style={{ marginBottom: 16 }}><Icon type={WATCH_ICONS[i]} color={WATCH_COLORS[i]} size={22} /></div>
              <div style={{ fontSize: 14, fontWeight: 700, color: C.heading, letterSpacing: 0.5, marginBottom: 10 }}>{f.title}</div>
              <div style={{ fontFamily: BODY_FONT, fontSize: 13, color: C.body, lineHeight: 1.7 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Verify */}
      <section ref={setRef("verify")} data-section="verify" style={{ padding: pad, maxWidth: 700, margin: "0 auto" }}>
        <SL num={t.verify.num} text={t.verify.label} />
        <ST>{t.verify.t1}<br /><span style={{ color: "#00f0ff" }}>{t.verify.t2}</span></ST>
        <p style={{ fontFamily: BODY_FONT, fontSize: 13, color: C.secondary, marginBottom: m ? 32 : 48, lineHeight: 1.6 }}>{t.verify.desc}</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {t.verify.steps.map((step) => {
            const ch = !!checks[step.id];
            return (
              <div key={step.id} onClick={() => toggleCheck(step.id)} style={{ display: "grid", gridTemplateColumns: m ? "40px 1fr" : "48px 1fr", alignItems: "center", padding: m ? "14px 12px" : "18px 24px", background: ch ? "rgba(0,240,255,0.04)" : C.bgCard, borderLeft: `3px solid ${ch ? "#00f0ff" : C.border}`, cursor: "pointer", transition: "all 0.3s", userSelect: "none" }}>
                <div style={{ width: 22, height: 22, border: `2px solid ${ch ? "#00f0ff" : C.subtle}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, color: "#00f0ff", background: ch ? "rgba(0,240,255,0.1)" : "transparent", transition: "all 0.3s" }}>{ch ? "✓" : ""}</div>
                <div>
                  <div style={{ fontSize: m ? 12 : 13, fontWeight: 700, color: ch ? C.heading : C.link, letterSpacing: 0.5 }}>{step.label}</div>
                  <div style={{ fontFamily: BODY_FONT, fontSize: 11, color: C.muted, marginTop: 3 }}>{step.detail}</div>
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ marginTop: 28 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 10, color: C.muted, letterSpacing: 2 }}>{t.verify.progress}</span>
            <span style={{ fontSize: 10, letterSpacing: 2, fontWeight: 700, color: allChecked ? "#00f0ff" : "#ff3e3e" }}>{checkedCount}/{t.verify.steps.length}</span>
          </div>
          <div style={{ height: 3, background: C.border, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${(checkedCount / t.verify.steps.length) * 100}%`, background: allChecked ? "linear-gradient(90deg,#00f0ff,#00ff88)" : "linear-gradient(90deg,#ff3e3e,#ff8800)", transition: "all 0.5s ease-out" }} />
          </div>
        </div>
        {allChecked && (
          <div style={{ marginTop: 36, padding: m ? "20px 16px" : "24px 32px", background: "rgba(0,240,255,0.04)", border: "1px solid rgba(0,240,255,0.2)", textAlign: "center" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#00f0ff", letterSpacing: 2, marginBottom: 8 }}>{t.verify.done}</div>
            <div style={{ fontFamily: BODY_FONT, fontSize: 12, color: C.secondary }}>{t.verify.doneDesc}</div>
          </div>
        )}
      </section>

      <footer style={{ position: "relative", background: C.bg, padding: m ? "40px 16px" : "60px 20px", textAlign: "center", borderTop: `1px solid ${C.borderLight}` }}>
        <div style={{ fontSize: 20, fontWeight: 900, color: C.footer, letterSpacing: 4 }}>ARENA <span style={{ color: "#ff3e3e" }}>1</span></div>
        <div style={{ fontSize: 10, color: C.footer, letterSpacing: 3, marginTop: 8 }}>{t.footer}</div>
        <div style={{ fontSize: 10, color: C.footer, letterSpacing: 2, marginTop: 16, opacity: 0.5 }}>developed by <a href="https://selzio.com" target="_blank" rel="noopener noreferrer" style={{ color: "inherit", textDecoration: "underline" }}>selzio.com</a></div>
      </footer>
    </div>
  );
};

export default Championship;
