import { useState, useEffect, type FC } from "react";
import { useLang } from "../hooks/useLang";
import { useTheme } from "../hooks/useTheme";
import { useIsMobile } from "../hooks/useIsMobile";
import { ELOCUP } from "../data/elocup";
import { useAnnounceData, type CupAnnounce } from "../hooks/useAnnounceData";
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
          <div style={{ textAlign: "center", minWidth: mob ? 32 : 58 }}>
            {/* CRT-сканлайны вырезаны прямо в глифах цифры (background-clip: text) */}
            <div style={{
              fontSize: mob ? 28 : 54, fontWeight: 900, fontFamily: "'Xolonium','Tektur',monospace",
              lineHeight: 1, fontVariantNumeric: "tabular-nums",
              color: "transparent", WebkitTextFillColor: "transparent",
              backgroundImage: "repeating-linear-gradient(0deg, var(--text-heading) 0 2px, transparent 2px 4px)",
              WebkitBackgroundClip: "text", backgroundClip: "text",
              // свечение по штрихам — эффект глубины/объёма
              filter: "drop-shadow(0 0 5px rgba(var(--glow-rgb),0.55)) drop-shadow(0 0 14px rgba(var(--glow-rgb),0.28))",
            }}>
              {pad(v)}
            </div>
            <div style={{ fontSize: mob ? 8 : 10, letterSpacing: mob ? 1 : 2.5, color: C.muted, textTransform: "uppercase", marginTop: 10, fontWeight: 700 }}>
              {labels[i]}
            </div>
          </div>
          {i < 3 && (
            <div style={{
              fontSize: mob ? 28 : 54, fontWeight: 300, lineHeight: 1, fontFamily: "'Xolonium','Tektur',monospace",
              color: "transparent", WebkitTextFillColor: "transparent",
              backgroundImage: "repeating-linear-gradient(0deg, var(--text-heading) 0 2px, transparent 2px 4px)",
              WebkitBackgroundClip: "text", backgroundClip: "text",
              filter: "drop-shadow(0 0 5px rgba(var(--glow-rgb),0.55)) drop-shadow(0 0 14px rgba(var(--glow-rgb),0.28))",
            }}>:</div>
          )}
        </div>
      ))}
    </div>
  );
};

type T = (typeof ELOCUP)["ru"];

// крупный баннер одного датированного анонса (с обратным отсчётом)
const CupBanner: FC<{ cup: CupAnnounce; mob: boolean; t: T }> = ({ cup, mob, t }) => (
  <div style={{
    position: "relative",
    border: `1px solid ${C.accentBorder}`,
    background: `radial-gradient(ellipse at 50% 0%,rgba(var(--glow-rgb),0.14) 0%,transparent 72%) ${C.bg}`,
    boxShadow: `0 0 70px rgba(var(--glow-rgb),0.16)`,
    padding: mob ? "21px 12px 21px" : "36px 24px 33px",
    textAlign: "center",
  }}>
    {[{ top: -1, left: -1, borderWidth: "2px 0 0 2px" }, { top: -1, right: -1, borderWidth: "2px 2px 0 0" }, { bottom: -1, left: -1, borderWidth: "0 0 2px 2px" }, { bottom: -1, right: -1, borderWidth: "0 2px 2px 0" }].map((p, i) => (
      <div key={i} style={{ position: "absolute", width: 14, height: 14, borderStyle: "solid", borderColor: ACS, ...p }} />
    ))}

    <div style={{ fontFamily: BODY_FONT, fontSize: mob ? 11 : 13, letterSpacing: mob ? 1 : 1.5, color: ACS, fontWeight: 700 }}>
      {cup.rawDate}
    </div>
    <h2 style={{ fontSize: "clamp(24px,4.5vw,42px)", fontWeight: 900, color: C.heading, margin: mob ? "10px 0 0" : "14px 0 0", lineHeight: 1.05, fontFamily: "'Xolonium','Tektur',sans-serif", letterSpacing: -0.5, textShadow: `0 0 40px rgba(var(--glow-rgb),0.25)` }}>
      {cup.name.replace(/\b(div)\s+(\d)/i, (_m, a, b) => a + String.fromCharCode(160) + b)}
    </h2>
    {cup.details.length > 0 && (
      <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 5 }}>
        {cup.details.map((d, i) => {
          const isElo = /elo\s*limit/i.test(d);
          return (
            <div key={i} style={{ fontFamily: BODY_FONT, fontSize: isElo ? (mob ? 13 : 15) : (mob ? 11 : 12), color: isElo ? C.heading : C.body, fontWeight: isElo ? 800 : 500, lineHeight: 1.6, letterSpacing: 0.3 }}>{d}</div>
          );
        })}
      </div>
    )}
    {cup.date && (
      <div style={{ marginTop: mob ? 24 : 33 }}>
        <Countdown target={cup.date} labels={t.next.cd} mob={mob} />
      </div>
    )}
    <div style={{ display: "flex", gap: mob ? 10 : 14, justifyContent: "center", alignItems: "stretch", flexWrap: "wrap", marginTop: mob ? 18 : 24 }}>
      {cup.link && (
        <a href={cup.link} target="_blank" rel="noopener noreferrer" style={{
          display: "inline-block", background: ACS, color: C.accentContrast,
          fontFamily: "'Xolonium','Tektur',sans-serif", fontSize: mob ? 10 : 11, fontWeight: 800,
          letterSpacing: 1.5, textTransform: "uppercase", textDecoration: "none",
          padding: mob ? "10px 18px" : "11px 26px", transition: "box-shadow 0.25s ease",
        }}
          onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 0 28px rgba(var(--glow-rgb),0.6)")}
          onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
        >{t.next.cta} ↗︎</a>
      )}
      {cup.bracketUrl && (
        <a href={cup.bracketUrl} target="_blank" rel="noopener noreferrer" style={{
          display: "inline-block", border: `1px solid ${C.accentBorder}`, color: ACS,
          fontFamily: "'Xolonium','Tektur',sans-serif", fontSize: mob ? 10 : 11, fontWeight: 800,
          letterSpacing: 1.5, textTransform: "uppercase", textDecoration: "none",
          padding: mob ? "9px 18px" : "10px 26px", transition: "box-shadow 0.25s ease, border-color 0.25s ease",
        }}
          onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 0 24px rgba(var(--glow-rgb),0.45)"; e.currentTarget.style.borderColor = ACS; }}
          onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = C.accentBorder; }}
        >{t.archive.bracket} ↗︎</a>
      )}
    </div>
  </div>
);

