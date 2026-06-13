import { useState, type FC } from "react";
import { Link, useLocation } from "react-router-dom";
import { useLang } from "../hooks/useLang";
import { useIsMobile } from "../hooks/useIsMobile";
import { useTheme } from "../hooks/useTheme";
import { C } from "../theme";

const AC = "#4ade80";
const ACS = C.accent;

const PAGES = [
  // зелёный — через var(--accent): в светлой теме только тёмный зелёный
  { path: "/", label: "Non-Pro Duel Cups", color: "var(--accent)", border: "var(--accent-border)" },
  { path: "/trainer", label: "Trainer", color: "#fbbf24", border: "#fbbf2466" },
  { path: "/blog", label: "Blog", color: "#c084fc", border: "#c084fc66" },
] as const;

// страницы раздела Non-Pro: анонсы (главная), результаты, дивизионы
const isNonPro = (pathname: string) =>
  pathname === "/" || pathname.startsWith("/non-pro-duel-cups") || pathname.startsWith("/divisions");

const SUB_NAV = {
  ru: [
    { label: "Анонсы", href: "/", external: false },
    { label: "Результаты", href: "/non-pro-duel-cups", external: false },
    { label: "Рейтинг", href: "/divisions", external: false },
    { label: "Участвовать", href: "https://discord.gg/dgPwNAph2j", external: true },
  ],
  en: [
    { label: "Announces", href: "/", external: false },
    { label: "Results", href: "/non-pro-duel-cups", external: false },
    { label: "Ranking", href: "/divisions", external: false },
    { label: "Join", href: "https://discord.gg/dgPwNAph2j", external: true },
  ],
};

const isActive = (pathname: string, path: string) =>
  path === "/" ? pathname === "/" : pathname.startsWith(path);

// для главного меню: пункт Non-Pro активен на всех страницах раздела
const isPageActive = (pathname: string, path: string) =>
  path === "/" ? isNonPro(pathname) : pathname.startsWith(path);

