import { type FC } from "react";
import { Link } from "react-router-dom";
import { useLang } from "../hooks/useLang";
import { useIsMobile } from "../hooks/useIsMobile";
import { JOIN } from "../data/join";
import { SL, ST, BODY_FONT } from "../components/UI";
import { Seo } from "../components/Seo";
import { C } from "../theme";

const AC = "#4ade80"; // зелёный для hex-opacity паттернов
const ACS = C.accent; // solid accent — CSS var, тёмный в светлой теме

const btnSolid = (mob: boolean) => ({
  display: "inline-block", textDecoration: "none", textAlign: "center" as const,
  padding: mob ? "12px 24px" : "13px 32px",
  background: ACS, border: "none", color: C.accentContrast,
  fontSize: mob ? 11 : 12, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase" as const,
  cursor: "pointer", fontFamily: "'Xolonium','Tektur',monospace",
});

const btnGhost = (mob: boolean) => ({
  display: "inline-block", textDecoration: "none", textAlign: "center" as const,
  padding: mob ? "12px 24px" : "13px 32px",
  background: "transparent", border: `1px solid ${ACS}`, color: ACS,
  fontSize: mob ? 11 : 12, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase" as const,
  cursor: "pointer", fontFamily: "'Xolonium','Tektur',monospace",
});

