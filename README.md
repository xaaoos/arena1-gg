# Arena 1 — FPS Championship

Website for arena1.gg — three pages, bilingual RU/EN.

## Pages

- `/` — Championship (main page, countdown, format, verification)
- `/verified` — Arena 1 Verified (independent skill rating system)
- `/trainer` — Timing Trainer (practice item timings with email gate)

## Quick start

```bash
npm install
npm run dev
```

Opens at `http://localhost:5173`

## Build & deploy

```bash
npm run build
```

Vercel auto-deploys from GitHub. SPA routing configured in `vercel.json`.

## Structure

```
src/
├── components/
│   ├── Icons.tsx       # All SVG icons
│   ├── TopNav.tsx      # Shared top navigation
│   └── UI.tsx          # Shared UI atoms (ScanLine, GlitchText, etc.)
├── data/
│   ├── championship.ts # Championship page i18n
│   └── verified.ts     # Verified page i18n
├── hooks/
│   ├── useCountdown.ts
│   └── useLang.tsx     # Language context (RU/EN)
├── pages/
│   ├── Championship.tsx
│   ├── Verified.tsx
│   └── Trainer.tsx
├── App.tsx             # Router
├── main.tsx
└── index.css
```

## Stack

React 18 · TypeScript · Vite 6 · React Router 6
Orbitron + JetBrains Mono (Google Fonts)

## Domain

arena1.gg → Vercel (DNS via Namecheap)