const Announce: FC = () => {
  const { lang } = useLang();
  const { theme } = useTheme();
  const light = theme === "light";
  const t = ELOCUP[lang];
  const mob = useIsMobile();
  const { announces, loading } = useAnnounceData();
  const heroRef = useParallax<HTMLDivElement>(0.3);
  const dated = announces.filter((a) => a.date !== null);   // крупными баннерами
  const undated = announces.filter((a) => a.date === null); // строкой в списке

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
      <section style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", position: "relative", padding: mob ? "92px 16px 12px" : "120px 20px 24px", textAlign: "center", background: `radial-gradient(ellipse at 50% 20%,rgba(var(--glow-rgb),0.06) 0%,transparent 60%)` }}>
        <div ref={heroRef} style={{ position: "relative", zIndex: 1, maxWidth: 700, width: "100%" }}>
          <img src="/quake-live-logo.png" alt="Quake Live" style={{ display: "block", height: mob ? 44 : 52, width: "auto", margin: "0 auto 14px" }} />
          <h1 style={{ fontSize: "clamp(24px,4.5vw,42px)", fontWeight: 900, margin: 0, lineHeight: 1.05, letterSpacing: -0.5, color: C.heading }}>
            {t.hero.t1}{t.hero.t1 && " "}<span style={{ color: ACS }}>{t.hero.t2}</span>
          </h1>
          <div style={{ fontFamily: BODY_FONT, fontSize: mob ? 12 : 14, color: C.body, lineHeight: 1.7, maxWidth: 520, margin: "16px auto 0" }}>{t.hero.sub}</div>
        </div>
      </section>

      {/* Announce — ближайший кубок крупно с отсчётом, следующие списком */}
      {!loading && announces.length > 0 && (
        <section style={{ position: "relative", padding: mob ? "8px 16px 0" : "16px 20px 0", maxWidth: 900, margin: "0 auto" }}>
          {/* контент анонса — проявляется после интро */}
          <div style={{
            opacity: introDone ? 1 : 0,
            transform: introDone ? "translateY(0)" : "translateY(12px)",
            transition: "opacity 0.3s ease, transform 0.3s ease",
          }}>
          {/* каждый датированный кубок — крупным баннером */}
          {dated.map((cup, idx) => (
            <div key={idx} style={{ marginTop: idx > 0 ? (mob ? 16 : 28) : 0 }}>
              <CupBanner cup={cup} mob={mob} t={t} />
            </div>
          ))}

          {/* кубки без даты — компактным списком */}
          {undated.length > 0 && (
            <div style={{ marginTop: mob ? 20 : 28 }}>
              <div style={{ fontSize: 10, letterSpacing: 2, color: C.muted, fontWeight: 700, textTransform: "uppercase", marginBottom: 8 }}>
                {t.next.upcoming}
              </div>
              {undated.map((a, i) => {
                // ELO-лимит из деталей (значение после "Elo limit:")
                const eloDetail = a.details.find((d) => /elo\s*limit/i.test(d));
                const elo = eloDetail ? eloDetail.replace(/.*elo\s*limit:?\s*/i, "").trim() : "";
                return (
                  <div key={i} style={{
                    display: "flex", alignItems: "center", gap: mob ? 8 : 14,
                    padding: mob ? "11px 12px" : "13px 18px",
                    background: C.bgCard, border: `1px solid ${C.border}`,
                    borderTop: i > 0 ? "none" : `1px solid ${C.border}`,
                  }}>
                    {/* 1. Название */}
                    <div style={{ fontSize: mob ? 11 : 12, fontWeight: 800, color: C.heading, letterSpacing: 0.5, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flexShrink: 0 }}>
                      {a.name}
                    </div>
                    {/* 2. ELO */}
                    {elo && (
                      <div style={{ fontFamily: BODY_FONT, fontSize: mob ? 10 : 11, color: ACS, fontWeight: 700, whiteSpace: "nowrap", flexShrink: 0 }}>
                        ELO {elo}
                      </div>
                    )}
                    {/* 3. Дата уточняется */}
                    <div style={{ fontFamily: BODY_FONT, fontSize: mob ? 10 : 11, color: C.muted, whiteSpace: "nowrap" }}>
                      {lang === "ru" ? "дата уточняется" : "date TBA"}
                    </div>
                    {/* Участвовать → Discord */}
                    <a href={a.link} target="_blank" rel="noopener noreferrer" style={{ marginLeft: "auto", fontFamily: BODY_FONT, fontSize: 11, color: ACS, fontWeight: 700, textDecoration: "none", whiteSpace: "nowrap", flexShrink: 0 }}>
                      {lang === "ru" ? "Участвовать" : "Join"} ↗︎
                    </a>
                  </div>
                );
              })}
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
                invert={light}
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