export const TopNav: FC = () => {
  const { pathname } = useLocation();
  const { lang, setLang } = useLang();
  const { theme, toggle } = useTheme();
  const mobile = useIsMobile();
  const [open, setOpen] = useState(false);
  const activePage = PAGES.find((p) => isPageActive(pathname, p.path)) ?? PAGES[0];
  const subItems = SUB_NAV[lang];

  return (
    <>
      {/* Main nav */}
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 200,
        background: C.bgNav, backdropFilter: "blur(12px)",
        borderBottom: `1px solid ${activePage.border}`,
        display: "flex", alignItems: "center", padding: "0 16px", height: 48,
        transition: "background 0.3s",
      }}>
        <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", flexShrink: 0 }}>
          <span
            style={{ fontSize: 15, fontWeight: 900, color: C.heading, letterSpacing: 2, fontFamily: "'Xolonium','Tektur',monospace", whiteSpace: "nowrap", transition: "text-shadow 0.25s ease" }}
            onMouseEnter={(e) => (e.currentTarget.style.textShadow = "0 0 16px rgba(var(--glow-rgb),0.7)")}
            onMouseLeave={(e) => (e.currentTarget.style.textShadow = "none")}
          >
            ARENA <span style={{ color: "#ff3e3e" }}>1</span>
          </span>
        </Link>

        {!mobile && (
          <div style={{ display: "flex", gap: 4, marginLeft: 28 }}>
            {PAGES.map((p) => (
              <Link key={p.path} to={p.path} style={{
                textDecoration: "none", padding: "14px 12px",
                fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase",
                fontFamily: "'Xolonium','Tektur',sans-serif",
                color: isPageActive(pathname, p.path) ? p.color : C.muted,
                borderBottom: isPageActive(pathname, p.path) ? `2px solid ${p.color}` : "2px solid transparent",
                textShadow: isPageActive(pathname, p.path) ? `0 0 14px ${p.color}aa` : "none",
                transition: "all 0.3s",
              }}>{p.label}</Link>
            ))}
          </div>
        )}

        <div style={{ marginLeft: "auto", display: "flex", gap: 4, alignItems: "center" }}>
          <button onClick={toggle} style={{
            background: "none", border: "none", cursor: "pointer",
            color: "#888", fontSize: 16, padding: "0 6px",
            transition: "color 0.3s", lineHeight: 1,
          }} title={theme === "dark" ? "Light mode" : "Dark mode"}>
            {theme === "dark" ? "◐" : "◑"}
          </button>

          {(["ru", "en"] as const).map((l) => (
            <button key={l} onClick={() => setLang(l)} style={{
              background: "none", border: "none", cursor: "pointer",
              color: lang === l ? activePage.color : C.subtle,
              fontSize: 11, fontWeight: 700, letterSpacing: 2,
              fontFamily: "'Xolonium','Tektur',sans-serif", padding: "0 6px",
              textTransform: "uppercase", transition: "color 0.3s",
            }}>{l}</button>
          ))}

          {mobile && (
            <button onClick={() => setOpen(!open)} style={{
              background: "none", border: "none", cursor: "pointer",
              color: activePage.color, fontSize: 22, padding: "0 4px 0 12px",
              fontFamily: "monospace", lineHeight: 1,
            }}>{open ? "✕" : "☰"}</button>
          )}
        </div>
      </div>

      {/* Sub-nav — non-pro-duel-cups and divisions */}
      {isNonPro(pathname) && (
        <div style={{
          position: "fixed", top: 48, left: 0, right: 0, zIndex: 199, height: 32,
          background: C.bgNavSub, backdropFilter: "blur(12px)",
          borderBottom: "none",
          // на мобильном 4 пункта переполняются: center при overflow обрезает левый край
          display: "flex", justifyContent: mobile ? "flex-start" : "center",
          overflowX: "auto", WebkitOverflowScrolling: "touch",
          transition: "background 0.3s",
        }}>
          {subItems.map((item) =>
            item.external ? (
              <a key={item.href} href={item.href} target="_blank" rel="noopener noreferrer" style={{
                textDecoration: "none",
                color: ACS,
                fontSize: mobile ? 10 : 11, fontWeight: 700, letterSpacing: 1.5,
                textTransform: "uppercase",
                padding: mobile ? "0 10px" : "0 14px",
                display: "flex", alignItems: "center",
                borderBottom: "2px solid transparent",
                fontFamily: "'Xolonium','Tektur',sans-serif", whiteSpace: "nowrap", flexShrink: 0,
              }}>{item.label}</a>
            ) : (
              <Link key={item.href} to={item.href} style={{
                textDecoration: "none",
                color: isActive(pathname, item.href) ? ACS : C.muted,
                fontSize: mobile ? 10 : 11, fontWeight: 700, letterSpacing: 1.5,
                textTransform: "uppercase",
                padding: mobile ? "0 10px" : "0 14px",
                display: "flex", alignItems: "center",
                borderBottom: isActive(pathname, item.href) ? `2px solid ${ACS}` : "2px solid transparent",
                textShadow: isActive(pathname, item.href) ? "0 0 14px rgba(var(--glow-rgb),0.7)" : "none",
                fontFamily: "'Xolonium','Tektur',sans-serif", whiteSpace: "nowrap", flexShrink: 0,
                transition: "all 0.2s",
              }}>{item.label}</Link>
            )
          )}
        </div>
      )}

      {/* Mobile drawer */}
      {mobile && open && (
        <div style={{
          position: "fixed", top: 48, left: 0, right: 0, bottom: 0, zIndex: 198,
          background: theme === "dark" ? "rgba(8,8,12,0.98)" : "rgba(244,244,246,0.98)",
          backdropFilter: "blur(16px)",
          display: "flex", flexDirection: "column", padding: "24px 20px",
        }}>
          {PAGES.map((p) => (
            <Link key={p.path} to={p.path} onClick={() => setOpen(false)} style={{
              textDecoration: "none", padding: "18px 0",
              fontSize: 14, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase",
              fontFamily: "'Xolonium','Tektur',sans-serif",
              color: isPageActive(pathname, p.path) ? p.color : C.secondary,
              borderBottom: `1px solid ${C.border}`,
              transition: "all 0.3s",
            }}>{p.label}</Link>
          ))}
          {isNonPro(pathname) && (
            <div style={{ marginTop: 24, borderTop: `1px solid ${C.border}`, paddingTop: 24, display: "flex", flexDirection: "column", gap: 4 }}>
              {subItems.map((item) =>
                item.external ? (
                  <a key={item.href} href={item.href} target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)} style={{
                    textDecoration: "none", padding: "14px 0",
                    fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase",
                    fontFamily: "'Xolonium','Tektur',sans-serif", color: ACS,
                  }}>{item.label}</a>
                ) : (
                  <Link key={item.href} to={item.href} onClick={() => setOpen(false)} style={{
                    textDecoration: "none", padding: "14px 0",
                    fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase",
                    fontFamily: "'Xolonium','Tektur',sans-serif", color: C.secondary,
                  }}>{item.label}</Link>
                )
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
};
