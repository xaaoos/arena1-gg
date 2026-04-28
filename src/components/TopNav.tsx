import { useState, type FC } from "react";
import { Link, useLocation } from "react-router-dom";
import { useLang } from "../hooks/useLang";
import { useIsMobile } from "../hooks/useIsMobile";

const PAGES = [
  { path: "/", label: "Championship", color: "#ff3e3e" },
  { path: "/elocup", label: "EloCup", color: "#4ade80" },
  { path: "/verified", label: "Verified", color: "#00f0ff" },
  { path: "/trainer", label: "Trainer", color: "#fbbf24" },
  { path: "/blog", label: "Blog", color: "#c084fc" },
] as const;

const isActive = (pathname: string, path: string) =>
  path === "/" ? pathname === "/" : pathname.startsWith(path);

export const TopNav: FC = () => {
  const { pathname } = useLocation();
  const { lang, setLang } = useLang();
  const mobile = useIsMobile();
  const [open, setOpen] = useState(false);
  const activePage = PAGES.find((p) => isActive(pathname, p.path)) ?? PAGES[0];

  return (
    <>
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 200,
        background: "rgba(8,8,12,0.95)", backdropFilter: "blur(12px)",
        borderBottom: `1px solid ${activePage.color}22`,
        display: "flex", alignItems: "center", padding: "0 16px", height: 48,
      }}>
        <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", flexShrink: 0 }}>
          <span style={{ fontSize: 15, fontWeight: 900, color: "#fff", letterSpacing: 2, fontFamily: "'Orbitron',monospace", whiteSpace: "nowrap" }}>
            ARENA <span style={{ color: "#ff3e3e" }}>1</span>
          </span>
        </Link>

        {!mobile && (
          <div style={{ display: "flex", gap: 4, marginLeft: 28 }}>
            {PAGES.map((p) => (
              <Link key={p.path} to={p.path} style={{
                textDecoration: "none", padding: "14px 12px",
                fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase",
                fontFamily: "'Orbitron',sans-serif",
                color: isActive(pathname, p.path) ? p.color : "#555",
                borderBottom: isActive(pathname, p.path) ? `2px solid ${p.color}` : "2px solid transparent",
                transition: "all 0.3s",
              }}>{p.label}</Link>
            ))}
          </div>
        )}

        <div style={{ marginLeft: "auto", display: "flex", gap: 4, alignItems: "center" }}>
          {(["ru", "en"] as const).map((l) => (
            <button key={l} onClick={() => setLang(l)} style={{
              background: "none", border: "none", cursor: "pointer",
              color: lang === l ? activePage.color : "#444",
              fontSize: 11, fontWeight: 700, letterSpacing: 2,
              fontFamily: "'Orbitron',sans-serif", padding: "0 6px",
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

      {/* Mobile drawer */}
      {mobile && open && (
        <div style={{
          position: "fixed", top: 48, left: 0, right: 0, bottom: 0, zIndex: 199,
          background: "rgba(8,8,12,0.98)", backdropFilter: "blur(16px)",
          display: "flex", flexDirection: "column", padding: "24px 20px",
        }}>
          {PAGES.map((p) => (
            <Link key={p.path} to={p.path} onClick={() => setOpen(false)} style={{
              textDecoration: "none", padding: "18px 0",
              fontSize: 14, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase",
              fontFamily: "'Orbitron',sans-serif",
              color: isActive(pathname, p.path) ? p.color : "#666",
              borderBottom: "1px solid #1a1a1a",
              transition: "all 0.3s",
            }}>{p.label}</Link>
          ))}
        </div>
      )}
    </>
  );
};
