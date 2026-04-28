import { useEffect, useRef, useState, type FC } from "react";
import { useLang } from "../hooks/useLang";
import { useIsMobile } from "../hooks/useIsMobile";
import { VER } from "../data/verified";
import { ScanLine, SL, ST, BODY_FONT } from "../components/UI";
import { Icon } from "../components/Icons";

const PROB_C = ["#ff3e3e", "#ffd700", "#00f0ff", "#ff3e3e"];
const WHO_C = ["#ff3e3e", "#ffd700", "#00f0ff"];
const WHO_I = ["users", "steps", "eye"] as const;
const WHY_I = ["trophy", "globe", "eye", "lock"] as const;
const WHY_C = ["#ff3e3e", "#00f0ff", "#ffd700", "#ff3e3e"];
const RANK_C: Record<number, string> = { 1: "#fbbf24", 2: "#94a3b8", 3: "#cd7f32" };
const NAV_IDS = ["hero", "problem", "how", "who", "why", "players", "cta"];

const Verified: FC = () => {
  const { lang } = useLang();
  const t = VER[lang];
  const mob = useIsMobile();
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
  const pad = mob ? "60px 16px" : "120px 20px";

  return (
    <div style={{ overflowX: "hidden" }}>
      <ScanLine />
      <nav style={{ position: "fixed", top: 48, left: 0, right: 0, zIndex: 99, background: "rgba(8,8,12,0.92)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(0,240,255,0.12)", display: "flex", justifyContent: mob ? "flex-start" : "center", overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
        {NAV_IDS.map((id, i) => (
          <button key={id} onClick={() => scrollTo(id)} style={{ background: "none", border: "none", cursor: "pointer", color: active === id ? "#00f0ff" : "#555", fontSize: mob ? 10 : 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", padding: mob ? "10px 8px" : "12px 12px", whiteSpace: "nowrap", borderBottom: active === id ? "2px solid #00f0ff" : "2px solid transparent", transition: "all 0.3s", fontFamily: "'Orbitron',sans-serif", flexShrink: 0 }}>{t.nav[i]}</button>
        ))}
      </nav>

      {/* Hero */}
      <section ref={setRef("hero")} data-section="hero" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", position: "relative", padding: mob ? "100px 16px 40px" : "120px 20px 40px", textAlign: "center", background: "radial-gradient(ellipse at 50% 30%,rgba(0,240,255,0.06) 0%,transparent 60%)" }}>
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", backgroundImage: "linear-gradient(rgba(0,240,255,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(0,240,255,0.02) 1px,transparent 1px)", backgroundSize: "60px 60px" }} />
        <div style={{ position: "relative", zIndex: 1, maxWidth: 700, width: "100%" }}>
          <div style={{ marginBottom: mob ? 24 : 40, display: "flex", justifyContent: "center" }}><Icon type="shield" color="#00f0ff" size={mob ? 36 : 48} /></div>
          <div style={{ fontSize: mob ? 9 : 11, letterSpacing: mob ? 3 : 6, color: "#00f0ff", marginBottom: 20, fontWeight: 600 }}>{t.hero.badge}</div>
          <h1 style={{ fontSize: "clamp(26px,6vw,64px)", fontWeight: 900, margin: 0, lineHeight: 1.1, color: "#fff" }}>{t.hero.t1}<br /><span style={{ color: "#00f0ff" }}>{t.hero.t2}</span></h1>
          <div style={{ fontFamily: BODY_FONT, fontSize: mob ? 13 : 15, color: "#888", marginTop: 28, lineHeight: 1.8, maxWidth: 560, margin: "28px auto 0" }}>{t.hero.text}</div>
          <button onClick={() => scrollTo("cta")} style={{ marginTop: mob ? 32 : 44, padding: mob ? "12px 28px" : "14px 40px", background: "#00f0ff", border: "none", color: "#08080c", fontSize: mob ? 11 : 12, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer", fontFamily: "'Orbitron',monospace" }}>{t.cta.btn1}</button>
        </div>
      </section>

      {/* Problem */}
      <section ref={setRef("problem")} data-section="problem" style={{ padding: pad, maxWidth: 860, margin: "0 auto" }}>
        <SL num={t.problem.num} text={t.problem.label} color="#00f0ff" />
        <ST>{t.problem.t1}<br /><span style={{ color: "#ff3e3e" }}>{t.problem.t2}</span></ST>
        <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "repeat(auto-fit,minmax(240px,1fr))", gap: 2, marginBottom: 32 }}>
          {t.problem.items.map((item, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,0.02)", padding: mob ? "20px 16px" : "28px 24px", borderTop: `3px solid ${PROB_C[i]}` }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: PROB_C[i], letterSpacing: 0.5, marginBottom: 12 }}>{item.title}</div>
              <div style={{ fontFamily: BODY_FONT, fontSize: 13, color: "#888", lineHeight: 1.7 }}>{item.desc}</div>
            </div>
          ))}
        </div>
        <div style={{ padding: mob ? "16px 16px" : "20px 28px", background: "rgba(255,62,62,0.04)", borderLeft: "3px solid #ff3e3e" }}>
          <div style={{ fontFamily: BODY_FONT, fontSize: mob ? 13 : 14, color: "#ff3e3e", lineHeight: 1.6, fontWeight: 500 }}>{t.problem.result}</div>
        </div>
      </section>

      {/* How */}
      <section ref={setRef("how")} data-section="how" style={{ padding: pad, maxWidth: 800, margin: "0 auto" }}>
        <SL num={t.how.num} text={t.how.label} color="#00f0ff" />
        <ST>{t.how.t1}<br /><span style={{ color: "#00f0ff" }}>{t.how.t2}</span></ST>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {t.how.steps.map((step, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: mob ? "40px 1fr" : "56px 1fr", alignItems: "start", padding: mob ? "16px 12px" : "24px", background: "rgba(255,255,255,0.02)", borderLeft: "3px solid #00f0ff" }}>
              <div style={{ fontSize: mob ? 18 : 24, fontWeight: 900, color: "#00f0ff", fontFamily: "'Orbitron',monospace", opacity: 0.4 }}>{step.num}</div>
              <div>
                <div style={{ fontSize: mob ? 13 : 15, fontWeight: 700, color: "#fff", letterSpacing: 0.5, marginBottom: 8 }}>{step.title}</div>
                <div style={{ fontFamily: BODY_FONT, fontSize: 13, color: "#888", lineHeight: 1.7 }}>{step.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Who */}
      <section ref={setRef("who")} data-section="who" style={{ padding: pad, maxWidth: 860, margin: "0 auto" }}>
        <SL num={t.who.num} text={t.who.label} color="#00f0ff" />
        <ST>{t.who.t1}<br /><span style={{ color: "#ffd700" }}>{t.who.t2}</span></ST>
        <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "repeat(auto-fit,minmax(250px,1fr))", gap: 2 }}>
          {t.who.items.map((item, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,0.02)", padding: mob ? "24px 16px" : "32px 24px", borderTop: `3px solid ${WHO_C[i]}` }}>
              <div style={{ marginBottom: 16 }}><Icon type={WHO_I[i]} color={WHO_C[i]} size={24} /></div>
              <div style={{ fontSize: 15, fontWeight: 800, color: WHO_C[i], letterSpacing: 0.5, marginBottom: 14 }}>{item.title}</div>
              <div style={{ fontFamily: BODY_FONT, fontSize: 13, color: "#888", lineHeight: 1.8 }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Why */}
      <section ref={setRef("why")} data-section="why" style={{ padding: pad, maxWidth: 860, margin: "0 auto" }}>
        <SL num={t.why.num} text={t.why.label} color="#00f0ff" />
        <ST>{t.why.t1}<br /><span style={{ color: "#00f0ff" }}>{t.why.t2}</span></ST>
        <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "repeat(auto-fit,minmax(200px,1fr))", gap: 2 }}>
          {t.why.items.map((item, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,0.02)", padding: mob ? "20px 16px" : "28px 24px", borderLeft: `3px solid ${WHY_C[i]}` }}>
              <div style={{ marginBottom: 14 }}><Icon type={WHY_I[i]} color={WHY_C[i]} size={22} /></div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", letterSpacing: 0.5, marginBottom: 8 }}>{item.title}</div>
              <div style={{ fontFamily: BODY_FONT, fontSize: 12, color: "#888", lineHeight: 1.7 }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Players */}
      <section ref={setRef("players")} data-section="players" style={{ padding: pad, maxWidth: 860, margin: "0 auto" }}>
        <SL num={t.players.num} text={t.players.label} color="#00f0ff" />
        <ST>{t.players.t1}<br /><span style={{ color: "#00f0ff" }}>{t.players.t2}</span></ST>

        <div style={{ border: "1px solid #1a1a1a", overflow: "hidden" }}>
          {/* Table header */}
          <div style={{ display: "grid", gridTemplateColumns: mob ? "36px 1fr 60px" : "56px 1fr 100px 1fr", padding: mob ? "12px 12px" : "14px 24px", background: "rgba(0,240,255,0.04)", borderBottom: "1px solid #1a1a1a" }}>
            {(mob ? [t.players.cols.rank, t.players.cols.player, t.players.cols.elo] : [t.players.cols.rank, t.players.cols.player, t.players.cols.elo, t.players.cols.date]).map((col) => (
              <div key={col} style={{ fontSize: 9, letterSpacing: mob ? 1 : 3, color: "#555", textTransform: "uppercase", fontWeight: 700 }}>{col}</div>
            ))}
          </div>
          {/* Rows */}
          {t.players.list.map((p) => {
            const rc = RANK_C[p.rank];
            const isTop3 = p.rank <= 3;
            return (
              <div key={p.rank} style={{ display: "grid", gridTemplateColumns: mob ? "36px 1fr 60px" : "56px 1fr 100px 1fr", padding: mob ? "12px 12px" : "16px 24px", background: isTop3 ? `${rc}08` : "rgba(255,255,255,0.02)", borderTop: "1px solid rgba(255,255,255,0.03)", alignItems: "center" }}>
                <div style={{ fontFamily: "'Orbitron',monospace", fontSize: isTop3 ? (mob ? 14 : 16) : 13, fontWeight: isTop3 ? 900 : 600, color: rc ?? "#666" }}>{p.rank}</div>
                <div style={{ fontFamily: BODY_FONT, fontSize: mob ? 13 : 14, fontWeight: isTop3 ? 700 : 400, color: isTop3 ? "#fff" : "#aaa", letterSpacing: 0.5 }}>{p.player}</div>
                <div style={{ fontFamily: BODY_FONT, fontSize: mob ? 13 : 14, fontWeight: 700, color: "#4ade80" }}>{p.elo}</div>
                {!mob && <div style={{ fontFamily: BODY_FONT, fontSize: 12, color: "#555" }}>{p.date}</div>}
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section ref={setRef("cta")} data-section="cta" style={{ padding: pad, maxWidth: 600, margin: "0 auto", textAlign: "center" }}>
        <SL num={t.cta.num} text={t.cta.label} color="#00f0ff" />
        <ST>{t.cta.t1}<br /><span style={{ color: "#00f0ff" }}>{t.cta.t2}</span></ST>
        <p style={{ fontFamily: BODY_FONT, fontSize: 13, color: "#666", marginBottom: mob ? 32 : 48, lineHeight: 1.6 }}>{t.cta.desc}</p>
        <div style={{ display: "flex", gap: mob ? 12 : 16, justifyContent: "center", flexWrap: "wrap" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            <button style={{ padding: mob ? "12px 28px" : "14px 40px", background: "#00f0ff", border: "none", color: "#08080c", fontSize: mob ? 11 : 12, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer", fontFamily: "'Orbitron',monospace" }}>{t.cta.btn1}</button>
            <span style={{ fontFamily: BODY_FONT, fontSize: 10, color: "#555", letterSpacing: 2 }}>{t.cta.btn1sub}</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            <button style={{ padding: mob ? "12px 28px" : "14px 40px", background: "transparent", border: "1px solid #444", color: "#888", fontSize: mob ? 11 : 12, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer", fontFamily: "'Orbitron',monospace" }}>{t.cta.btn2}</button>
            <span style={{ fontFamily: BODY_FONT, fontSize: 10, color: "#555", letterSpacing: 2 }}>{t.cta.btn2sub}</span>
          </div>
        </div>
      </section>

      <footer style={{ padding: mob ? "40px 16px" : "60px 20px", textAlign: "center", borderTop: "1px solid rgba(0,240,255,0.08)" }}>
        <div style={{ fontFamily: BODY_FONT, fontSize: mob ? 13 : 14, color: "#666", fontStyle: "italic", lineHeight: 1.8, marginBottom: 24 }}>{t.fq1}<br /><span style={{ color: "#00f0ff", fontWeight: 500 }}>{t.fq2}</span></div>
        <div style={{ fontSize: 16, fontWeight: 900, color: "#333", letterSpacing: 4 }}>ARENA <span style={{ color: "#00f0ff" }}>1</span></div>
        <div style={{ fontSize: 10, color: "#333", letterSpacing: 3, marginTop: 8 }}>{t.footer}</div>
      </footer>
    </div>
  );
};

export default Verified;
