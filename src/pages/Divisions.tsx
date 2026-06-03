import { type FC } from "react";
import { useLang } from "../hooks/useLang";
import { useIsMobile } from "../hooks/useIsMobile";
import { useSheetData } from "../hooks/useSheetData";
import { ScanLine, BODY_FONT } from "../components/UI";
import { C } from "../theme";

const AC = "#4ade80";

const T = {
  ru: {
    tag: "N O N - P R O",
    h1: "ДИВИЗИОНЫ",
    h2: "& ИГРОКИ",
    loading: "Загрузка...",
    error: "Не удалось загрузить данные. Попробуй позже.",
    cols: { rank: "#", player: "Игрок", elo: "ELO", division: "Дивизион" },
    footer: "ARENA 1 DIVISIONS · NON-PRO DUEL CUPS · 2026",
  },
  en: {
    tag: "N O N - P R O",
    h1: "DIVISIONS",
    h2: "& PLAYERS",
    loading: "Loading...",
    error: "Failed to load data. Please try again later.",
    cols: { rank: "#", player: "Player", elo: "ELO", division: "Division" },
    footer: "ARENA 1 DIVISIONS · NON-PRO DUEL CUPS · 2026",
  },
};

const Divisions: FC = () => {
  const { lang } = useLang();
  const mob = useIsMobile();
  const t = T[lang];
  const { divisions, loading, error } = useSheetData();

  const allPlayers = divisions.flatMap((d) =>
    d.players.map((p) => ({ ...p, division: d.label }))
  );

  return (
    <div style={{ overflowX: "hidden" }}>
      <ScanLine />

      {/* Hero */}
      <section
        style={{
          minHeight: "35vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
          padding: mob ? "100px 16px 60px" : "120px 20px 80px",
          textAlign: "center",
          background: `radial-gradient(ellipse at 50% 20%,rgba(74,222,128,0.06) 0%,transparent 60%)`,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            backgroundImage: `linear-gradient(rgba(74,222,128,var(--grid-line)) 1px,transparent 1px),linear-gradient(90deg,rgba(74,222,128,var(--grid-line)) 1px,transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div
            style={{
              fontSize: mob ? 9 : 11,
              letterSpacing: mob ? 3 : 6,
              color: AC,
              marginBottom: 20,
              fontWeight: 600,
            }}
          >
            {t.tag}
          </div>
          <h1
            style={{
              fontSize: "clamp(36px,8vw,80px)",
              fontWeight: 900,
              margin: 0,
              lineHeight: 0.9,
              letterSpacing: -2,
              color: C.heading,
            }}
          >
            {t.h1} <span style={{ color: AC }}>{t.h2}</span>
          </h1>
        </div>
      </section>

      {/* Table */}
      <section
        style={{
          padding: mob ? "0 0 80px" : "0 20px 120px",
          maxWidth: 900,
          margin: "0 auto",
        }}
      >
        {loading && (
          <div
            style={{
              textAlign: "center",
              color: C.muted,
              padding: "80px 0",
              fontFamily: BODY_FONT,
              fontSize: 13,
              letterSpacing: 2,
            }}
          >
            {t.loading}
          </div>
        )}

        {error && (
          <div
            style={{
              textAlign: "center",
              color: "#ff3e3e",
              padding: "80px 0",
              fontFamily: BODY_FONT,
              fontSize: 13,
            }}
          >
            {t.error}
          </div>
        )}

        {!loading && !error && (
          <div style={{ overflowX: "auto" }}>
            {/* Header */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: mob ? "40px 1fr 64px 90px" : "52px 1fr 80px 140px",
                padding: mob ? "10px 16px" : "12px 24px",
                borderBottom: `1px solid ${AC}33`,
                background: `${AC}08`,
              }}
            >
              {Object.values(t.cols).map((col, i) => (
                <div
                  key={i}
                  style={{
                    fontSize: 9,
                    letterSpacing: 3,
                    color: C.muted,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    textAlign: i === 2 ? "right" : "left",
                  }}
                >
                  {col}
                </div>
              ))}
            </div>

            {/* Rows */}
            <div>
              {allPlayers.map((p, i) => {
                const rank = i + 1;
                const isTop3 = rank <= 3;
                const rankColor =
                  rank === 1 ? "#ffd700" : rank === 2 ? "#c0c0c0" : rank === 3 ? "#cd7f32" : C.muted;

                return (
                  <div
                    key={i}
                    style={{
                      display: "grid",
                      gridTemplateColumns: mob ? "40px 1fr 64px 90px" : "52px 1fr 80px 140px",
                      padding: mob ? "10px 16px" : "12px 24px",
                      borderBottom: `1px solid ${C.borderLight}`,
                      background: isTop3 ? `${rankColor}06` : "transparent",
                      alignItems: "center",
                    }}
                  >
                    {/* Rank */}
                    <div
                      style={{
                        fontFamily: "'Orbitron',monospace",
                        fontSize: isTop3 ? (mob ? 14 : 16) : mob ? 11 : 12,
                        fontWeight: isTop3 ? 900 : 500,
                        color: isTop3 ? rankColor : C.muted,
                      }}
                    >
                      {rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : rank}
                    </div>

                    {/* Player */}
                    <div
                      style={{
                        fontFamily: BODY_FONT,
                        fontSize: mob ? 12 : 13,
                        color: p.uncertain ? C.muted : isTop3 ? C.heading : C.body,
                        fontWeight: isTop3 ? 700 : 400,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {p.name}
                      {p.uncertain && (
                        <span style={{ color: C.muted, marginLeft: 4, fontSize: 10 }}>?</span>
                      )}
                    </div>

                    {/* ELO */}
                    <div
                      style={{
                        fontFamily: BODY_FONT,
                        fontSize: mob ? 12 : 13,
                        color: AC,
                        fontWeight: 600,
                        letterSpacing: 1,
                        textAlign: "right",
                      }}
                    >
                      {p.elo}
                    </div>

                    {/* Division */}
                    <div
                      style={{
                        fontFamily: BODY_FONT,
                        fontSize: mob ? 9 : 10,
                        color: C.muted,
                        letterSpacing: 1,
                        textTransform: "uppercase",
                        paddingLeft: mob ? 8 : 12,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {p.division}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </section>

      <footer
        style={{
          padding: mob ? "40px 16px" : "60px 20px",
          textAlign: "center",
          borderTop: `1px solid ${C.borderLight}`,
        }}
      >
        <div style={{ fontSize: 16, fontWeight: 900, color: C.footer, letterSpacing: 4 }}>
          ARENA <span style={{ color: AC }}>1</span>
        </div>
        <div style={{ fontSize: 10, color: C.footer, letterSpacing: 3, marginTop: 8 }}>
          {t.footer}
        </div>
      </footer>
    </div>
  );
};

export default Divisions;
