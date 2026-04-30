import { useState, useEffect, useRef, useCallback, type FC } from "react";
import { useLang } from "../hooks/useLang";
import { useIsMobile } from "../hooks/useIsMobile";
import { ScanLine, BODY_FONT } from "../components/UI";
import { C } from "../theme";

interface Card { pickup: number; respawn: number; offset: number; itemType: string; }
interface Err { pickup: number; correct: number; yours: number | null; type: string; }

const T = {
  ru: {
    title: "TIMING TRAINER", subtitle: "Тренажёр таймингов Arena FPS", tgBtn: "Тренироваться в Telegram",
    modeRA: "RA / YA", modeMH: "Mega Health", modeMix: "Mix",
    modeRASub: "+25 сек", modeMHSub: "+35 сек", modeMixSub: "случайно",
    start: "Начать тренировку", startDesc: "60 карточек · все секунды от :00 до :59",
    check: "Проверить", next: "Далее",
    correct: "верно", wrong: "ошибки", time: "время", card: "карточка",
    qPre: "Подобрали в", qSuf: "Следующий респаун?", ph: "00",
    res: { title: "Результаты", accuracy: "точность", totalTime: "общее время", avgTime: "среднее/карта", errors: "ОШИБКИ", pickup: "подобрал", you: "твой ответ", cor: "верно", retry: "Повторить", back: "К режимам",
      emailGate: "Подробный разбор ошибок", emailDesc: "Какие тайминги западают и где именно ошибся — на твой email.",
      emailPh: "email@example.com", emailBtn: "Получить", emailDone: "Результаты отправлены" },
    grades: {
      perfect: { t: "Интернализировано", f: "Тайминги в автомате. Следующий этап — вербализация в игре." },
      great: { t: "Отлично", f: "Почти идеально. Ещё пару дней — и будет автомат." },
      good: { t: "Хорошо", f: "Основа есть. Продолжай — фокус на скорость." },
      progress: { t: "Прогресс", f: "Работай над ошибками. Повтори карточки отдельно." },
      practice: { t: "Нужна практика", f: "Начни с одной группы. Не спеши." },
    },
  },
  en: {
    title: "TIMING TRAINER", subtitle: "Arena FPS timing trainer", tgBtn: "Train in Telegram",
    modeRA: "RA / YA", modeMH: "Mega Health", modeMix: "Mix",
    modeRASub: "+25 sec", modeMHSub: "+35 sec", modeMixSub: "random",
    start: "Start training", startDesc: "60 cards · all seconds from :00 to :59",
    check: "Check", next: "Next",
    correct: "correct", wrong: "wrong", time: "time", card: "card",
    qPre: "Picked up at", qSuf: "Next respawn?", ph: "00",
    res: { title: "Results", accuracy: "accuracy", totalTime: "total time", avgTime: "avg/card", errors: "ERRORS", pickup: "pickup", you: "your answer", cor: "correct", retry: "Retry", back: "Back to modes",
      emailGate: "Detailed error breakdown", emailDesc: "Which timings are weak and where exactly you missed — to your email.",
      emailPh: "email@example.com", emailBtn: "Get results", emailDone: "Results sent" },
    grades: {
      perfect: { t: "Internalized", f: "Timings are automatic. Next step — verbalization in-game." },
      great: { t: "Excellent", f: "Almost perfect. A few more days and it's automatic." },
      good: { t: "Good", f: "Foundation is there. Keep going — focus on speed." },
      progress: { t: "Progress", f: "Work on mistakes. Repeat error cards separately." },
      practice: { t: "Need practice", f: "Start with one group. Don't rush." },
    },
  },
};

