import { useState, useEffect, type FC } from "react";
import { useLang } from "../hooks/useLang";
import { useIsMobile } from "../hooks/useIsMobile";
import { ELOCUP } from "../data/elocup";
import { useAnnounceData } from "../hooks/useAnnounceData";
import { useParallax } from "../hooks/useParallax";
import { BODY_FONT } from "../components/UI";
import { C } from "../theme";

const AC = "#4ade80";
const ACS = C.accent;

const pad = (n: number) => String(n).padStart(2, "0");

const Countdown: FC<{ target: Date; labels: [string, string, string, string]; mob: boolean }> = ({ target, labels, mob }) => {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = Math.max(0, target.getTime() - now);
  const vals = [
    Math.floor(diff / 86400000),
    Math.floor(diff / 3600000) % 24,
    Math.floor(diff / 60000) % 60,
    Math.floor(diff / 1000) % 60,
  ];
  return (
    <div style={{ display: "flex", gap: mob ? 8 : 14, justifyContent: "center" }}>
      {vals.map((v, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: mob ? 8 : 14 }}>
          <div style={{ textAlign: "center", minWidth: mob ? 58 : 86, padding: mob ? "10px 6px" : "16px 10px", background: C.bgCard, border: `1px solid ${C.accentBorder}` }}>
            <div style={{ fontSize: mob ? 26 : 44, fontWeight: 900, color: C.heading, fontFamily: "'Xolonium','Tektur',monospace", lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>
              {pad(v)}
            </div>
            <div style={{ fontSize: mob ? 9 : 10, letterSpacing: mob ? 1.5 : 2, color: C.muted, textTransform: "uppercase", marginTop: 8, fontWeight: 700 }}>
              {labels[i]}
            </div>
          </div>
          {i < 3 && <div style={{ fontSize: mob ? 18 : 28, fontWeight: 900, color: ACS, lineHeight: 1 }}>:</div>}
        </div>
      ))}
    </div>
  );
};

