import { useState, useRef, useCallback, type FC, type CSSProperties } from "react";
import { useLang } from "../hooks/useLang";
import { useIsMobile } from "../hooks/useIsMobile";
import { BODY_FONT } from "../components/UI";
import { Seo } from "../components/Seo";
import { C } from "../theme";

// ВНИМАНИЕ: тестовая (скрытая) страница — WIP HUD-редактор для Quake Live.
// Не в навигации, не в пререндере, noindex. Вдохновлено namad/visualHUD.

const ACCENT = "#fbbf24";
const HEAD_FONT = "'Xolonium','Tektur',monospace";

type ElemType = "health" | "armor" | "ammo" | "timer" | "score" | "powerup" | "name" | "fps" | "text";

interface HudElem {
  id: string;
  type: ElemType;
  label: string; // имя в списке
  x: number; // % по ширине (центр)
  y: number; // % по высоте (центр)
  scale: number; // 0.5–2
  color: string;
  value: string; // отображаемое значение/текст
  visible: boolean;
  colorEditable: boolean;
  valueEditable: boolean;
}

const ICONS: Partial<Record<ElemType, string>> = {
  health: "✚", armor: "◈", ammo: "▣", powerup: "✦", timer: "⏱", score: "⚔",
};

const DEFAULTS: Omit<HudElem, "id">[] = [
  { type: "timer",   label: "Game Clock", x: 50, y: 6,  scale: 1, color: "#ffffff", value: "08:00", visible: true, colorEditable: true, valueEditable: true },
  { type: "score",   label: "Score",      x: 50, y: 15, scale: 1, color: "#ffffff", value: "12 : 9", visible: true, colorEditable: true, valueEditable: true },
  { type: "fps",     label: "FPS",        x: 94, y: 6,  scale: 0.8, color: "#7a7a7a", value: "125", visible: false, colorEditable: true, valueEditable: true },
  { type: "powerup", label: "Powerup",    x: 6,  y: 50, scale: 1, color: "#b066ff", value: "0:18", visible: false, colorEditable: true, valueEditable: true },
  { type: "health",  label: "Health",     x: 16, y: 90, scale: 1, color: "#ff4444", value: "100", visible: true, colorEditable: true, valueEditable: true },
  { type: "armor",   label: "Armor",      x: 33, y: 90, scale: 1, color: "#ffd24a", value: "50",  visible: true, colorEditable: true, valueEditable: true },
  { type: "ammo",    label: "Ammo",       x: 84, y: 90, scale: 1, color: "#4ade80", value: "25",  visible: true, colorEditable: true, valueEditable: true },
  { type: "name",    label: "Player Name", x: 50, y: 96, scale: 0.9, color: "#cfcfcf", value: "Player", visible: false, colorEditable: true, valueEditable: true },
];

const makeDefaults = (): HudElem[] => DEFAULTS.map((d, i) => ({ ...d, id: `${d.type}-${i}` }));

const T = {
  ru: {
    title: "HUD EDITOR", subtitle: "Редактор HUD для Quake Live · тестовая версия (WIP)",
    wip: "Это тестовая страница, инструмент в разработке",
    elements: "Элементы", properties: "Свойства", noSel: "Выбери элемент на экране или включи в списке",
    visible: "Показывать", posX: "Позиция X", posY: "Позиция Y", scale: "Размер", color: "Цвет", value: "Значение",
    export: "Экспорт JSON", reset: "Сбросить", hint: "Перетаскивай элементы мышью. Клик — выбрать.",
  },
  en: {
    title: "HUD EDITOR", subtitle: "Quake Live HUD editor · test build (WIP)",
    wip: "Test page, tool is work in progress",
    elements: "Elements", properties: "Properties", noSel: "Select an element on screen or enable it in the list",
    visible: "Visible", posX: "Position X", posY: "Position Y", scale: "Scale", color: "Color", value: "Value",
    export: "Export JSON", reset: "Reset", hint: "Drag elements with the mouse. Click to select.",
  },
};

