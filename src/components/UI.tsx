import { useState, useEffect, type FC, type ReactNode } from "react";
import { C } from "../theme";

export const BODY_FONT = "'JetBrains Mono', monospace";

export const ScanLine: FC = () => (
  <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 9999,
    background: `repeating-linear-gradient(0deg,transparent,transparent 2px,${C.scanline} 2px,${C.scanline} 4px)` }} />
);

export const GlitchText: FC<{ children: ReactNode }> = ({ children }) => {
  const [g, setG] = useState(false);
  useEffect(() => {
    const id = setInterval(() => { setG(true); setTimeout(() => setG(false), 120); }, 3500 + Math.random() * 4000);
    return () => clearInterval(id);
  }, []);
  return (
    <span style={{ display: "inline-block",
      ...(g ? { textShadow: "3px 0 #ff3e3e,-3px 0 #00f0ff", transform: `translate(${Math.random()*3-1.5}px,${Math.random()*2-1}px)` } : {}),
    }}>{children}</span>
  );
};

export const CUnit: FC<{ value: number; label: string }> = ({ value, label }) => (
  <div style={{ textAlign: "center", minWidth: 0, flex: "1 1 0" }}>
    <div style={{ fontSize: "clamp(28px,7vw,56px)", fontWeight: 900, fontFamily: "'Tektur',monospace", color: "#ff3e3e", lineHeight: 1,
      textShadow: "0 0 24px rgba(255,62,62,0.5),0 0 48px rgba(255,62,62,0.15)" }}>{String(value).padStart(2, "0")}</div>
    <div style={{ fontSize: "clamp(8px,1.5vw,10px)", letterSpacing: "clamp(1px,0.5vw,3px)", color: C.muted, marginTop: 6, textTransform: "uppercase", fontWeight: 600 }}>{label}</div>
  </div>
);

export const Sep: FC = () => <div style={{ color: "#ff3e3e", fontSize: "clamp(20px,4vw,32px)", fontWeight: 300, marginTop: -6, flexShrink: 0 }}>:</div>;

export const SL: FC<{ num: string; text: string; color?: string }> = ({ num, text, color = "#ff3e3e" }) => (
  <div style={{ fontSize: "clamp(9px,2vw,11px)", letterSpacing: "clamp(2px,1vw,5px)", color, marginBottom: 16, fontWeight: 600 }}>{num} · {text}</div>
);

export const ST: FC<{ children: ReactNode }> = ({ children }) => (
  <h2 style={{ fontSize: "clamp(22px,5vw,48px)", fontWeight: 800, color: C.heading, lineHeight: 1.1, margin: "0 0 24px" }}>{children}</h2>
);
