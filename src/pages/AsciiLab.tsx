import { useEffect, useRef, useState, type FC } from "react";
import { useIsMobile } from "../hooks/useIsMobile";
import { Seo } from "../components/Seo";
import { BODY_FONT } from "../components/UI";
import { C } from "../theme";

const ACS = C.accent;

// наборы символов от тёмного к светлому
const RAMPS: Record<string, string> = {
  classic: " .:-=+*#%@",
  blocks: " ░▒▓█",
  dense: " .'`^\",:;Il!i><~+_-?][}{1)(|/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@",
};

type Mode = "plasma" | "video" | "image";

const AsciiLab: FC = () => {
  const mob = useIsMobile();
  const preRef = useRef<HTMLPreElement>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [cols, setCols] = useState(mob ? 70 : 120);
  const [rampKey, setRampKey] = useState<keyof typeof RAMPS>("classic");
  const [invert, setInvert] = useState(false);
  const [mode, setMode] = useState<Mode>("plasma");
  const [playing, setPlaying] = useState(false);
  const [cur, setCur] = useState(0);
  const [dur, setDur] = useState(0);

  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

  // актуальные значения для rAF без пересоздания цикла
  const cfg = useRef({ cols, rampKey, invert, mode });
  cfg.current = { cols, rampKey, invert, mode };

  useEffect(() => {
    if (!canvasRef.current) canvasRef.current = document.createElement("canvas");
    const ctx = canvasRef.current.getContext("2d", { willReadFrequently: true })!;
    let raf = 0;
    let t = 0;
    let last = 0;

    const render = (ts: number) => {
      raf = requestAnimationFrame(render);
      if (ts - last < 1000 / 24) return; // ~24 fps
      last = ts;
      t += 0.06;

      const { cols, rampKey, invert, mode } = cfg.current;
      const chars = RAMPS[rampKey];
      const src = mode === "video" ? videoRef.current : mode === "image" ? imgRef.current : null;

      let w = cols;
      let rows: number;
      let lum: (i: number) => number;

      if (src) {
        const sw = (src as HTMLVideoElement).videoWidth || (src as HTMLImageElement).naturalWidth || 16;
        const sh = (src as HTMLVideoElement).videoHeight || (src as HTMLImageElement).naturalHeight || 9;
        rows = Math.max(1, Math.round((cols * sh) / sw * 0.5));
        const cv = canvasRef.current!;
        cv.width = w; cv.height = rows;
        try { ctx.drawImage(src as CanvasImageSource, 0, 0, w, rows); } catch { return; }
        const data = ctx.getImageData(0, 0, w, rows).data;
        lum = (i) => 0.299 * data[i * 4] + 0.587 * data[i * 4 + 1] + 0.114 * data[i * 4 + 2];
      } else {
        // живая плазма — без внешнего источника
        rows = Math.round(cols * 0.5);
        lum = (i) => {
          const x = i % w, y = (i / w) | 0;
          const v =
            Math.sin(x * 0.18 + t) +
            Math.sin(y * 0.22 - t) +
            Math.sin((x + y) * 0.12 + t * 1.3) +
            Math.sin(Math.hypot(x - w / 2, y - rows / 2) * 0.22 - t * 1.6);
          return ((v + 4) / 8) * 255;
        };
      }

      let out = "";
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < w; x++) {
          let b = lum(y * w + x) / 255;
          if (invert) b = 1 - b;
          out += chars[Math.min(chars.length - 1, Math.max(0, Math.floor(b * (chars.length - 1))))];
        }
        out += "\n";
      }
      if (preRef.current) preRef.current.textContent = out;
    };
    raf = requestAnimationFrame(render);
    return () => cancelAnimationFrame(raf);
  }, []);

  // навешиваем слушатели на video для перемотки/времени
  const attachVideo = (v: HTMLVideoElement) => {
    v.muted = true; v.playsInline = true; v.loop = false;
    v.onloadedmetadata = () => setDur(v.duration || 0);
    v.ontimeupdate = () => setCur(v.currentTime);
    v.onplay = () => setPlaying(true);
    v.onpause = () => setPlaying(false);
    videoRef.current = v;
    v.play().catch(() => {});
    setMode("video");
  };

  // демо-клип (лежит в public, same-origin — canvas не «пачкается»)
  const loadDemo = () => {
    const v = document.createElement("video");
    v.src = "/ascii-demo.mp4";
    attachVideo(v);
  };

  // при входе сразу показываем демо-клип
  useEffect(() => { loadDemo(); }, []);

  const onFile = (file: File) => {
    const url = URL.createObjectURL(file);
    if (file.type.startsWith("video")) {
      const v = document.createElement("video");
      v.src = url;
      attachVideo(v);
    } else if (file.type.startsWith("image")) {
      const im = new Image();
      im.src = url;
      imgRef.current = im;
      setMode("image");
    }
  };

  const playPause = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) v.play().catch(() => {}); else v.pause();
  };
  const seek = (val: number) => {
    const v = videoRef.current;
    if (v) { v.currentTime = val; setCur(val); }
  };

  const btn = (active: boolean): React.CSSProperties => ({
    background: active ? ACS : C.inputBg,
    color: active ? C.accentContrast : C.muted,
    border: `1px solid ${active ? ACS : C.border}`,
    fontFamily: "'Xolonium','Tektur',monospace",
    fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase",
    padding: "7px 12px", cursor: "pointer",
  });

  return (
    <div style={{ minHeight: "100vh", padding: mob ? "80px 12px 60px" : "100px 20px 80px" }}>
      <Seo path="/ascii" title="ASCII Lab" description="Эксперимент: видео и изображения в ASCII." noindex />

      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <div style={{ fontSize: mob ? 10 : 12, letterSpacing: 4, color: ACS, fontWeight: 700, textTransform: "uppercase", textAlign: "center" }}>ARENA 1 · ASCII LAB</div>

        {/* холст ASCII */}
        <div style={{ marginTop: 20, border: `1px solid ${C.accentBorder}`, background: "#000", overflow: "hidden", display: "flex", justifyContent: "center" }}>
          <pre
            ref={preRef}
            style={{
              margin: 0, padding: mob ? 8 : 14,
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: mob ? 5 : 7, lineHeight: 1,
              color: ACS, whiteSpace: "pre", letterSpacing: 0,
              userSelect: "none",
            }}
          />
        </div>

        {/* перемотка видео — выбрать отрезок */}
        {mode === "video" && dur > 0 && (
          <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button style={btn(false)} onClick={playPause}>{playing ? "❚❚ Пауза" : "▶ Играть"}</button>
            <input type="range" min={0} max={dur} step={0.05} value={cur} onChange={(e) => seek(+e.target.value)} style={{ accentColor: ACS, width: mob ? 200 : 420 }} />
            <span style={{ fontFamily: BODY_FONT, fontSize: 12, color: C.muted, fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>{fmt(cur)} / {fmt(dur)}</span>
          </div>
        )}

        {/* контролы */}
        <div style={{ marginTop: 18, display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center", justifyContent: "center" }}>
          <button style={btn(mode === "video")} onClick={loadDemo}>Quake-клип</button>
          <button style={btn(mode === "plasma")} onClick={() => setMode("plasma")}>Плазма</button>

          <label style={{ ...btn(mode === "image"), display: "inline-block" }}>
            Загрузить видео / картинку
            <input type="file" accept="video/*,image/*" style={{ display: "none" }} onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])} />
          </label>

          {(Object.keys(RAMPS) as (keyof typeof RAMPS)[]).map((k) => (
            <button key={k} style={btn(rampKey === k)} onClick={() => setRampKey(k)}>{k}</button>
          ))}

          <button style={btn(invert)} onClick={() => setInvert((v) => !v)}>Инверсия</button>

          <label style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: BODY_FONT, fontSize: 11, color: C.muted }}>
            Плотность {cols}
            <input type="range" min={40} max={mob ? 110 : 200} value={cols} onChange={(e) => setCols(+e.target.value)} style={{ accentColor: ACS }} />
          </label>
        </div>

        <div style={{ marginTop: 14, textAlign: "center", fontFamily: BODY_FONT, fontSize: 11, color: C.muted, lineHeight: 1.6 }}>
          Закинь короткий клип (mp4/gif) или картинку — всё считается прямо в браузере, ничего не загружается на сервер.
        </div>
      </div>
    </div>
  );
};

export default AsciiLab;