const Join: FC = () => {
  const { lang } = useLang();
  const t = JOIN[lang];
  const mob = useIsMobile();
  const pad = mob ? "56px 16px" : "100px 20px";

  return (
    <div>
      <Seo path="/join" title={t.seoTitle} description={t.seoDesc} />

      {/* Hero */}
      <section style={{
        minHeight: "62vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center",
        position: "relative", padding: mob ? "100px 16px 40px" : "120px 20px 56px", textAlign: "center",
        background: "radial-gradient(ellipse at 50% 30%,rgba(74,222,128,0.07) 0%,transparent 60%)",
      }}>
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage: `linear-gradient(rgba(74,222,128,var(--grid-line)) 1px,transparent 1px),linear-gradient(90deg,rgba(74,222,128,var(--grid-line)) 1px,transparent 1px)`,
          backgroundSize: "60px 60px" }} />
        <div style={{ position: "relative", zIndex: 1, maxWidth: 720, width: "100%" }}>
          <div style={{ fontSize: mob ? 10 : 12, letterSpacing: mob ? 3 : 5, color: ACS, marginBottom: 18, fontWeight: 600 }}>{t.tag}</div>
          <h1 style={{ fontSize: "clamp(28px,6vw,64px)", fontWeight: 900, margin: 0, lineHeight: 1.1, color: C.heading }}>
            {t.h1}<br /><span style={{ color: ACS }}>{t.h2}</span>
          </h1>
          <p style={{ fontFamily: BODY_FONT, fontSize: mob ? 13 : 15, color: C.body, marginTop: 26, lineHeight: 1.8, maxWidth: 580, marginLeft: "auto", marginRight: "auto" }}>{t.intro}</p>
          <Link to="/divisions" style={{ ...btnGhost(mob), marginTop: mob ? 28 : 36 }}>{t.introLink}</Link>
        </div>
      </section>

      {/* Способы подачи заявки */}
      <section style={{ padding: pad, maxWidth: 900, margin: "0 auto" }}>
        <SL num={t.steps.num} text={t.steps.label} color={ACS} />
        <ST>{t.steps.t1}<br /><span style={{ color: ACS }}>{t.steps.t2}</span></ST>
        <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "repeat(2,1fr)", gap: 2 }}>
          {t.paths.map((p) => (
            <div key={p.kind} style={{ background: C.bgCard, padding: mob ? "24px 18px" : "32px 28px", borderTop: `3px solid ${ACS}`, display: "flex", flexDirection: "column" }}>
              <div style={{ fontSize: 11, letterSpacing: 2, color: ACS, fontWeight: 700, textTransform: "uppercase", marginBottom: 8 }}>{p.tag}</div>
              <div style={{ fontSize: mob ? 17 : 20, fontWeight: 800, color: C.heading, letterSpacing: 0.5, marginBottom: 18 }}>{p.title}</div>
              <ol style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 12, flex: 1 }}>
                {p.items.map((item, i) => (
                  <li key={i} style={{ display: "grid", gridTemplateColumns: "22px 1fr", gap: 10, alignItems: "start" }}>
                    <span style={{ fontFamily: "'Xolonium','Tektur',monospace", fontSize: 13, fontWeight: 900, color: ACS, opacity: 0.5 }}>{i + 1}</span>
                    <span style={{ fontFamily: BODY_FONT, fontSize: 13, color: C.body, lineHeight: 1.7 }}>{item}</span>
                  </li>
                ))}
              </ol>
              {"code" in p && p.code && (
                <div style={{ marginTop: 16, padding: "12px 16px", background: `${AC}0f`, border: `1px solid ${AC}33`, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                  <span style={{ fontFamily: BODY_FONT, fontSize: 11, letterSpacing: 1, color: C.muted, textTransform: "uppercase" }}>{p.codeLabel}</span>
                  <span style={{ fontFamily: "'Xolonium','Tektur',monospace", fontSize: mob ? 16 : 18, fontWeight: 800, color: ACS, letterSpacing: 2, userSelect: "all" }}>{p.code}</span>
                </div>
              )}
              <a href={p.url} target="_blank" rel="noopener noreferrer" style={{ ...btnSolid(mob), marginTop: 20 }}>{p.btn}</a>
            </div>
          ))}
        </div>
      </section>

      {/* qlstats рекомендация */}
      <section style={{ padding: pad, maxWidth: 760, margin: "0 auto" }}>
        <SL num={t.ql.num} text={t.ql.label} color={ACS} />
        <div style={{ background: C.bgCard, padding: mob ? "24px 18px" : "32px 32px", borderLeft: `3px solid ${ACS}` }}>
          <div style={{ fontSize: mob ? 15 : 18, fontWeight: 800, color: C.heading, letterSpacing: 0.5, marginBottom: 12 }}>{t.ql.title}</div>
          <p style={{ fontFamily: BODY_FONT, fontSize: 13, color: C.body, lineHeight: 1.8, margin: "0 0 22px" }}>{t.ql.text}</p>
          <a href="https://qlstats.net/" target="_blank" rel="noopener noreferrer" style={btnGhost(mob)}>{t.ql.btn}</a>
        </div>
      </section>

      {/* CTA — Discord */}
      <section style={{ padding: pad, maxWidth: 600, margin: "0 auto", textAlign: "center" }}>
        <SL num={t.cta.num} text={t.cta.label} color={ACS} />
        <ST>{t.cta.t1}<br /><span style={{ color: ACS }}>{t.cta.t2}</span></ST>
        <p style={{ fontFamily: BODY_FONT, fontSize: 13, color: C.secondary, margin: "0 auto 32px", maxWidth: 480, lineHeight: 1.7 }}>{t.cta.text}</p>
        <a href={t.paths[1].url} target="_blank" rel="noopener noreferrer" style={btnSolid(mob)}>{t.cta.btn}</a>
      </section>

      <footer style={{ padding: mob ? "40px 16px" : "60px 20px", textAlign: "center", borderTop: `1px solid ${AC}14` }}>
        <div style={{ fontSize: 16, fontWeight: 900, color: C.footer, letterSpacing: 4 }}>ARENA <span style={{ color: ACS }}>1</span></div>
        <div style={{ fontSize: 10, color: C.footer, letterSpacing: 3, marginTop: 8 }}>{t.footer}</div>
        <div style={{ fontSize: 10, color: C.footer, letterSpacing: 2, marginTop: 16, opacity: 0.5 }}>developed by <a href="https://selzio.com" target="_blank" rel="noopener noreferrer" style={{ color: "inherit", textDecoration: "underline" }}>selzio.com</a></div>
      </footer>
    </div>
  );
};

export default Join;