// Визуальное представление элемента HUD на превью.
const ElemVisual: FC<{ el: HudElem }> = ({ el }) => {
  const icon = ICONS[el.type];
  const big: CSSProperties = { fontFamily: HEAD_FONT, fontWeight: 900, lineHeight: 1, textShadow: "0 2px 4px rgba(0,0,0,0.8)" };

  if (el.type === "timer" || el.type === "fps")
    return <div style={{ ...big, fontSize: 30, color: el.color }}>{el.value}</div>;
  if (el.type === "score")
    return <div style={{ ...big, fontSize: 26, color: el.color, letterSpacing: 2 }}>{el.value}</div>;
  if (el.type === "name")
    return <div style={{ fontFamily: BODY_FONT, fontSize: 16, color: el.color, fontWeight: 700, textShadow: "0 2px 4px rgba(0,0,0,0.8)" }}>{el.value}</div>;
  if (el.type === "powerup")
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <span style={{ fontSize: 26, color: el.color, textShadow: "0 0 10px " + el.color }}>{icon}</span>
        <span style={{ ...big, fontSize: 22, color: "#fff" }}>{el.value}</span>
      </div>
    );
  // health / armor / ammo: иконка + крупное число
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <span style={{ fontSize: 28, color: el.color, textShadow: "0 0 8px " + el.color + "88" }}>{icon}</span>
      <span style={{ ...big, fontSize: 44, color: el.color }}>{el.value}</span>
    </div>
  );
};

