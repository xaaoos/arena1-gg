import { useState, useEffect, useRef, useCallback, useMemo, type FC } from "react";
import { useLang } from "../hooks/useLang";
import { useIsMobile } from "../hooks/useIsMobile";
import { BODY_FONT } from "../components/UI";
import { Seo } from "../components/Seo";
import { C } from "../theme";
import { MAPS, SPAWNS_TXT, type MapData } from "../data/spawns";

const POSSIBLE = "rgba(0, 255, 0, 0.8)";
const REJECTED = "rgba(170, 51, 51, 0.8)";
const ACCENT = "#fbbf24"; // раздел Skill
const HEAD_FONT = "'Xolonium','Tektur',monospace";

// Scale raw map coords into canvas pixel space (matches Memento_Mori's original math).
function scaleSpawns(m: MapData): [number, number, number][] {
  const size = [m.end[0] - m.origin[0], m.end[1] - m.origin[1], m.end[2] - m.origin[2]];
  const sc = [m.vis[0] / size[0], m.vis[1] / size[1], m.vis[2] / size[2]];
  return m.spawns.slice(0, m.count).map((s) => [
    (s[0] - m.origin[0]) * sc[0],
    (s[1] - m.origin[1]) * sc[1],
    (s[2] - m.origin[2]) * sc[2],
  ]);
}

const SpawnView: FC<{ map: MapData }> = ({ map }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [loaded, setLoaded] = useState(false);
  const spawns = useMemo(() => scaleSpawns(map), [map]);
  const [w, h] = map.vis;

  // Load background render for this map.
  useEffect(() => {
    setLoaded(false);
    const img = new Image();
    img.onload = () => { imgRef.current = img; setLoaded(true); };
    img.src = `/spawns/${map.id}.png`;
    return () => { imgRef.current = null; };
  }, [map.id]);

  const draw = useCallback((mx: number | null, my: number | null) => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, w, h);
    ctx.drawImage(img, 0, 0);
    if (mx === null || my === null) return;

    // Distance of each spawn from the pointer (Chebyshev / max-axis, as in the original).
    const dist = spawns.map((s, i) => {
      const dx = Math.abs(mx - s[0]);
      const dy = Math.abs(my - s[1]);
      return { max: Math.max(dx, dy), idx: i };
    });
    const sorted = [...dist].sort((a, b) => (a.max === b.max ? b.idx - a.idx : a.max - b.max));

    // Square "rejection radius" around the pointer = distance of the middle-most spawn.
    const r = sorted[map.middle - 1].max;
    ctx.beginPath();
    ctx.moveTo(mx + r, my + r);
    ctx.lineTo(mx + r, my - r);
    ctx.lineTo(mx - r, my - r);
    ctx.lineTo(mx - r, my + r);
    ctx.lineTo(mx + r, my + r);
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#000";
    ctx.stroke();

    // Farthest (count - middle) spawns are possible (green); the closest `middle` are rejected (red).
    sorted.forEach((d, rank) => {
      const s = spawns[d.idx];
      const radius = 8 + s[2];
      // rank 0 = closest → rejected; ranks >= middle are possible.
      const possible = rank >= map.middle;
      ctx.beginPath();
      ctx.arc(s[0], s[1], radius, 0, 2 * Math.PI, false);
      ctx.fillStyle = possible ? POSSIBLE : REJECTED;
      ctx.fill();
    });

    // Black outlines for every spawn.
    spawns.forEach((s) => {
      ctx.beginPath();
      ctx.arc(s[0], s[1], 8 + s[2], 0, 2 * Math.PI, false);
      ctx.lineWidth = 3;
      ctx.strokeStyle = "#000";
      ctx.stroke();
    });

    // Pointer marker.
    ctx.beginPath();
    ctx.arc(mx, my, 12, 0, 2 * Math.PI, false);
    ctx.fillStyle = "#8ED6FF";
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#000";
    ctx.stroke();
  }, [spawns, w, h, map.middle]);

  // Draw the bare background once the image is ready.
  useEffect(() => { if (loaded) draw(null, null); }, [loaded, draw]);

  const pointerToCanvas = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((clientX - rect.left) / rect.width) * w,
      y: ((clientY - rect.top) / rect.height) * h,
    };
  };

  const onMouse = (e: React.MouseEvent) => {
    const p = pointerToCanvas(e.clientX, e.clientY);
    draw(p.x, p.y);
  };
  const onTouch = (e: React.TouchEvent) => {
    const t = e.touches[0];
    if (!t) return;
    const p = pointerToCanvas(t.clientX, t.clientY);
    draw(p.x, p.y);
  };

  return (
    <canvas
      ref={canvasRef}
      width={w}
      height={h}
      onMouseMove={onMouse}
      onMouseLeave={() => draw(null, null)}
      onTouchStart={onTouch}
      onTouchMove={(e) => { e.preventDefault(); onTouch(e); }}
      style={{
        width: "100%", height: "auto", maxWidth: w, display: "block",
        margin: "0 auto", border: `1px solid ${C.border}`, touchAction: "none",
        background: C.bgCard, cursor: "crosshair",
      }}
    />
  );
};

