import { type FC } from "react";
import { useLang } from "../hooks/useLang";
import { useIsMobile } from "../hooks/useIsMobile";
import { useSheetData } from "../hooks/useSheetData";
import { ScanLine, BODY_FONT } from "../components/UI";
import { C } from "../theme";

const AC = "#4ade80";

const T = {
  ru: {
    tag: "A R E N A  1  D I V I S I O N S",
    h1a: "ДИВИЗИОНЫ",
    h1b: "Non-Pro",
    loading: "Загрузка...",
    error: "Не удалось загрузить данные. Попробуй позже.",
    players: "игроков",
  },
  en: {
    tag: "A R E N A  1  D I V I S I O N S",
    h1a: "DIVISIONS",
    h1b: "Non-Pro",
    loading: "Loading...",
    error: "Failed to load data. Please try again later.",
    players: "players",
  },
};

const Divisions: FC = () => {
  const { lang } = useLang();
  const mob = useIsMobile();
  const t = T[lang];
  const { divisions, loading, error } = useSheetData();

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
              fontSize: "clamp(40px,9vw,90px)",
              fontWeight: 900,
              margin: 0,
              lineHeight: 0.9,
              letterSpacing: -2,
              color: C.heading,
            }}
          >
            {t.h1a} <span style={{ color: AC }}>{t.h1b}</span>
          </h1>
        </div>
      </section>

      {/* Content */}
      <section
        style={{
          padding: mob ? "0 16px 80px" : "0 20px 120px",
          maxWidth: 860,
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

        {!loading &&
          !error &&
          divisions.map((div, di) => {
            const minElo = div.players[div.players.length - 1]?.elo ?? 0;
            const maxElo = div.players[0]?.elo ?? 0;
            return (
              <div key={di} style={{ marginBottom: 16 }}>
                {/* Division header */}
                <div
                  style={{
                    padding: mob ? "12px 16px" : "14px 24px",
                    background: `${AC}10`,
                    border: `1px solid ${AC}30`,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{
                      fontSize: mob ? 10 : 11,
                      fontWeight: 700,
                      letterSpacing: 3,
                      color: AC,
                      textTransform: "uppercase",
                    }}
                  >
                    {div.label}
                  </span>
                  <span
                    style={{
                      fontSize: 10,
                      color: C.muted,
                      fontFamily: BODY_FONT,
                    }}
                  >
                    {div.players.length} {t.players} · {minElo}–{maxElo}
                  </span>
                </div>

                {/* Players */}
                <div
                  style={{
                    background: C.bgCard,
                    border: `1px solid ${C.border}`,
                    borderTop: "none",
                  }}
                >
                  {div.players.map((p, pi) => (
                    <div
                      key={pi}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr auto",
                        padding: mob ? "9px 16px" : "11px 24px",
                        borderBottom:
                          pi < div.players.length - 1
                            ? `1px solid ${C.borderLight}`
                            : "none",
                        alignItems: "center",
                      }}
                    >
                      <div
                        style={{
                          fontFamily: BODY_FONT,
                          fontSize: mob ? 12 : 13,
                          color: p.uncertain ? C.muted : C.body,
                        }}
                      >
                        {p.name}
                        {p.uncertain && (
                          <span style={{ color: C.muted, marginLeft: 6, fontSize: 10 }}>?</span>
                        )}
                      </div>
                      <div
                        style={{
                          fontFamily: BODY_FONT,
                          fontSize: mob ? 12 : 13,
                          color: AC,
                          fontWeight: 600,
                          letterSpacing: 1,
                        }}
                      >
                        {p.elo}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
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
          ARENA 1 DIVISIONS · NON-PRO DUEL CUPS · 2026
        </div>
      </footer>
    </div>
  );
};

export default Divisions;