const HudEditor: FC = () => {
  const { lang } = useLang();
  const mob = useIsMobile();
  const t = T[lang];
  const [elems, setElems] = useState<HudElem[]>(makeDefaults);
  const [selId, setSelId] = useState<string | null>(null);
  const screenRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ id: string } | null>(null);

  const sel = elems.find((e) => e.id === selId) ?? null;
  const update = (id: string, patch: Partial<HudElem>) =>
    setElems((prev) => prev.map((e) => (e.id === id ? { ...e, ...patch } : e)));

  const onPointerDown = (e: React.PointerEvent, id: string) => {
    e.preventDefault();
    setSelId(id);
    dragRef.current = { id };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onPointerMove = useCallback((e: React.PointerEvent) => {
    const d = dragRef.current;
    const rect = screenRef.current?.getBoundingClientRect();
    if (!d || !rect) return;
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
    update(d.id, { x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 });
  }, []);
  const onPointerUp = () => { dragRef.current = null; };

  const exportJson = () => {
    const data = JSON.stringify(elems.filter((e) => e.visible).map(({ id, label, colorEditable, valueEditable, ...rest }) => { void id; void label; void colorEditable; void valueEditable; return rest; }), null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "arena1-hud.json";
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const panel: CSSProperties = { background: C.bgCard, border: `1px solid ${C.border}`, padding: 16 };
  const lbl: CSSProperties = { fontFamily: BODY_FONT, fontSize: 11, color: C.muted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6, display: "block" };

  return (
    <div style={{ minHeight: "calc(100vh - 48px)", padding: mob ? "60px 12px 24px" : "72px 20px 32px", overflowX: "hidden" }}>
      <Seo path="/skill/hud" title="HUD Editor (WIP)" description="Тестовый редактор HUD для Quake Live." noindex />
      <div style={{ maxWidth: 1280, width: "100%", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 8 }}>
          <div style={{ fontSize: 11, letterSpacing: 6, color: ACCENT, marginBottom: 8, fontWeight: 600 }}>A R E N A  1</div>
          <h1 style={{ fontSize: "clamp(26px,5vw,38px)", fontWeight: 900, color: C.heading, margin: "0 0 6px", letterSpacing: 2, fontFamily: HEAD_FONT }}>{t.title}</h1>
          <div style={{ fontFamily: BODY_FONT, fontSize: 13, color: C.muted }}>{t.subtitle}</div>
        </div>
        <div style={{ textAlign: "center", marginBottom: 20, fontFamily: BODY_FONT, fontSize: 11, color: "#ff8800", letterSpacing: 1 }}>⚠ {t.wip}</div>

        <div style={{ display: "flex", flexDirection: mob ? "column" : "row", gap: 16, alignItems: "flex-start" }}>
          {/* Превью игрового экрана 16:9 */}
          <div style={{ flex: "1 1 auto", width: "100%", minWidth: 0 }}>
            <div
              ref={screenRef}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerLeave={onPointerUp}
              style={{
                position: "relative", width: "100%", aspectRatio: "16 / 9",
                background: "linear-gradient(160deg,#1a2230,#0c0f16)",
                border: `1px solid ${C.border}`, overflow: "hidden",
                touchAction: "none", userSelect: "none",
              }}
            >
              {/* центр-маркер прицела */}
              <div style={{ position: "absolute", left: "50%", top: "50%", width: 6, height: 6, marginLeft: -3, marginTop: -3, border: "1px solid rgba(255,255,255,0.4)", borderRadius: "50%" }} />
              {elems.filter((e) => e.visible).map((el) => (
                <div
                  key={el.id}
                  onPointerDown={(e) => onPointerDown(e, el.id)}
                  style={{
                    position: "absolute", left: `${el.x}%`, top: `${el.y}%`,
                    transform: `translate(-50%,-50%) scale(${el.scale})`,
                    cursor: "move", padding: 4,
                    outline: selId === el.id ? `1px dashed ${ACCENT}` : "1px solid transparent",
                  }}
                >
                  <ElemVisual el={el} />
                </div>
              ))}
            </div>
            <div style={{ fontFamily: BODY_FONT, fontSize: 11, color: C.muted, marginTop: 8, textAlign: "center" }}>{t.hint}</div>
          </div>

          {/* Сайдбар: список элементов + свойства */}
          <div style={{ flex: mob ? "1 1 auto" : "0 0 280px", width: mob ? "100%" : 280, display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={panel}>
              <div style={{ fontFamily: HEAD_FONT, fontSize: 12, fontWeight: 700, color: ACCENT, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>{t.elements}</div>
              {elems.map((el) => (
                <div key={el.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0" }}>
                  <input type="checkbox" checked={el.visible} onChange={(e) => update(el.id, { visible: e.target.checked })} style={{ accentColor: ACCENT, cursor: "pointer" }} />
                  <button onClick={() => setSelId(el.id)} style={{
                    flex: 1, textAlign: "left", background: "none", border: "none", cursor: "pointer",
                    fontFamily: BODY_FONT, fontSize: 13, padding: 0,
                    color: selId === el.id ? ACCENT : el.visible ? C.body : C.subtle,
                  }}>{el.label}</button>
                </div>
              ))}
            </div>

            <div style={panel}>
              <div style={{ fontFamily: HEAD_FONT, fontSize: 12, fontWeight: 700, color: ACCENT, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>{t.properties}</div>
              {!sel ? (
                <div style={{ fontFamily: BODY_FONT, fontSize: 12, color: C.muted, lineHeight: 1.6 }}>{t.noSel}</div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <label style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: BODY_FONT, fontSize: 12, color: C.body, cursor: "pointer" }}>
                    <input type="checkbox" checked={sel.visible} onChange={(e) => update(sel.id, { visible: e.target.checked })} style={{ accentColor: ACCENT }} /> {t.visible}
                  </label>
                  {sel.valueEditable && (
                    <div>
                      <span style={lbl}>{t.value}</span>
                      <input type="text" value={sel.value} onChange={(e) => update(sel.id, { value: e.target.value })}
                        style={{ width: "100%", padding: "8px 10px", fontSize: 14, fontFamily: BODY_FONT, background: C.inputBg, border: `1px solid ${C.inputBorder}`, color: C.heading, outline: "none", boxSizing: "border-box" }} />
                    </div>
                  )}
                  <div>
                    <span style={lbl}>{t.posX}: {sel.x}%</span>
                    <input type="range" min={0} max={100} step={0.5} value={sel.x} onChange={(e) => update(sel.id, { x: +e.target.value })} style={{ width: "100%", accentColor: ACCENT }} />
                  </div>
                  <div>
                    <span style={lbl}>{t.posY}: {sel.y}%</span>
                    <input type="range" min={0} max={100} step={0.5} value={sel.y} onChange={(e) => update(sel.id, { y: +e.target.value })} style={{ width: "100%", accentColor: ACCENT }} />
                  </div>
                  <div>
                    <span style={lbl}>{t.scale}: {sel.scale.toFixed(2)}×</span>
                    <input type="range" min={0.5} max={2} step={0.05} value={sel.scale} onChange={(e) => update(sel.id, { scale: +e.target.value })} style={{ width: "100%", accentColor: ACCENT }} />
                  </div>
                  {sel.colorEditable && (
                    <div>
                      <span style={lbl}>{t.color}</span>
                      <input type="color" value={sel.color} onChange={(e) => update(sel.id, { color: e.target.value })} style={{ width: "100%", height: 34, background: C.inputBg, border: `1px solid ${C.inputBorder}`, cursor: "pointer" }} />
                    </div>
                  )}
                </div>
              )}
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={exportJson} style={{ flex: 1, padding: "12px 8px", background: ACCENT, border: "none", color: "#08080c", fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", cursor: "pointer", fontFamily: HEAD_FONT }}>{t.export}</button>
              <button onClick={() => { setElems(makeDefaults()); setSelId(null); }} style={{ flex: 1, padding: "12px 8px", background: "transparent", border: `1px solid ${C.subtle}`, color: C.body, fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", cursor: "pointer", fontFamily: HEAD_FONT }}>{t.reset}</button>
            </div>
          </div>
        </div>

        <div style={{ fontSize: 10, color: C.muted, letterSpacing: 2, marginTop: 32, opacity: 0.5, textAlign: "center" }}>
          developed by <a href="https://selzio.com" target="_blank" rel="noopener noreferrer" style={{ color: "inherit", textDecoration: "underline" }}>selzio.com</a>
        </div>
      </div>
    </div>
  );
};

export default HudEditor;
