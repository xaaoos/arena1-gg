import { useState, useEffect, type FC } from "react";
import { useLang } from "../hooks/useLang";
import { useIsMobile } from "../hooks/useIsMobile";
import { ELOCUP } from "../data/elocup";
import { useAnnounceData } from "../hooks/useAnnounceData";
import { useParallax } from "../hooks/useParallax";
import { Seo } from "../components/Seo";
import { AsciiVideo } from "../components/AsciiVideo";
import { BODY_FONT } from "../components/UI";
import { C } from "../theme";

const ORG_JSONLD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Arena 1",
  url: "https://arena1.gg",
  logo: "https://arena1.gg/og-image.png",
  description: "Arena 1 — киберспортивный чемпионат по Quake (Arena FPS). The Premier League of Aim.",
  sameAs: ["https://discord.gg/dgPwNAph2j"],
};

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
    <div style={{ display: "flex", gap: mob ? 4 : 22, justifyContent: "center", alignItems: "flex-start" }}>
      {vals.map((v, i) => (
        <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: mob ? 4 : 22 }}>
          <div style={{ textAlign: "center", minWidth: mob ? 38 : 78 }}>
            {/* CRT-сканлайны вырезаны прямо в глифах цифры (background-clip: text) */}
            <div style={{
              fontSize: mob ? 32 : 72, fontWeight: 900, fontFamily: "'Xolonium','Tektur',monospace",
              lineHeight: 1, fontVariantNumeric: "tabular-nums",
              color: "transparent", WebkitTextFillColor: "transparent",
              backgroundImage: "repeating-linear-gradient(0deg, var(--text-heading) 0 3px, transparent 3px 4px)",
              WebkitBackgroundClip: "text", backgroundClip: "text",
            }}>
              {pad(v)}
            </div>
            <div style={{ fontSize: mob ? 8 : 10, letterSpacing: mob ? 1 : 2.5, color: C.muted, textTransform: "uppercase", marginTop: 10, fontWeight: 700 }}>
              {labels[i]}
            </div>
          </div>
          {i < 3 && (
            <div style={{ fontSize: mob ? 32 : 72, fontWeight: 300, color: `rgba(var(--glow-rgb),0.3)`, lineHeight: 1, fontFamily: "'Xolonium','Tektur',monospace" }}>:</div>
          )}
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

  // ASCII-интро играет при каждом заходе
  const [introDone, setIntroDone] = useState(false);   // клип доиграл → проявляем анонс
  const [introHidden, setIntroHidden] = useState(false); // overlay убран из DOM
  const finishIntro = () => setIntroDone(true);
  // фоллбэк: если автоплей видео заблокирован/не загрузилось — не держим анонс скрытым
  useEffect(() => {
    if (introDone) return;
    const id = setTimeout(finishIntro, 6000);
    return () => clearTimeout(id);
  }, [introDone]);

  return (
    <div style={{ overflowX: "hidden" }}>
      <Seo
        path="/"
        description="Arena 1 — киберспортивный чемпионат по Quake. Non-Pro Duel Cups: еженедельные дуэльные турниры с ELO-ограничениями. Анонсы, расписание, регистрация."
        jsonLd={ORG_JSONLD}
      />

      {/* Hero */}
      <section style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", position: "relative", padding: mob ? "120px 16px 16px" : "160px 20px 36px", textAlign: "center", background: `radial-gradient(ellipse at 50% 20%,rgba(var(--glow-rgb),0.06) 0%,transparent 60%)` }}>
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
        <section style={{ position: "relative", padding: mob ? "16px 16px 0" : "60px 20px 0", maxWidth: 900, margin: "0 auto" }}>
          {/* контент анонса — проявляется после интро */}
          <div style={{
            opacity: introDone ? 1 : 0,
            transform: introDone ? "translateY(0)" : "translateY(12px)",
            transition: "opacity 0.3s ease, transform 0.3s ease",
          }}>
          <div style={{
            position: "relative",
            border: `1px solid ${C.accentBorder}`,
            // solid подложка: клетка фона не должна просвечивать внутрь рамки
            background: `radial-gradient(ellipse at 50% 0%,rgba(var(--glow-rgb),0.14) 0%,transparent 72%) ${C.bg}`,
            boxShadow: `0 0 70px rgba(var(--glow-rgb),0.16)`,
            padding: mob ? "28px 16px 28px" : "48px 32px 44px",
            textAlign: "center",
          }}>
            {/* углы рамки */}
            {[{ top: -1, left: -1, borderWidth: "2px 0 0 2px" }, { top: -1, right: -1, borderWidth: "2px 2px 0 0" }, { bottom: -1, left: -1, borderWidth: "0 0 2px 2px" }, { bottom: -1, right: -1, borderWidth: "0 2px 2px 0" }].map((p, i) => (
              <div key={i} style={{ position: "absolute", width: 14, height: 14, borderStyle: "solid", borderColor: ACS, ...p }} />
            ))}

            {/* дата/время проведения — вместо метки "следующий турнир" */}
            <div style={{ fontFamily: BODY_FONT, fontSize: mob ? 11 : 13, letterSpacing: mob ? 1 : 1.5, color: ACS, fontWeight: 700 }}>
              {main.rawDate}
            </div>
            <h2 style={{ fontSize: "clamp(30px,7vw,64px)", fontWeight: 900, color: C.heading, margin: mob ? "14px 0 0" : "18px 0 0", lineHeight: 1.02, fontFamily: "'Xolonium','Tektur',sans-serif", letterSpacing: mob ? 0 : 1, textShadow: `0 0 40px rgba(var(--glow-rgb),0.25)` }}>
              {main.name}
            </h2>
            {main.details.length > 0 && (
              <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 5 }}>
                {main.details.map((d, i) => (
                  <div key={i} style={{ fontFamily: BODY_FONT, fontSize: mob ? 11 : 12, color: C.muted, lineHeight: 1.6, letterSpacing: 0.3 }}>{d}</div>
                ))}
              </div>
            )}

            {mainDate && (
              <div style={{ marginTop: mob ? 32 : 44 }}>
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
                  transition: "box-shadow 0.25s ease",
                }}
                  onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 0 28px rgba(var(--glow-rgb),0.6)")}
                  onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
                >{t.next.cta} ↗</a>
              )}
              {main.bracketUrl && (
                <a href={main.bracketUrl} target="_blank" rel="noopener noreferrer" style={{
                  display: "inline-block",
                  border: `1px solid ${C.accentBorder}`, color: ACS,
                  fontFamily: "'Xolonium','Tektur',sans-serif", fontSize: mob ? 11 : 12, fontWeight: 800,
                  letterSpacing: 2, textTransform: "uppercase", textDecoration: "none",
                  padding: mob ? "12px 24px" : "14px 36px",
                  transition: "box-shadow 0.25s ease, border-color 0.25s ease",
                }}
                  onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 0 24px rgba(var(--glow-rgb),0.45)"; e.currentTarget.style.borderColor = ACS; }}
                  onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = C.accentBorder; }}
                >{t.archive.bracket} ↗</a>
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
          {/* конец контента анонса */}
          </div>

          {/* ASCII-интро: играет один раз поверх анонса, затем затухает */}
          {!introHidden && (
            <div
              onTransitionEnd={() => { if (introDone) setIntroHidden(true); }}
              style={{
                position: "absolute", inset: 0, zIndex: 5,
                background: C.bg,
                display: "flex", alignItems: mob ? "flex-start" : "center", justifyContent: "center",
                padding: mob ? "4px 16px 0" : "0 20px",
                opacity: introDone ? 0 : 1,
                transition: "opacity 0.3s ease",
                pointerEvents: introDone ? "none" : "auto",
              }}
            >
              <AsciiVideo
                src={mob ? "/hero-ascii-v.mp4" : "/hero-ascii.mp4"}
                cols={mob ? 96 : 200}
                contrast={1.1} floor={0} ramp="classic" color={ACS}
                maxWidth={mob ? 1000 : 860}
                loop={false} onEnded={finishIntro}
              />
            </div>
          )}
        </section>
      )}

      <footer style={{ position: "relative", background: C.bg, padding: mob ? "40px 16px" : "60px 20px", textAlign: "center", borderTop: `1px solid ${C.borderLight}`, marginTop: mob ? 60 : 100 }}>
        <div style={{ fontSize: 16, fontWeight: 900, color: C.footer, letterSpacing: 4 }}>ARENA <span style={{ color: ACS }}>1</span></div>
        <div style={{ fontSize: 10, color: C.footer, letterSpacing: 3, marginTop: 8 }}>{t.footer}</div>
        <div style={{ fontSize: 10, color: C.footer, letterSpacing: 2, marginTop: 16, opacity: 0.5 }}>developed by <a href="https://selzio.com" target="_blank" rel="noopener noreferrer" style={{ color: "inherit", textDecoration: "underline" }}>selzio.com</a></div>
      </footer>
    </div>
  );
};

export default Announce;
