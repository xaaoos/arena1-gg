import type { FC } from "react";

type IconType = "crown" | "crosshair" | "bolt" | "broadcast" | "trophy" | "film" |
  "shield" | "alert" | "steps" | "users" | "lock" | "globe" | "eye" | "chart";

export const Icon: FC<{ type: IconType; color?: string; size?: number }> = ({ type, color = "#ff3e3e", size = 20 }) => {
  const s = { width: size, height: size, flexShrink: 0 } as const;
  switch (type) {
    case "crown": return (
      <svg viewBox="0 0 24 24" fill="none" style={s}>
        <path d="M5 17h14" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
        <path d="M5 14l2-8 5 4 5-4 2 8" stroke={color} strokeWidth="1.5" strokeLinejoin="round" fill="none" />
        <circle cx="7" cy="6" r="1" fill={color} /><circle cx="12" cy="4" r="1" fill={color} /><circle cx="17" cy="6" r="1" fill={color} />
      </svg>);
    case "crosshair": return (
      <svg viewBox="0 0 24 24" fill="none" style={s}>
        <circle cx="12" cy="12" r="8" stroke={color} strokeWidth="1.5" /><circle cx="12" cy="12" r="2" fill={color} />
        <path d="M12 2v4M12 18v4M2 12h4M18 12h4" stroke={color} strokeWidth="1.5" />
      </svg>);
    case "bolt": return (
      <svg viewBox="0 0 24 24" fill="none" style={s}>
        <path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
      </svg>);
    case "broadcast": return (
      <svg viewBox="0 0 24 24" fill="none" style={s}>
        <circle cx="12" cy="12" r="2" fill={color} />
        <path d="M8.5 8.5a5 5 0 017 0M6 6a9 9 0 0112 0" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
        <path d="M15.5 15.5a5 5 0 01-7 0M18 18a9 9 0 01-12 0" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      </svg>);
    case "trophy": return (
      <svg viewBox="0 0 24 24" fill="none" style={s}>
        <path d="M8 2h8v8a4 4 0 11-8 0V2z" stroke={color} strokeWidth="1.5" />
        <path d="M8 4H5a2 2 0 00-2 2v1a3 3 0 003 3h2M16 4h3a2 2 0 012 2v1a3 3 0 01-3 3h-2" stroke={color} strokeWidth="1.5" />
        <path d="M12 14v3M8 21h8M10 17h4" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      </svg>);
    case "film": return (
      <svg viewBox="0 0 24 24" fill="none" style={s}>
        <rect x="2" y="4" width="20" height="16" rx="2" stroke={color} strokeWidth="1.5" />
        <path d="M2 8h20M2 16h20M8 4v16M16 4v16" stroke={color} strokeWidth="1.5" opacity="0.4" />
        <path d="M10 10l5 2-5 2v-4z" fill={color} />
      </svg>);
    case "shield": return (
      <svg viewBox="0 0 24 24" fill="none" style={s}>
        <path d="M12 3l8 4v5c0 5.25-3.5 8.25-8 10-4.5-1.75-8-4.75-8-10V7l8-4z" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M9 12l2 2 4-4" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>);
    case "users": return (
      <svg viewBox="0 0 24 24" fill="none" style={s}>
        <circle cx="9" cy="7" r="3" stroke={color} strokeWidth="1.5" />
        <path d="M3 21v-2a4 4 0 014-4h4a4 4 0 014 4v2" stroke={color} strokeWidth="1.5" />
        <circle cx="17" cy="8" r="2.5" stroke={color} strokeWidth="1.5" />
        <path d="M21 21v-1.5a3 3 0 00-3-3h-.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      </svg>);
    case "steps": return (
      <svg viewBox="0 0 24 24" fill="none" style={s}>
        <path d="M4 6h6M4 12h10M4 18h16" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="14" cy="6" r="2" stroke={color} strokeWidth="1.5" /><circle cx="18" cy="12" r="2" stroke={color} strokeWidth="1.5" />
      </svg>);
    case "lock": return (
      <svg viewBox="0 0 24 24" fill="none" style={s}>
        <rect x="5" y="11" width="14" height="10" rx="2" stroke={color} strokeWidth="1.5" />
        <path d="M8 11V7a4 4 0 018 0v4" stroke={color} strokeWidth="1.5" /><circle cx="12" cy="16" r="1.5" fill={color} />
      </svg>);
    case "globe": return (
      <svg viewBox="0 0 24 24" fill="none" style={s}>
        <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.5" />
        <path d="M3 12h18M12 3c2.5 2.5 4 5.5 4 9s-1.5 6.5-4 9c-2.5-2.5-4-5.5-4-9s1.5-6.5 4-9z" stroke={color} strokeWidth="1.5" />
      </svg>);
    case "eye": return (
      <svg viewBox="0 0 24 24" fill="none" style={s}>
        <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" stroke={color} strokeWidth="1.5" />
        <circle cx="12" cy="12" r="3" stroke={color} strokeWidth="1.5" />
      </svg>);
    default: return null;
  }
};
