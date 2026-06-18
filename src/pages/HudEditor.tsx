import { useState, useRef, type FC, type CSSProperties, type ChangeEvent } from "react";
import { useLang } from "../hooks/useLang";
import { useIsMobile } from "../hooks/useIsMobile";
import { BODY_FONT } from "../components/UI";
import { Seo } from "../components/Seo";
import { C } from "../theme";
import { exportHud, type HudItem, type HudPreset } from "../hud/export";
import { ELEMENT_LIBRARY, ELEMENT_ORDER, DEFAULT_PRESET } from "../hud/presets";

// СКРЫТАЯ тестовая страница (WIP). Адаптация visualHUD (by namad) — редактор HUD
// для Quake Live с экспортом в игру (.cfg/.menu). Не в навигации/пререндере, noindex.

const ACCENT = "#fbbf24";
const HEAD_FONT = "'Xolonium','Tektur',monospace";
const VW = 640, VH = 480; // виртуальная сетка QL

const T = {
  ru: {
    title: "HUD EDITOR", subtitle: "Редактор HUD для Quake Live · адаптация visualHUD (WIP)",
    wip: "Тестовая страница, инструмент в разработке",
    add: "Добавить элемент", elements: "Элементы сцены", props: "Свойства",
    noSel: "Выбери элемент на экране или добавь из списка",
    posX: "X", posY: "Y", w: "Ширина", h: "Высота", textColor: "Цвет текста", textSize: "Размер текста",
    opacity: "Прозрачность фона", value: "Значение", ranges: "Цветовые диапазоны", remove: "Удалить элемент",
    dlMenu: "Скачать .menu", dlCfg: "Скачать .cfg", importV: "Импорт .vhud", reset: "Сброс",
    hint: "Перетаскивай элементы. Сетка 640×480 как в игре.",
    installT: "Установка в Quake Live",
    install: [
      "1. Скачай .cfg и .menu (кнопки выше).",
      "2. Положи оба файла в папку игры: …/quakelive/home/baseq3/ui/",
      "3. В autoexec.cfg (в baseq3) добавь строку: seta cg_hudFiles \"ui/arena1.cfg\"",
      "4. Перезапусти Quake Live.",
    ],
  },
  en: {
    title: "HUD EDITOR", subtitle: "Quake Live HUD editor · visualHUD adaptation (WIP)",
    wip: "Test page, tool is work in progress",
    add: "Add element", elements: "Scene elements", props: "Properties",
    noSel: "Select an element on screen or add one from the list",
    posX: "X", posY: "Y", w: "Width", h: "Height", textColor: "Text color", textSize: "Text size",
    opacity: "Background opacity", value: "Value", ranges: "Color ranges", remove: "Remove element",
    dlMenu: "Download .menu", dlCfg: "Download .cfg", importV: "Import .vhud", reset: "Reset",
    hint: "Drag elements. 640×480 grid, same as in-game.",
    installT: "Install in Quake Live",
    install: [
      "1. Download .cfg and .menu (buttons above).",
      "2. Put both files into: …/quakelive/home/baseq3/ui/",
      "3. In autoexec.cfg (in baseq3) add: seta cg_hudFiles \"ui/arena1.cfg\"",
      "4. Restart Quake Live.",
    ],
  },
};

const ICON: Record<string, string> = {
  healthIndicator: "✚", armorIndicator: "◈", ammoIndicator: "▣", timer: "⏱",
  scoreBox: "⚔", powerupIndicator: "✦", playerItem: "◆", CTFPowerupIndicator: "✦",
  flagIndicator: "⚑", chatArea: "▭", rectangleBox: "▢",
};

const download = (filename: string, text: string) => {
  const blob = new Blob([text], { type: "text/plain" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
};

// визуал элемента в превью
const Visual: FC<{ it: HudItem }> = ({ it }) => {
  const col = "#" + (it.textColor || "FFFFFF");
  if (it.itemType === "rect" || it.name === "chatArea") {
    const a = Number(it.opacity ?? 60) / 100;
    return <div style={{ width: "100%", height: "100%", background: `#${it.color || "000000"}`, opacity: a, border: "1px solid rgba(255,255,255,0.25)" }} />;
  }
  if (it.itemType === "iconItem")
    return <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: col, fontSize: 14, textShadow: "0 1px 2px #000" }}>{ICON[it.name]}</div>;
  // general / score: иконка + значение
  return (
    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", gap: 4, color: col, fontFamily: HEAD_FONT, fontWeight: 900, textShadow: "0 2px 3px rgba(0,0,0,0.9)", whiteSpace: "nowrap", lineHeight: 1 }}>
      <span style={{ fontSize: "0.55em", opacity: 0.9 }}>{ICON[it.name]}</span>
      <span style={{ fontSize: "1em" }}>{it.text ?? "0"}</span>
    </div>
  );
};