const Spawns: FC = () => {
  const { lang } = useLang();
  const mob = useIsMobile();
  const t = SPAWNS_TXT[lang];
  const [sel, setSel] = useState(MAPS.find((m) => m.id === "bloodrun") ?? MAPS[0]);

  return (
    <div style={{ minHeight: "calc(100vh - 80px)", padding: mob ? "92px 12px 24px" : "104px 20px 32px", overflowX: "hidden" }}>
      <Seo
        path="/skill/respawns"
        title="Карта спаунов Quake Live"
        description="Интерактивная карта спаунов Quake Live (дуэль): наведи курсор — увидишь возможные точки респауна противника. Рендеры карт by Memento_Mori."
      />
      <div style={{ maxWidth: 1180, width: "100%", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ fontSize: 11, letterSpacing: 6, color: ACCENT, marginBottom: 8, fontWeight: 600 }}>A R E N A  1</div>
          <h1 style={{ fontSize: "clamp(28px,6vw,42px)", fontWeight: 900, color: C.heading, margin: "0 0 8px", letterSpacing: 2, fontFamily: HEAD_FONT }}>{t.title}</h1>
          <div style={{ fontFamily: BODY_FONT, fontSize: 13, color: C.muted, marginBottom: 16 }}>{t.subtitle}</div>
          <p style={{ fontFamily: BODY_FONT, fontSize: 13, lineHeight: 1.7, color: C.body, maxWidth: 620, margin: "0 auto" }}>{t.intro}</p>
        </div>

        {/* Map selector */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4, justifyContent: "center", marginBottom: 20 }}>
          {MAPS.map((m) => {
            const active = m.id === sel.id;
            return (
              <button key={m.id} onClick={() => setSel(m)} style={{
                padding: mob ? "8px 10px" : "9px 14px",
                background: active ? "rgba(251,191,36,0.1)" : C.bgCard,
                border: "none", borderBottom: active ? `2px solid ${ACCENT}` : `2px solid ${C.border}`,
                color: active ? ACCENT : C.muted, cursor: "pointer",
                fontSize: mob ? 10 : 11, fontWeight: 700, letterSpacing: 1,
                textTransform: "uppercase", fontFamily: HEAD_FONT,
              }}>{m.name}</button>
            );
          })}
        </div>

        {/* Legend + hint */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 20, justifyContent: "center", alignItems: "center", marginBottom: 16, fontFamily: BODY_FONT, fontSize: 12, color: C.secondary }}>
          <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ width: 14, height: 14, borderRadius: "50%", background: "rgb(0,200,0)", border: "1px solid #000" }} /> {t.legendPossible}
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ width: 14, height: 14, borderRadius: "50%", background: "rgb(170,51,51)", border: "1px solid #000" }} /> {t.legendRejected}
          </span>
          <span style={{ color: C.muted }}>{mob ? t.hintMobile : t.hintDesktop}</span>
        </div>

        <SpawnView map={sel} />

        {/* Credit */}
        <div style={{ marginTop: 28, padding: "20px 24px", background: C.bgCard, border: `1px solid ${C.border}`, maxWidth: 620, marginLeft: "auto", marginRight: "auto" }}>
          <div style={{ fontSize: 10, letterSpacing: 3, color: ACCENT, marginBottom: 8, fontWeight: 600, textTransform: "uppercase" }}>{t.creditTitle}</div>
          <div style={{ fontFamily: BODY_FONT, fontSize: 12, lineHeight: 1.6, color: C.secondary }}>{t.creditBody}</div>
          <a href="https://www.esreality.com/?a=post&id=2219012" target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", marginTop: 10, fontFamily: BODY_FONT, fontSize: 12, color: ACCENT, textDecoration: "underline" }}>{t.creditLink} →</a>
        </div>

        <div style={{ fontSize: 10, color: C.muted, letterSpacing: 2, marginTop: 32, opacity: 0.5, textAlign: "center" }}>
          developed by <a href="https://selzio.com" target="_blank" rel="noopener noreferrer" style={{ color: "inherit", textDecoration: "underline" }}>selzio.com</a>
        </div>
      </div>
    </div>
  );
};

export default Spawns;
