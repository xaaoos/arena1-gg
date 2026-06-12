import { useState, type FC } from "react";
import { useLang } from "../hooks/useLang";
import { useIsMobile } from "../hooks/useIsMobile";
import { ELOCUP } from "../data/elocup";
import { useArchiveData, formatArchiveDate, type ArchiveCup, type ArchiveStanding } from "../hooks/useArchiveData";
import { BODY_FONT } from "../components/UI";
import { C } from "../theme";

const AC = "#4ade80";
const ACS = C.accent;
const PLACE_C: Record<string, string> = { "1": C.place1, "2": C.place2, "3": C.place3 };

const placeLabel = (place: string) =>
  place === "1" ? "🥇" : place === "2" ? "🥈" : place === "3" ? "🥉" : `#${place}`;

const StandingsList: FC<{ standings: ArchiveStanding[]; mob: boolean }> = ({ standings, mob }) => (
  <div>
    {standings.map((s, si) => {
      const pc = PLACE_C[s.place] ?? C.body;
      const isTop3 = ["1", "2", "3"].includes(s.place);
      return (
        <div key={si} style={{ display: "grid", gridTemplateColumns: mob ? "44px 1fr" : "56px 1fr", alignItems: "center", padding: mob ? "11px 16px" : "13px 24px", borderTop: si > 0 ? `1px solid ${C.borderLight}` : "none", background: isTop3 ? C.accentSubtle : "transparent" }}>
          <div style={{ fontSize: isTop3 ? (mob ? 15 : 17) : 12, fontWeight: isTop3 ? 900 : 600, color: pc, fontFamily: "'Xolonium','Tektur',monospace" }}>
            {placeLabel(s.place)}
          </div>
          <div style={{ fontFamily: BODY_FONT, fontSize: isTop3 ? (mob ? 13 : 14) : (mob ? 12 : 13), color: isTop3 ? C.heading : C.body, fontWeight: isTop3 ? 700 : 400, overflowWrap: "break-word" }}>
            {s.players.join(", ")}
          </div>
        </div>
      );
    })}
  </div>
);