const Announce: FC = () => {
  const { lang } = useLang();
  const t = ELOCUP[lang];
  const mob = useIsMobile();
  const { announces, loading } = useAnnounceData();
  const heroRef = useParallax<HTMLDivElement>(0.3);
  const main = announces[0];
  const rest = announces.slice(1);
  const mainDate = main?.date ?? null;

  return (
    <div style={{ overflowX: "hidden" }}>

      {/* Hero */}
      <section style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", position: "relative", padding: mob ? "140px 16px 32px" : "160px 20px 36px", textAlign: "center", background: `radial-gradient(ellipse at 50% 20%,rgba(var(--glow-rgb),0.06) 0%,transparent 60%)` }}>
        <div ref={heroRef} style={{ position: "relative", zIndex: 1, maxWidth: 700, width: "100%" }}>
          <div style={{ fontSize: mob ? 10 : 12, letterSpacing: mob ? 3 : 5, color: ACS, marginBottom: 12, fontWeight: 600 }}>{t.hero.tag}</div>
          <h1 style={{ fontSize: "clamp(28px,6vw,64px)", fontWeight: 900, margin: 0, lineHeight: 1, letterSpacing: -1, color: C.heading, whiteSpace: "nowrap" }}>
            {t.hero.t1}{t.hero.t1 && " "}<span style={{ color: ACS }}>{t.hero.t2}</span>
          </h1>
          <div style={{ fontFamily: BODY_FONT, fontSize: mob ? 12 : 14, color: C.body, lineHeight: 1.7, maxWidth: 520, margin: "16px auto 0" }}>{t.hero.sub}</div>
        </div>
      </section>

      {/* Announce — ближайший кубок крупно с отсчётом, следующие списком */}
      {!loading && main && (
        <section style={{ padding: mob ? "32px 16px 0" : "60px 20px 0", maxWidth: 900, margin: "0 auto" }}>
          <div style={{
            position: "relative",
            border: `1px solid ${C.accentBorder}`,
            // solid подложка: клетка фона не должна просвечивать внутрь рамки
            background: `radial-gradient(ellipse at 50% 0%,rgba(var(--glow-rgb),0.07) 0%,transparent 70%) ${C.bg}`,
            padding: mob ? "28px 16px 28px" : "48px 32px 44px",
            textAlign: "center",
          }}>
            {/* углы рамки */}
            {[{ top: -1, left: -1, borderWidth: "2px 0 0 2px" }, { top: -1, right: -1, borderWidth: "2px 2px 0 0" }, { bottom: -1, left: -1, borderWidth: "0 0 2px 2px" }, { bottom: -1, right: -1, borderWidth: "0 2px 2px 0" }].map((p, i) => (
              <div key={i} style={{ position: "absolute", width: 14, height: 14, borderStyle: "solid", borderColor: ACS, ...p }} />
            ))}

            <div style={{ fontSize: mob ? 10 : 11, letterSpacing: mob ? 2 : 4, color: ACS, fontWeight: 700, textTransform: "uppercase" }}>
              {t.next.num} · {t.next.label}
            </div>
            <h2 style={{ fontSize: "clamp(24px,5.5vw,52px)", fontWeight: 900, color: C.heading, margin: "14px 0 0", lineHeight: 1.1, fontFamily: "'Xolonium','Tektur',sans-serif", letterSpacing: 1 }}>
              {main.name}
            </h2>
            <div style={{ fontFamily: BODY_FONT, fontSize: mob ? 12 : 14, color: ACS, fontWeight: 700, marginTop: 12, letterSpacing: 1 }}>
              {main.rawDate}
            </div>
            {main.details.length > 0 && (
              <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 4 }}>
                {main.details.map((d, i) => (
                  <div key={i} style={{ fontFamily: BODY_FONT, fontSize: mob ? 11 : 12, color: C.body, lineHeight: 1.6 }}>{d}</div>
                ))}
              </div>
            )}

            {mainDate && (
              <div style={{ marginTop: mob ? 24 : 32 }}>
                <Countdown target={mainDate} labels={t.next.cd} mob={mob} />
              </div>
            )}

            <div style={{ display: "flex", gap: mob ? 10 : 14, justifyContent: "center", alignItems: "stretch", flexWrap: "wrap", marginTop: mob ? 24 : 32 }}>
              {main.link && (
                <a href={main.link} target="_blank" rel="noopener noreferrer" style={{
                  display: "inline-block",
                  background: ACS, color: C.accentContrast,
                  fontFamily: "'Xolonium','Tektur',sans-serif", fontSize: mob ? 11 : 12, fontWeight: 800,
                  letterSpacing: 2, textTransform: "uppercase", textDecoration: "none",
                  padding: mob ? "13px 24px" : "15px 36px",
                }}>{t.next.cta} ↗</a>
              )}
              {main.bracketUrl && (
                <a href={main.bracketUrl} target="_blank" rel="noopener noreferrer" style={{
                  display: "inline-block",
                  border: `1px solid ${C.accentBorder}`, color: ACS,
                  fontFamily: "'Xolonium','Tektur',sans-serif", fontSize: mob ? 11 : 12, fontWeight: 800,
                  letterSpacing: 2, textTransform: "uppercase", textDecoration: "none",
                  padding: mob ? "12px 24px" : "14px 36px",
                }}>{t.archive.bracket} ↗</a>
              )}
            </div>
          </div>

          {/* Следующие кубки — компактный список */}
          {rest.length > 0 && (
            <div style={{ marginTop: mob ? 20 : 28 }}>
              <div style={{ fontSize: 10, letterSpacing: 2, color: C.muted, fontWeight: 700, textTransform: "uppercase", marginBottom: 8 }}>
                {t.next.upcoming}
              </div>
              {rest.map((a, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: mob ? 10 : 16,
                  padding: mob ? "11px 12px" : "13px 18px",
                  background: C.bgCard, border: `1px solid ${C.border}`,
                  borderTop: i > 0 ? "none" : `1px solid ${C.border}`,
                }}>
                  <div style={{ fontFamily: BODY_FONT, fontSize: mob ? 10 : 11, color: ACS, fontWeight: 700, whiteSpace: "nowrap", flexShrink: 0 }}>
                    {a.rawDate}
                  </div>
                  <div style={{ fontSize: mob ? 11 : 12, fontWeight: 800, color: C.heading, letterSpacing: 0.5, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {a.name}
                  </div>
                  <div style={{ marginLeft: "auto", display: "flex", gap: mob ? 8 : 12, flexShrink: 0, alignItems: "center" }}>
                    {a.bracketUrl && (
                      <a href={a.bracketUrl} target="_blank" rel="noopener noreferrer" style={{ fontFamily: BODY_FONT, fontSize: 11, color: ACS, textDecoration: "none", whiteSpace: "nowrap" }}>
                        {lang === "ru" ? "сетка" : "bracket"} ↗
                      </a>
                    )}
                    {a.link && (
                      <a href={a.link} target="_blank" rel="noopener noreferrer" style={{ fontFamily: BODY_FONT, fontSize: 11, color: C.muted, textDecoration: "none", whiteSpace: "nowrap" }}>
                        {lang === "ru" ? "инфо" : "info"} ↗
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      <footer style={{ padding: mob ? "40px 16px" : "60px 20px", textAlign: "center", borderTop: `1px solid ${C.borderLight}`, marginTop: mob ? 60 : 100 }}>
        <div style={{ fontSize: 16, fontWeight: 900, color: C.footer, letterSpacing: 4 }}>ARENA <span style={{ color: ACS }}>1</span></div>
        <div style={{ fontSize: 10, color: C.footer, letterSpacing: 3, marginTop: 8 }}>{t.footer}</div>
        <div style={{ fontSize: 10, color: C.footer, letterSpacing: 2, marginTop: 16, opacity: 0.5 }}>developed by <a href="https://selzio.com" target="_blank" rel="noopener noreferrer" style={{ color: "inherit", textDecoration: "underline" }}>selzio.com</a></div>
      </footer>
    </div>
  );
};

export default Announce;