const fmt = (s: number) => ":" + String(s).padStart(2, "0");
const fmtT = (ms: number) => { const s = Math.floor(ms / 1000); return Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0"); };
const GRADE_C: Record<string, string> = { perfect: "#ffd700", great: "#00f0ff", good: "#4ade80", progress: "#fbbf24", practice: "#888" };

function genCards(mode: number | string): Card[] {
  const times = Array.from({ length: 60 }, (_, i) => i);
  for (let i = times.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [times[i], times[j]] = [times[j], times[i]]; }
  return times.map((t) => {
    const offset = mode === "mix" ? (Math.random() > 0.5 ? 25 : 35) : (mode as number);
    return { pickup: t, respawn: (t + offset) % 60, offset, itemType: offset === 25 ? "RA/YA (+25)" : "MH (+35)" };
  });
}

function getGrade(acc: number, min: number) {
  if (acc >= 95 && min <= 3) return "perfect";
  if (acc >= 90 && min <= 4) return "great";
  if (acc >= 80) return "good";
  if (acc >= 60) return "progress";
  return "practice";
}

const Trainer: FC = () => {
  const { lang } = useLang();
  const mob = useIsMobile();
  const t = T[lang];
  const [screen, setScreen] = useState<"start" | "play" | "results">("start");
  const [mode, setMode] = useState<number | string>(25);
  const [cards, setCards] = useState<Card[]>([]);
  const [idx, setIdx] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [errors, setErrors] = useState<Err[]>([]);
  const [input, setInput] = useState("");
  const [checked, setChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [unlocked, setUnlocked] = useState(false);
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [startTime, setStartTime] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (screen !== "play") return;
    const id = setInterval(() => setElapsed(Date.now() - startTime), 200);
    return () => clearInterval(id);
  }, [screen, startTime]);

  const startTraining = () => {
    setCards(genCards(mode)); setIdx(0); setCorrect(0); setWrong(0); setErrors([]);
    setInput(""); setChecked(false); setIsCorrect(null);
    setUnlocked(false); setEmail(""); setEmailSent(false);
    setStartTime(Date.now()); setElapsed(0); setScreen("play");
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const checkAnswer = useCallback(() => {
    if (checked || !cards.length) return;
    const num = parseInt(input.replace(":", "").trim(), 10);
    const valid = !isNaN(num) && num >= 0 && num <= 59;
    const ok = valid && num === cards[idx].respawn;
    setChecked(true); setIsCorrect(ok);
    if (ok) setCorrect((p) => p + 1);
    else { setWrong((p) => p + 1); setErrors((p) => [...p, { pickup: cards[idx].pickup, correct: cards[idx].respawn, yours: valid ? num : null, type: cards[idx].itemType }]); }
  }, [checked, cards, idx, input]);

  const nextCard = useCallback(() => {
    if (idx + 1 >= 60) { setScreen("results"); return; }
    setIdx((p) => p + 1); setInput(""); setChecked(false); setIsCorrect(null);
    setTimeout(() => inputRef.current?.focus(), 50);
  }, [idx]);

  const handleKey = useCallback((e: KeyboardEvent) => {
    if (e.key === "Enter" && screen === "play") { if (!checked) checkAnswer(); else nextCard(); }
  }, [screen, checked, checkAnswer, nextCard]);

  useEffect(() => { document.addEventListener("keydown", handleKey); return () => document.removeEventListener("keydown", handleKey); }, [handleKey]);

  const submitEmail = () => { if (email.includes("@")) { setEmailSent(true); setTimeout(() => setUnlocked(true), 1200); } };
  const accuracy = cards.length ? Math.round((correct / Math.max(correct + wrong, 1)) * 100) : 0;
  const grade = getGrade(accuracy, elapsed / 60000);
  const gd = t.grades[grade as keyof typeof t.grades];

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "calc(100vh - 48px)", padding: mob ? "60px 12px 16px" : "68px 20px 20px", overflowX: "hidden" }}>
      <ScanLine />
      <div style={{ maxWidth: 520, width: "100%" }}>

        {screen === "start" && (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 11, letterSpacing: 6, color: "#ff3e3e", marginBottom: 8, fontWeight: 600 }}>A R E N A  1</div>
            <h1 style={{ fontSize: "clamp(28px,6vw,42px)", fontWeight: 900, color: C.heading, margin: "0 0 8px", letterSpacing: 2 }}>{t.title}</h1>
            <div style={{ fontFamily: BODY_FONT, fontSize: 13, color: C.muted, marginBottom: 20 }}>{t.subtitle}</div>
            <a href="https://t.me/quaketimingbot" target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", padding: mob ? "10px 20px" : "12px 32px", background: "#fbbf24", border: "none", color: "#08080c", fontSize: mob ? 10 : 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer", fontFamily: "'Orbitron',monospace", textDecoration: "none", marginBottom: mob ? 28 : 40 }}>{t.tgBtn}</a>
            <div style={{ display: "flex", gap: 2, marginBottom: 32 }}>
              {([{ m: 25, l: t.modeRA, s: t.modeRASub }, { m: 35, l: t.modeMH, s: t.modeMHSub }, { m: "mix", l: t.modeMix, s: t.modeMixSub }] as const).map((o) => (
                <button key={String(o.m)} onClick={() => setMode(o.m)} style={{ flex: 1, padding: mob ? "14px 6px" : "20px 12px", background: mode === o.m ? "rgba(255,62,62,0.08)" : C.bgCard, border: "none", borderTop: mode === o.m ? "3px solid #ff3e3e" : `3px solid ${C.border}`, cursor: "pointer", textAlign: "center" }}>
                  <div style={{ fontSize: mob ? 12 : 14, fontWeight: 700, color: mode === o.m ? "#ff3e3e" : C.body, fontFamily: "'Orbitron',monospace" }}>{o.l}</div>
                  <div style={{ fontFamily: BODY_FONT, fontSize: mob ? 10 : 11, color: C.muted, marginTop: 6 }}>{o.s}</div>
                </button>
              ))}
            </div>
            <button onClick={startTraining} style={{ width: "100%", padding: 16, background: "#ff3e3e", border: "none", color: "#fff", fontSize: 13, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", cursor: "pointer", fontFamily: "'Orbitron',monospace" }}>{t.start}</button>
            <div style={{ fontFamily: BODY_FONT, fontSize: 11, color: C.subtle, marginTop: 12 }}>{t.startDesc}</div>
          </div>
        )}

        {screen === "play" && cards.length > 0 && (
          <div>
            <div style={{ height: 3, background: C.border, marginBottom: 20, overflow: "hidden" }}><div style={{ height: "100%", width: `${(idx / 60) * 100}%`, background: "linear-gradient(90deg,#ff3e3e,#ff8800)", transition: "width 0.3s" }} /></div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", marginBottom: 16 }}>
              {[{ v: correct, c: "#4ade80", l: t.correct }, { v: wrong, c: "#f87171", l: t.wrong }, { v: fmtT(elapsed), c: "#fbbf24", l: t.time }, { v: `${idx + 1}/60`, c: C.body, l: t.card }].map((s, i) => (
                <div key={i} style={{ textAlign: "center" }}><div style={{ fontFamily: BODY_FONT, fontSize: 20, fontWeight: 700, color: s.c }}>{s.v}</div><div style={{ fontSize: 9, letterSpacing: 2, color: C.muted, textTransform: "uppercase" }}>{s.l}</div></div>
              ))}
            </div>
            <div style={{ background: checked ? (isCorrect ? "rgba(74,222,128,0.06)" : "rgba(248,113,113,0.06)") : C.bgCard, border: checked ? `2px solid ${isCorrect ? "#4ade80" : "#f87171"}` : `2px solid ${C.border}`, padding: mob ? "28px 16px" : "40px 24px", textAlign: "center", marginBottom: 20, transition: "all 0.3s" }}>
              <div style={{ fontFamily: BODY_FONT, fontSize: 11, color: C.secondary, marginBottom: 8 }}>{cards[idx].itemType}</div>
              <div style={{ fontSize: "clamp(48px,12vw,72px)", fontWeight: 900, color: "#ff3e3e", fontFamily: "'Orbitron',monospace", lineHeight: 1 }}>{fmt(cards[idx].pickup)}</div>
              <div style={{ fontFamily: BODY_FONT, fontSize: 13, color: C.body, marginTop: 16 }}>{t.qPre} {fmt(cards[idx].pickup)}. {t.qSuf}</div>
              {checked && <div style={{ fontSize: 36, fontWeight: 900, fontFamily: "'Orbitron',monospace", marginTop: 20, color: isCorrect ? "#4ade80" : "#f87171" }}>{fmt(cards[idx].respawn)}</div>}
            </div>
            {!checked ? (
              <div style={{ display: "flex", gap: 8 }}>
                <input ref={inputRef} type="text" inputMode="numeric" maxLength={2} value={input} onChange={(e) => { if (/^\d{0,2}$/.test(e.target.value)) setInput(e.target.value); }} placeholder={t.ph} style={{ flex: 1, padding: 18, fontSize: 28, textAlign: "center", fontWeight: 700, border: `2px solid ${C.inputBorder}`, background: C.inputBg, color: C.heading, outline: "none", fontFamily: "'Orbitron',monospace" }} />
                <button onClick={checkAnswer} style={{ padding: "18px 32px", background: "#ff3e3e", border: "none", color: "#fff", fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer", fontFamily: "'Orbitron',monospace" }}>{t.check}</button>
              </div>
            ) : (
              <button onClick={nextCard} style={{ width: "100%", padding: 18, background: C.bgCard, border: `1px solid ${C.border}`, color: C.heading, fontSize: 13, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", cursor: "pointer", fontFamily: "'Orbitron',monospace" }}>{t.next}</button>
            )}
          </div>
        )}

        {screen === "results" && (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 11, letterSpacing: 6, color: "#ff3e3e", marginBottom: 16, fontWeight: 600 }}>{t.res.title.toUpperCase()}</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: GRADE_C[grade], marginBottom: 12, letterSpacing: 1 }}>{gd.t}</div>
            <div style={{ fontFamily: BODY_FONT, fontSize: 13, color: C.body, marginBottom: 32, lineHeight: 1.6 }}>{gd.f}</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 1, background: "rgba(255,62,62,0.1)", marginBottom: 32 }}>
              {[{ v: `${accuracy}%`, c: "#4ade80", l: t.res.accuracy }, { v: fmtT(elapsed), c: "#fbbf24", l: t.res.totalTime }, { v: `${(elapsed / 60000).toFixed(1)}s`, c: C.body, l: t.res.avgTime }].map((s, i) => (
                <div key={i} style={{ background: C.bg, padding: "24px 16px", transition: "background 0.3s" }}>
                  <div style={{ fontSize: 28, fontWeight: 900, color: s.c, fontFamily: "'Orbitron',monospace" }}>{s.v}</div>
                  <div style={{ fontSize: 9, letterSpacing: 2, color: C.muted, marginTop: 6, textTransform: "uppercase" }}>{s.l}</div>
                </div>
              ))}
            </div>

            {errors.length > 0 && !unlocked && (
              <div style={{ margin: "0 0 32px", padding: "28px 24px", background: C.bgCard, border: `1px solid ${C.border}` }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: C.heading, marginBottom: 6 }}>{t.res.emailGate}</div>
                <div style={{ fontFamily: BODY_FONT, fontSize: 12, color: C.secondary, marginBottom: 24, lineHeight: 1.6 }}>{t.res.emailDesc}</div>
                {!emailSent ? (
                  <div style={{ display: "flex", gap: 8, maxWidth: 400, margin: "0 auto" }}>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t.res.emailPh}
                      onKeyDown={(e) => { if (e.key === "Enter") submitEmail(); }}
                      style={{ flex: 1, padding: "14px 16px", fontSize: 14, border: `2px solid ${C.inputBorder}`, background: C.inputBg, color: C.heading, outline: "none", fontFamily: BODY_FONT }} />
                    <button onClick={submitEmail} style={{ padding: "14px 24px", background: "#ff3e3e", border: "none", color: "#fff", fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer", fontFamily: "'Orbitron',monospace", whiteSpace: "nowrap" }}>{t.res.emailBtn}</button>
                  </div>
                ) : <div style={{ fontFamily: BODY_FONT, fontSize: 13, color: "#00f0ff", fontWeight: 500 }}>{t.res.emailDone}</div>}
              </div>
            )}

            {errors.length > 0 && unlocked && (
              <div style={{ marginBottom: 32, textAlign: "left" }}>
                <div style={{ fontSize: 11, letterSpacing: 3, color: "#f87171", marginBottom: 12, fontWeight: 600 }}>{t.res.errors}</div>
                <div style={{ display: "flex", gap: 2, flexDirection: "column" }}>
                  {errors.map((e, i) => (
                    <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", padding: "12px 16px", background: "rgba(248,113,113,0.04)", borderLeft: "3px solid #f87171" }}>
                      <div><div style={{ fontSize: 9, color: C.muted, letterSpacing: 1, marginBottom: 2 }}>{t.res.pickup}</div><div style={{ fontFamily: BODY_FONT, fontSize: 14, color: C.heading, fontWeight: 700 }}>{fmt(e.pickup)}</div></div>
                      <div><div style={{ fontSize: 9, color: C.muted, letterSpacing: 1, marginBottom: 2 }}>{t.res.you}</div><div style={{ fontFamily: BODY_FONT, fontSize: 14, color: "#f87171", fontWeight: 700 }}>{e.yours !== null ? fmt(e.yours) : "—"}</div></div>
                      <div><div style={{ fontSize: 9, color: C.muted, letterSpacing: 1, marginBottom: 2 }}>{t.res.cor}</div><div style={{ fontFamily: BODY_FONT, fontSize: 14, color: "#4ade80", fontWeight: 700 }}>{fmt(e.correct)}</div></div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={startTraining} style={{ flex: 1, padding: 16, background: "#ff3e3e", border: "none", color: "#fff", fontSize: 12, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", cursor: "pointer", fontFamily: "'Orbitron',monospace" }}>{t.res.retry}</button>
              <button onClick={() => setScreen("start")} style={{ flex: 1, padding: 16, background: "transparent", border: `1px solid ${C.subtle}`, color: C.body, fontSize: 12, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", cursor: "pointer", fontFamily: "'Orbitron',monospace" }}>{t.res.back}</button>
            </div>
          </div>
        )}
      </div>
      <div style={{ fontSize: 10, color: C.muted, letterSpacing: 2, marginTop: 40, opacity: 0.5, textAlign: "center" }}>developed by <a href="https://selzio.com" target="_blank" rel="noopener noreferrer" style={{ color: "inherit", textDecoration: "underline" }}>selzio.com</a></div>
    </div>
  );
};

export default Trainer;