const EloCup: FC = () => {
  const { lang } = useLang();
  const t = ELOCUP[lang];
  const mob = useIsMobile();
  const { cups, loading: archiveLoading, error: archiveError } = useArchiveData();
  const [selected, setSelected] = useState<ArchiveCup | null>(null);
  const [search, setSearch] = useState("");
  const query = search.trim().toLowerCase();

  // история игрока по всем кубкам: турнир, дата, место
  const playerResults = query
    ? cups.flatMap((cup) =>
        cup.standings
          .filter((s) => s.players.some((p) => p.toLowerCase().includes(query)))
          .map((s) => ({ cup, place: s.place }))
      )
    : null;

  const openCups = cups.slice(0, 4);
  const moreCups = cups.slice(4);

  return (
    <div style={{ overflowX: "hidden" }}>

      {/* Hero */}
      <section style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", position: "relative", padding: mob ? "120px 16px 32px" : "150px 20px 40px", textAlign: "center", background: `radial-gradient(ellipse at 50% 20%,rgba(var(--glow-rgb),0.06) 0%,transparent 60%)` }}>
        <div style={{ position: "relative", zIndex: 1, maxWidth: 700, width: "100%" }}>
          <div style={{ fontSize: mob ? 10 : 12, letterSpacing: mob ? 3 : 5, color: ACS, marginBottom: 12, fontWeight: 600 }}>{t.hero.tag}</div>
          <h1 style={{ fontSize: "clamp(26px,5vw,52px)", fontWeight: 900, margin: 0, lineHeight: 1.1, color: C.heading }}>
            {t.archive.t1} <span style={{ color: ACS }}>{t.archive.t2}</span>
          </h1>
          {/* Поиск игрока за всю историю */}
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t.archive.search}
            style={{
              background: C.inputBg,
              border: `1px solid ${C.border}`,
              color: C.heading,
              fontFamily: BODY_FONT,
              fontSize: 16,
              padding: mob ? "10px 14px" : "12px 18px",
              outline: "none",
              width: mob ? 240 : 320,
              caretColor: ACS,
              marginTop: mob ? 24 : 32,
            }}
          />
        </div>
      </section>

      <section style={{ padding: mob ? "20px 16px 80px" : "30px 20px 120px", maxWidth: 900, margin: "0 auto" }}>
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

        {/* Результаты игрока за всю историю участия */}
        {!archiveLoading && !archiveError && playerResults !== null && (
          playerResults.length === 0 ? (
            <div style={{ textAlign: "center", color: C.muted, padding: "40px 0", fontFamily: BODY_FONT, fontSize: 13 }}>{t.archive.notFound}</div>
          ) : (
            <div style={{ maxWidth: 640, margin: "0 auto" }}>
              {playerResults.map((r, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: mob ? 10 : 16,
                  padding: mob ? "12px 12px" : "14px 18px",
                  background: C.bgCard, border: `1px solid ${C.border}`,
                  borderTop: i > 0 ? "none" : `1px solid ${C.border}`,
                }}>
                  <div style={{ fontSize: mob ? 14 : 16, fontWeight: 900, color: PLACE_C[r.place] ?? C.heading, fontFamily: "'Xolonium','Tektur',monospace", minWidth: mob ? 36 : 44, flexShrink: 0 }}>
                    {placeLabel(r.place)}
                  </div>
                  <div style={{ overflow: "hidden" }}>
                    <div style={{ fontSize: mob ? 11 : 12, fontWeight: 800, color: C.heading, letterSpacing: 0.5, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {r.cup.name}
                    </div>
                    <div style={{ fontFamily: BODY_FONT, fontSize: mob ? 10 : 11, color: C.muted, marginTop: 3 }}>
                      {formatArchiveDate(r.cup.rawDate, lang)}
                    </div>
                  </div>
                  <div style={{ marginLeft: "auto", display: "flex", gap: mob ? 8 : 12, flexShrink: 0, alignItems: "center" }}>
                    <button onClick={() => setSelected(r.cup)} style={{
                      background: "none", border: `1px solid ${C.accentBorder}`, cursor: "pointer",
                      fontFamily: BODY_FONT, fontSize: mob ? 10 : 11, color: ACS, padding: mob ? "6px 8px" : "6px 12px",
                    }}>{t.archive.results}</button>
                    <a href={r.cup.bracketUrl} target="_blank" rel="noopener noreferrer" style={{
                      fontFamily: BODY_FONT, fontSize: mob ? 10 : 11, color: C.muted, textDecoration: "none",
                      padding: mob ? "6px 8px" : "6px 12px", border: `1px solid ${C.border}`, whiteSpace: "nowrap",
                    }}>{lang === "ru" ? "сетка" : "bracket"} ↗</a>
                  </div>
                </div>
              ))}
            </div>
          )
        )}

        {/* Архив: первые 4 кубка раскрыты, остальные — карточки с попапом */}
        {!archiveLoading && !archiveError && playerResults === null && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "repeat(2, 1fr)", gap: mob ? 14 : 18, alignItems: "start" }}>
              {openCups.map((cup, ci) => (
                <div key={ci} style={{ background: C.bgCard, border: `1px solid ${C.border}` }}>
                  <div style={{ padding: mob ? "14px 16px" : "16px 24px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                    <div>
                      <div style={{ fontSize: mob ? 13 : 14, fontWeight: 900, color: C.heading, letterSpacing: 0.5 }}>{cup.name}</div>
                      <div style={{ fontFamily: BODY_FONT, fontSize: 11, color: C.muted, marginTop: 4 }}>{formatArchiveDate(cup.rawDate, lang)}</div>
                    </div>
                    <a href={cup.bracketUrl} target="_blank" rel="noopener noreferrer" style={{ fontFamily: BODY_FONT, fontSize: 10, color: ACS, letterSpacing: 1, textDecoration: "none", padding: "6px 12px", border: `1px solid ${C.accentBorder}`, whiteSpace: "nowrap", flexShrink: 0 }}>
                      {t.archive.bracket} ↗
                    </a>
                  </div>
                  <StandingsList standings={cup.standings} mob={mob} />
                </div>
              ))}
            </div>

            {moreCups.length > 0 && (
              <>
                <div style={{ fontSize: 10, letterSpacing: 2, color: C.muted, fontWeight: 700, textTransform: "uppercase", margin: mob ? "28px 0 10px" : "40px 0 14px" }}>
                  {t.archive.more}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr 1fr" : "repeat(3, 1fr)", gap: mob ? 10 : 14 }}>
                  {moreCups.map((cup, ci) => {
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
                        onMouseEnter={e => (e.currentTarget.style.borderColor = C.accentBorder)}
                        onMouseLeave={e => (e.currentTarget.style.borderColor = C.border)}
                      >
                        <div style={{ fontSize: mob ? 11 : 12, fontWeight: 800, color: C.heading, letterSpacing: 0.5, lineHeight: 1.3 }}>{cup.name}</div>
                        <div style={{ fontFamily: BODY_FONT, fontSize: mob ? 10 : 11, color: C.muted }}>{formatArchiveDate(cup.rawDate, lang)}</div>
                        <div style={{ fontFamily: BODY_FONT, fontSize: mob ? 11 : 12, color: C.place1, marginTop: 4 }}>🥇 {winner}</div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </>
        )}
      </section>

      <footer style={{ padding: mob ? "40px 16px" : "60px 20px", textAlign: "center", borderTop: `1px solid ${C.borderLight}` }}>
        <div style={{ fontSize: 16, fontWeight: 900, color: C.footer, letterSpacing: 4 }}>ARENA <span style={{ color: ACS }}>1</span></div>
        <div style={{ fontSize: 10, color: C.footer, letterSpacing: 3, marginTop: 8 }}>{t.footer}</div>
        <div style={{ fontSize: 10, color: C.footer, letterSpacing: 2, marginTop: 16, opacity: 0.5 }}>developed by <a href="https://selzio.com" target="_blank" rel="noopener noreferrer" style={{ color: "inherit", textDecoration: "underline" }}>selzio.com</a></div>
      </footer>

      {/* Modal — полные результаты кубка */}
      {selected && (
        <div
          onClick={() => setSelected(null)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", zIndex: 500, display: "flex", alignItems: "center", justifyContent: "center", padding: mob ? 12 : 24, backdropFilter: "blur(4px)" }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{ background: C.bg, border: `1px solid ${C.accentBorder}`, width: "100%", maxWidth: 520, maxHeight: "85vh", overflow: "auto", display: "flex", flexDirection: "column" }}
          >
            {/* Modal header */}
            <div style={{ padding: mob ? "16px 16px" : "20px 24px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, position: "sticky", top: 0, background: C.bg, zIndex: 1 }}>
              <div>
                <div style={{ fontSize: mob ? 14 : 16, fontWeight: 900, color: C.heading, letterSpacing: 0.5 }}>{selected.name}</div>
                <div style={{ fontFamily: BODY_FONT, fontSize: 11, color: C.muted, marginTop: 4 }}>{formatArchiveDate(selected.rawDate, lang)}</div>
              </div>
              <div style={{ display: "flex", gap: 8, alignItems: "center", flexShrink: 0 }}>
                <a href={selected.bracketUrl} target="_blank" rel="noopener noreferrer" style={{ fontFamily: BODY_FONT, fontSize: 10, color: ACS, letterSpacing: 1, textDecoration: "none", padding: "6px 12px", border: `1px solid ${C.accentBorder}`, whiteSpace: "nowrap" }}>
                  {t.archive.bracket} ↗
                </a>
                <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", cursor: "pointer", color: C.muted, fontSize: 18, lineHeight: 1, padding: "4px 6px" }}>✕</button>
              </div>
            </div>
            <StandingsList standings={selected.standings} mob={mob} />
          </div>
        </div>
      )}
    </div>
  );
};

export default EloCup;
