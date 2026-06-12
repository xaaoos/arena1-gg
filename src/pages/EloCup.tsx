import { useState, useEffect, useRef, type FC } from "react";
import { Link } from "react-router-dom";
import { useLang } from "../hooks/useLang";
import { useIsMobile } from "../hooks/useIsMobile";
import { ELOCUP } from "../data/elocup";
import { useArchiveData, formatArchiveDate, formatAnnounceDate, parseDate, type ArchiveCup, type CupAnnounce } from "../hooks/useArchiveData";
import { ScanLine, SL, ST, BODY_FONT } from "../components/UI";
import { Icon } from "../components/Icons";
import { C } from "../theme";

const AC = "#4ade80";
const ACS = C.accent;
const PLACE_C: Record<string, string> = { "1": C.place1, "2": C.place2, "3": C.place3 };

// ВРЕМЕННО: мок-анонсы для предпросмотра, пока Павел не завёл таблицу.
// Реальные строки-анонсы из таблицы архива автоматически вытесняют моки.
const MOCK_ANNOUNCES: CupAnnounce[] = [
  {
    name: "700–1300 ELO Cup",
    rawDate: "14.06.2026 19:00 MSK",
    link: "https://discord.gg/dgPwNAph2j",
    details: ["Duel 1v1 Bracket · dm6 + маппул", "Приз: 1 000 RUB + донаты"],
  },
  {
    name: "600–1200 ELO Cup",
    rawDate: "21.06.2026 19:00 MSK",
    link: "https://discord.gg/dgPwNAph2j",
    details: ["Duel 1v1 Bracket"],
  },
  {
    name: "1000–2000 ELO Cup",
    rawDate: "28.06.2026 19:00 MSK",
    link: "https://discord.gg/dgPwNAph2j",
    details: ["Duel 1v1 Bracket"],
  },
];

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
          <div style={{ textAlign: "center", minWidth: mob ? 58 : 86, padding: mob ? "10px 6px" : "16px 10px", background: C.bgCard, border: `1px solid ${AC}33` }}>
            <div style={{ fontSize: mob ? 26 : 44, fontWeight: 900, color: C.heading, fontFamily: "'Tektur',monospace", lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>
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

const EloCup: FC = () => {
  const { lang } = useLang();
  const t = ELOCUP[lang];
  const mob = useIsMobile();
  const { cups, announces, loading: archiveLoading, error: archiveError } = useArchiveData();
  // моки пока в таблице нет строк-анонсов
  const announceList = announces.length > 0 ? announces : MOCK_ANNOUNCES;
  const main = announceList[0];
  const rest = announceList.slice(1);
  const mainDate = main ? parseDate(main.rawDate) : null;
  const [selected, setSelected] = useState<ArchiveCup | null>(null);
  const archiveRef = useRef<HTMLElement | null>(null);

  return (
    <div style={{ overflowX: "hidden" }}>
      <ScanLine />

      {/* Hero */}
      <section style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", position: "relative", padding: mob ? "140px 16px 32px" : "160px 20px 36px", textAlign: "center", background: `radial-gradient(ellipse at 50% 20%,rgba(74,222,128,0.06) 0%,transparent 60%)` }}>
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", backgroundImage: `linear-gradient(rgba(74,222,128,var(--grid-line)) 1px,transparent 1px),linear-gradient(90deg,rgba(74,222,128,var(--grid-line)) 1px,transparent 1px)`, backgroundSize: "60px 60px" }} />
        <div style={{ position: "relative", zIndex: 1, maxWidth: 700, width: "100%" }}>
          <div style={{ fontSize: mob ? 10 : 12, letterSpacing: mob ? 3 : 5, color: ACS, marginBottom: 12, fontWeight: 600 }}>{t.hero.tag}</div>
          <h1 style={{ fontSize: "clamp(28px,6vw,64px)", fontWeight: 900, margin: 0, lineHeight: 1, letterSpacing: -1, color: C.heading, whiteSpace: "nowrap" }}>
            {t.hero.t1}{t.hero.t1 && " "}<span style={{ color: ACS }}>{t.hero.t2}</span>
          </h1>
          <div style={{ fontFamily: BODY_FONT, fontSize: mob ? 12 : 14, color: C.body, lineHeight: 1.7, maxWidth: 520, margin: "16px auto 0" }}>{t.hero.sub}</div>
        </div>
      </section>

      {/* Announce — ближайший кубок крупно с отсчётом, следующие списком */}
      {!archiveLoading && main && (
        <section style={{ padding: mob ? "32px 16px 0" : "60px 20px 0", maxWidth: 900, margin: "0 auto" }}>
          <div style={{
            position: "relative",
            border: `1px solid ${AC}44`,
            background: `radial-gradient(ellipse at 50% 0%,rgba(74,222,128,0.07) 0%,transparent 70%)`,
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
            <h2 style={{ fontSize: "clamp(24px,5.5vw,52px)", fontWeight: 900, color: C.heading, margin: "14px 0 0", lineHeight: 1.1, fontFamily: "'Tektur',sans-serif", letterSpacing: 1 }}>
              {main.name}
            </h2>
            <div style={{ fontFamily: BODY_FONT, fontSize: mob ? 12 : 14, color: ACS, fontWeight: 700, marginTop: 12, letterSpacing: 1 }}>
              {formatAnnounceDate(main.rawDate, lang)}
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

            {main.link && (
              <a href={main.link} target="_blank" rel="noopener noreferrer" style={{
                display: "inline-block", marginTop: mob ? 24 : 32,
                background: ACS, color: "#08080c",
                fontFamily: "'Tektur',sans-serif", fontSize: mob ? 11 : 12, fontWeight: 800,
                letterSpacing: 2, textTransform: "uppercase", textDecoration: "none",
                padding: mob ? "13px 24px" : "15px 36px",
              }}>{t.next.cta} ↗</a>
            )}
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
                    {formatAnnounceDate(a.rawDate, lang)}
                  </div>
                  <div style={{ fontSize: mob ? 11 : 12, fontWeight: 800, color: C.heading, letterSpacing: 0.5, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {a.name}
                  </div>
                  {a.link && (
                    <a href={a.link} target="_blank" rel="noopener noreferrer" style={{ marginLeft: "auto", fontFamily: BODY_FONT, fontSize: 11, color: C.muted, textDecoration: "none", whiteSpace: "nowrap", flexShrink: 0 }}>
                      {lang === "ru" ? "инфо" : "info"} ↗
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Archive */}
      <section ref={archiveRef} style={{ padding: mob ? "60px 16px 80px" : "120px 20px 120px", maxWidth: 900, margin: "0 auto" }}>
        <SL num={t.archive.num} text={t.archive.label} color={AC} />
        <ST>{t.archive.t1}<br /><span style={{ color: ACS }}>{t.archive.t2}</span></ST>

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
        <div style={{ fontSize: 16, fontWeight: 900, color: C.footer, letterSpacing: 4 }}>ARENA <span style={{ color: ACS }}>1</span></div>
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
                <a href={selected.bracketUrl} target="_blank" rel="noopener noreferrer" style={{ fontFamily: BODY_FONT, fontSize: 10, color: ACS, letterSpacing: 1, textDecoration: "none", padding: "6px 12px", border: `1px solid ${AC}33`, whiteSpace: "nowrap" }}>
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
                    <div style={{ fontSize: isTop3 ? (mob ? 15 : 17) : 12, fontWeight: isTop3 ? 900 : 600, color: pc, fontFamily: "'Tektur',monospace" }}>
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
