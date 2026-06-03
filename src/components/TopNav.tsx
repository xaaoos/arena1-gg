import { useState, type FC } from "react";
import { Link, useLocation } from "react-router-dom";
import { useLang } from "../hooks/useLang";
import { useIsMobile } from "../hooks/useIsMobile";
import { useTheme } from "../hooks/useTheme";
import { C } from "../theme";

const AC = "#4ade80";
const ACS = C.accent;

const PAGES = [
  { path: "/non-pro-duel-cups", label: "Non-Pro Duel Cups", color: AC },
  { path: "/trainer", label: "Trainer", color: "#fbbf24" },
  { path: "/blog", label: "Blog", color: "#c084fc" },
] as const;

const SUB_NAV = {
  ru: [
    { label: "Результаты", href: "/non-pro-duel-cups", external: false },
    { label: "Дивизионы и игроки", href: "/divisions", external: false },
    { label: "Регистрация", href: "https://discord.gg/dgPwNAph2j", external: true },
  ],
  en: [
    { label: "Results", href: "/non-pro-duel-cups", external: false },
    { label: "Divisions & Players", href: "/divisions", external: false },
    { label: "Register", href: "https://discord.gg/dgPwNAph2j", external: true },
  ],
};

const isActive = (pathname: string, path: string) =>
  path === "/" ? pathname === "/" : pathname.startsWith(path);

export const TopNav: FC = () => {
  const { pathname } = useLocation();
  const { lang, setLang } = useLang();
  const { theme, toggle } = useTheme();
  const mobile = useIsMobile();
  const [open, setOpen] = useState(false);
  const activePage = PAGES.find((p) => isActive(pathname, p.path)) ?? PAGES[0];
  const subItems = SUB_NAV[lang];

  return (
    <>
      {/* Main nav */}
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 200,
        background: C.bgNav, backdropFilter: "blur(12px)",
        borderBottom: `1px solid ${activePage.color}66`,
        display: "flex", alignItems: "center", padding: "0 16px", height: 48,
        transition: "background 0.3s",
      }}>
        <Link to="/non-pro-duel-cups" style={{ textDecoration: "none", display: "flex", alignItems: "center", flexShrink: 0 }}>
          <span style={{ fontSize: 15, fontWeight: 900, color: C.heading, letterSpacing: 2, fontFamily: "'Russo One',monospace", whiteSpace: "nowrap" }}>
            ARENA <span style={{ color: "#ff3e3e" }}>1</span>
          </span>
        </Link>

        {!mobile && (
          <div style={{ display: "flex", gap: 4, marginLeft: 28 }}>
            {PAGES.map((p) => (
              <Link key={p.path} to={p.path} style={{
                textDecoration: "none", padding: "14px 12px",
                fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase",
                fontFamily: "'Russo One',sans-serif",
                color: isActive(pathname, p.path) ? p.color : C.muted,
                borderBottom: isActive(pathname, p.path) ? `2px solid ${p.color}` : "2px solid transparent",
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
              fontFamily: "'Russo One',sans-serif", padding: "0 6px",
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
      {(pathname.startsWith("/non-pro-duel-cups") || pathname.startsWith("/divisions")) && (
        <div style={{
          position: "fixed", top: 48, left: 0, right: 0, zIndex: 199,
          background: C.bgNavSub, backdropFilter: "blur(12px)",
          borderBottom: "none",
          display: "flex", justifyContent: "center",
          overflowX: "auto", WebkitOverflowScrolling: "touch",
          transition: "background 0.3s",
        }}>
          {subItems.map((item) =>
            item.external ? (
              <a key={item.href} href={item.href} target="_blank" rel="noopener noreferrer" style={{
                textDecoration: "none",
                color: ACS,
                fontSize: mobile ? 9 : 10, fontWeight: 700, letterSpacing: 2,
                textTransform: "uppercase",
                padding: mobile ? "9px 10px" : "10px 14px",
                borderBottom: "2px solid transparent",
                fontFamily: "'Russo One',sans-serif", whiteSpace: "nowrap", flexShrink: 0,
              }}>{item.label}</a>
            ) : (
              <Link key={item.href} to={item.href} style={{
                textDecoration: "none",
                color: isActive(pathname, item.href) ? ACS : C.muted,
                fontSize: mobile ? 9 : 10, fontWeight: 700, letterSpacing: 2,
                textTransform: "uppercase",
                padding: mobile ? "9px 10px" : "10px 14px",
                borderBottom: isActive(pathname, item.href) ? `2px solid ${ACS}` : "2px solid transparent",
                fontFamily: "'Russo One',sans-serif", whiteSpace: "nowrap", flexShrink: 0,
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
              fontFamily: "'Russo One',sans-serif",
              color: isActive(pathname, p.path) ? p.color : C.secondary,
              borderBottom: `1px solid ${C.border}`,
              transition: "all 0.3s",
            }}>{p.label}</Link>
          ))}
          <div style={{ marginTop: 24, borderTop: `1px solid ${C.border}`, paddingTop: 24, display: "flex", flexDirection: "column", gap: 4 }}>
            {subItems.map((item) =>
              item.external ? (
                <a key={item.href} href={item.href} target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)} style={{
                  textDecoration: "none", padding: "14px 0",
                  fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase",
                  fontFamily: "'Russo One',sans-serif", color: ACS,
                }}>{item.label}</a>
              ) : (
                <Link key={item.href} to={item.href} onClick={() => setOpen(false)} style={{
                  textDecoration: "none", padding: "14px 0",
                  fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase",
                  fontFamily: "'Russo One',sans-serif", color: C.secondary,
                }}>{item.label}</Link>
              )
            )}
          </div>
        </div>
      )}
    </>
  );
};