const HudEditor: FC = () => {
  const { lang } = useLang();
  const mob = useIsMobile();
  const t = T[lang];
  const [items, setItems] = useState<HudItem[]>(() => DEFAULT_PRESET.items.map((i) => ({ ...i })));
  const [selIdx, setSelIdx] = useState<number | null>(0);
  const [showAdd, setShowAdd] = useState(false);
  const screenRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ idx: number; ox: number; oy: number } | null>(null);

  const sel = selIdx != null ? items[selIdx] : null;
  const patch = (idx: number, p: Partial<HudItem>) =>
    setItems((prev) => prev.map((it, i) => (i === idx ? { ...it, ...p } : it)));
  const patchCoord = (idx: number, key: "left" | "top" | "width" | "height", v: number) =>
    setItems((prev) => prev.map((it, i) => (i === idx ? { ...it, coordinates: { ...it.coordinates, [key]: v } } : it)));

  const scale = () => (screenRef.current ? screenRef.current.getBoundingClientRect().width / VW : 1);

  const onDown = (e: React.PointerEvent, idx: number) => {
    e.preventDefault();
    setSelIdx(idx);
    const s = scale();
    drag.current = { idx, ox: e.clientX / s - items[idx].coordinates.left, oy: e.clientY / s - items[idx].coordinates.top };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d) return;
    const s = scale();
    const left = Math.round(Math.max(0, Math.min(VW - 4, e.clientX / s - d.ox)));
    const top = Math.round(Math.max(0, Math.min(VH - 4, e.clientY / s - d.oy)));
    patchCoord(d.idx, "left", left);
    patchCoord(d.idx, "top", top);
  };
  const onUp = () => { drag.current = null; };

  const addElement = (key: string) => {
    setItems((prev) => [...prev, ELEMENT_LIBRARY[key]()]);
    setSelIdx(items.length);
    setShowAdd(false);
  };
  const removeSel = () => {
    if (selIdx == null) return;
    setItems((prev) => prev.filter((_, i) => i !== selIdx));
    setSelIdx(null);
  };

  const doExport = (kind: "menu" | "cfg") => {
    const preset: HudPreset = { name: "arena1", items };
    const { cfg, menu } = exportHud(preset);
    if (kind === "menu") download("arena1.menu", menu);
    else download("arena1.cfg", cfg);
  };

  const onImport = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const j = JSON.parse(String(reader.result));
        const preset = Array.isArray(j) ? j[0] : j;
        if (preset?.items?.length) { setItems(preset.items); setSelIdx(0); }
      } catch { /* игнор битого файла */ }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const panel: CSSProperties = { background: C.bgCard, border: `1px solid ${C.border}`, padding: 14 };
  const lbl: CSSProperties = { fontFamily: BODY_FONT, fontSize: 10, color: C.muted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4, display: "block" };
  const inp: CSSProperties = { width: "100%", padding: "6px 8px", fontSize: 13, fontFamily: BODY_FONT, background: C.inputBg, border: `1px solid ${C.inputBorder}`, color: C.heading, outline: "none", boxSizing: "border-box" };
  const btn = (bg: string, fg: string): CSSProperties => ({ padding: "10px 8px", background: bg, border: bg === "transparent" ? `1px solid ${C.subtle}` : "none", color: fg, fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", cursor: "pointer", fontFamily: HEAD_FONT });

  return (
    <div style={{ minHeight: "calc(100vh - 48px)", padding: mob ? "60px 12px 24px" : "72px 20px 32px", overflowX: "hidden" }}>
      <Seo path="/skill/hud" title="HUD Editor (WIP)" description="Тестовый редактор HUD для Quake Live с экспортом в игру." noindex />
      <div style={{ maxWidth: 1280, width: "100%", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 6 }}>
          <div style={{ fontSize: 11, letterSpacing: 6, color: ACCENT, marginBottom: 8, fontWeight: 600 }}>A R E N A  1</div>
          <h1 style={{ fontSize: "clamp(26px,5vw,38px)", fontWeight: 900, color: C.heading, margin: "0 0 6px", letterSpacing: 2, fontFamily: HEAD_FONT }}>{t.title}</h1>
          <div style={{ fontFamily: BODY_FONT, fontSize: 13, color: C.muted }}>{t.subtitle}</div>
        </div>
        <div style={{ textAlign: "center", marginBottom: 18, fontFamily: BODY_FONT, fontSize: 11, color: "#ff8800" }}>⚠ {t.wip}</div>

        <div style={{ display: "flex", flexDirection: mob ? "column" : "row", gap: 16, alignItems: "flex-start" }}>
          {/* Превью 640×480 */}
          <div style={{ flex: "1 1 auto", width: "100%", minWidth: 0 }}>
            <div
              ref={screenRef}
              onPointerMove={onMove}
              onPointerUp={onUp}
              onPointerLeave={onUp}
              style={{ position: "relative", width: "100%", aspectRatio: "4 / 3", background: "linear-gradient(160deg,#222d3d,#0c0f16)", border: `1px solid ${C.border}`, overflow: "hidden", touchAction: "none", userSelect: "none" }}
            >
              <div style={{ position: "absolute", left: "50%", top: "50%", width: 6, height: 6, marginLeft: -3, marginTop: -3, border: "1px solid rgba(255,255,255,0.4)", borderRadius: "50%" }} />
              {items.map((it, idx) => (
                <div
                  key={idx}
                  onPointerDown={(e) => onDown(e, idx)}
                  style={{
                    position: "absolute",
                    left: `${(it.coordinates.left / VW) * 100}%`,
                    top: `${(it.coordinates.top / VH) * 100}%`,
                    width: `${(it.coordinates.width / VW) * 100}%`,
                    height: `${(it.coordinates.height / VH) * 100}%`,
                    cursor: "move",
                    outline: selIdx === idx ? `1px dashed ${ACCENT}` : "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <Visual it={it} />
                </div>
              ))}
            </div>
            <div style={{ fontFamily: BODY_FONT, fontSize: 11, color: C.muted, marginTop: 8, textAlign: "center" }}>{t.hint}</div>

            {/* Экспорт + установка */}
            <div style={{ display: "flex", gap: 8, marginTop: 14, flexWrap: "wrap" }}>
              <button onClick={() => doExport("cfg")} style={{ ...btn(ACCENT, "#08080c"), flex: 1 }}>{t.dlCfg}</button>
              <button onClick={() => doExport("menu")} style={{ ...btn(ACCENT, "#08080c"), flex: 1 }}>{t.dlMenu}</button>
              <label style={{ ...btn("transparent", C.body), flex: 1, textAlign: "center" }}>
                {t.importV}
                <input type="file" accept=".vhud,.json,application/json" onChange={onImport} style={{ display: "none" }} />
              </label>
              <button onClick={() => { setItems(DEFAULT_PRESET.items.map((i) => ({ ...i }))); setSelIdx(0); }} style={{ ...btn("transparent", C.body), flex: 1 }}>{t.reset}</button>
            </div>
            <div style={{ ...panel, marginTop: 14 }}>
              <div style={{ fontFamily: HEAD_FONT, fontSize: 11, fontWeight: 700, color: ACCENT, letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>{t.installT}</div>
              {t.install.map((line, i) => (
                <div key={i} style={{ fontFamily: BODY_FONT, fontSize: 12, color: C.secondary, lineHeight: 1.7 }}>{line}</div>
              ))}
            </div>
          </div>

          {/* Сайдбар */}
          <div style={{ flex: mob ? "1 1 auto" : "0 0 300px", width: mob ? "100%" : 300, display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={panel}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <span style={{ fontFamily: HEAD_FONT, fontSize: 11, fontWeight: 700, color: ACCENT, letterSpacing: 2, textTransform: "uppercase" }}>{t.elements}</span>
                <button onClick={() => setShowAdd((v) => !v)} style={{ background: "none", border: `1px solid ${ACCENT}`, color: ACCENT, cursor: "pointer", fontSize: 11, padding: "3px 8px", fontFamily: HEAD_FONT }}>+ {t.add}</button>
              </div>
              {showAdd && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 10, paddingBottom: 10, borderBottom: `1px solid ${C.border}` }}>
                  {ELEMENT_ORDER.map((k) => (
                    <button key={k} onClick={() => addElement(k)} style={{ background: C.bg, border: `1px solid ${C.border}`, color: C.body, cursor: "pointer", fontSize: 11, padding: "5px 8px", fontFamily: BODY_FONT }}>{ELEMENT_LIBRARY[k]().label}</button>
                  ))}
                </div>
              )}
              {items.map((it, idx) => (
                <div key={idx} onClick={() => setSelIdx(idx)} style={{ padding: "6px 8px", cursor: "pointer", fontFamily: BODY_FONT, fontSize: 13, color: selIdx === idx ? ACCENT : C.body, background: selIdx === idx ? "rgba(251,191,36,0.08)" : "transparent" }}>
                  {ICON[it.name]} {it.label || it.name}
                </div>
              ))}
            </div>

            <div style={panel}>
              <div style={{ fontFamily: HEAD_FONT, fontSize: 11, fontWeight: 700, color: ACCENT, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>{t.props}</div>
              {!sel || selIdx == null ? (
                <div style={{ fontFamily: BODY_FONT, fontSize: 12, color: C.muted, lineHeight: 1.6 }}>{t.noSel}</div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    {(["left", "top", "width", "height"] as const).map((k) => (
                      <div key={k}>
                        <span style={lbl}>{k === "left" ? t.posX : k === "top" ? t.posY : k === "width" ? t.w : t.h}</span>
                        <input type="number" value={Math.round(sel.coordinates[k] ?? 0)} onChange={(e) => patchCoord(selIdx, k, +e.target.value)} style={inp} />
                      </div>
                    ))}
                  </div>
                  {sel.text !== undefined && (
                    <div><span style={lbl}>{t.value}</span><input type="text" value={sel.text} onChange={(e) => patch(selIdx, { text: e.target.value })} style={inp} /></div>
                  )}
                  {sel.textColor !== undefined && sel.itemType !== "rect" && sel.name !== "chatArea" && (
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                      <div><span style={lbl}>{t.textColor}</span><input type="color" value={"#" + sel.textColor} onChange={(e) => patch(selIdx, { textColor: e.target.value.slice(1).toUpperCase() })} style={{ ...inp, height: 32, padding: 2 }} /></div>
                      <div><span style={lbl}>{t.textSize}: {sel.textSize}</span><input type="range" min={20} max={200} value={Number(sel.textSize ?? 100)} onChange={(e) => patch(selIdx, { textSize: +e.target.value })} style={{ width: "100%", accentColor: ACCENT }} /></div>
                    </div>
                  )}
                  {(sel.itemType === "rect" || sel.name === "chatArea") && (
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                      <div><span style={lbl}>{t.textColor}</span><input type="color" value={"#" + (sel.color || "000000")} onChange={(e) => patch(selIdx, { color: e.target.value.slice(1).toUpperCase() })} style={{ ...inp, height: 32, padding: 2 }} /></div>
                      <div><span style={lbl}>{t.opacity}: {sel.opacity}</span><input type="range" min={0} max={100} value={Number(sel.opacity ?? 60)} onChange={(e) => patch(selIdx, { opacity: +e.target.value })} style={{ width: "100%", accentColor: ACCENT }} /></div>
                    </div>
                  )}
                  {sel.colorRanges && sel.colorRanges.length > 0 && (
                    <div>
                      <span style={lbl}>{t.ranges}</span>
                      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                        {sel.colorRanges.map((r, ri) => (
                          <div key={ri} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <input type="color" value={"#" + r.color} onChange={(e) => {
                              const next = sel.colorRanges!.map((x, xi) => xi === ri ? { ...x, color: e.target.value.slice(1).toUpperCase() } : x);
                              patch(selIdx, { colorRanges: next });
                            }} style={{ width: 34, height: 26, padding: 1, background: C.inputBg, border: `1px solid ${C.inputBorder}`, cursor: "pointer" }} />
                            <span style={{ fontFamily: BODY_FONT, fontSize: 11, color: C.muted }}>{r.name}: {r.range[0]}…{r.range[1]}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <button onClick={removeSel} style={{ ...btn("transparent", "#f87171"), borderColor: "#f8717155" }}>{t.remove}</button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div style={{ fontSize: 10, color: C.muted, letterSpacing: 2, marginTop: 32, opacity: 0.6, textAlign: "center", fontFamily: BODY_FONT }}>
          адаптация <a href="https://github.com/namad/visualHUD" target="_blank" rel="noopener noreferrer" style={{ color: "inherit" }}>visualHUD by namad</a> · developed by <a href="https://selzio.com" target="_blank" rel="noopener noreferrer" style={{ color: "inherit", textDecoration: "underline" }}>selzio.com</a>
        </div>
      </div>
    </div>
  );
};

export default HudEditor;
