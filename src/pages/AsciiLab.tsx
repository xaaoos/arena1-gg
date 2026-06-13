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
  const [edge, setEdge] = useState(false);   // режим контуров
  const [contrast, setContrast] = useState(1.4);
  const [floor, setFloor] = useState(0);     // порог чёрного: ниже — пустота
  const [colorOnly, setColorOnly] = useState(false); // оставить только цветное (убрать серый фон)
  const [satThr, setSatThr] = useState(0.25);
  const [clip, setClip] = useState("/ascii-demo.mp4"); // активный клип-пресет

  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

  // актуальные значения для rAF без пересоздания цикла
  const cfg = useRef({ cols, rampKey, invert, mode, edge, contrast, floor, colorOnly, satThr });
  cfg.current = { cols, rampKey, invert, mode, edge, contrast, floor, colorOnly, satThr };

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

      const { cols, rampKey, invert, mode, edge, contrast, floor, colorOnly, satThr } = cfg.current;
      const chars = RAMPS[rampKey];
      const src = mode === "video" ? videoRef.current : mode === "image" ? imgRef.current : null;

      const w = cols;
      let rows: number;
      // собираем буфер яркостей 0..1
      let buf: Float32Array;
      let sat: Float32Array | null = null; // насыщенность (для маски «только цвет»)

      if (src) {
        const sw = (src as HTMLVideoElement).videoWidth || (src as HTMLImageElement).naturalWidth || 16;
        const sh = (src as HTMLVideoElement).videoHeight || (src as HTMLImageElement).naturalHeight || 9;
        rows = Math.max(1, Math.round((cols * sh) / sw * 0.5));
        const cv = canvasRef.current!;
        cv.width = w; cv.height = rows;
        try { ctx.drawImage(src as CanvasImageSource, 0, 0, w, rows); } catch { return; }
        const data = ctx.getImageData(0, 0, w, rows).data;
        buf = new Float32Array(w * rows);
        sat = new Float32Array(w * rows);
        for (let i = 0; i < w * rows; i++) {
          const r = data[i * 4], g = data[i * 4 + 1], b = data[i * 4 + 2];
          buf[i] = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
          const mx = Math.max(r, g, b), mn = Math.min(r, g, b);
          sat[i] = mx ? (mx - mn) / mx : 0;
        }
      } else {
        rows = Math.round(cols * 0.5);
        buf = new Float32Array(w * rows);
        for (let i = 0; i < w * rows; i++) {
          const x = i % w, y = (i / w) | 0;
          const v =
            Math.sin(x * 0.18 + t) + Math.sin(y * 0.22 - t) +
            Math.sin((x + y) * 0.12 + t * 1.3) +
            Math.sin(Math.hypot(x - w / 2, y - rows / 2) * 0.22 - t * 1.6);
          buf[i] = (v + 4) / 8;
        }
      }

      // контраст + порог чёрного + маска «только цвет» (серый фон → пустота)
      for (let i = 0; i < buf.length; i++) {
        if (colorOnly && sat && sat[i] < satThr) { buf[i] = 0; continue; }
        let b = (buf[i] - 0.5) * contrast + 0.5;
        if (b < floor) b = 0;
        buf[i] = b < 0 ? 0 : b > 1 ? 1 : b;
      }

      const lastIdx = chars.length - 1;
      let out = "";
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < w; x++) {
          const i = y * w + x;
          let val: number;
          if (edge) {
            // Sobel: магнитуда градиента — рисуем кромки объектов
            const xl = x > 0 ? i - 1 : i, xr = x < w - 1 ? i + 1 : i;
            const yt = y > 0 ? i - w : i, yb = y < rows - 1 ? i + w : i;
            const gx = buf[xr] - buf[xl];
            const gy = buf[yb] - buf[yt];
            val = Math.min(1, Math.hypot(gx, gy) * 2.2);
          } else {
            val = invert ? 1 - buf[i] : buf[i];
          }
          out += chars[Math.min(lastIdx, Math.max(0, Math.floor(val * lastIdx)))];
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

  // клип-пресет (лежит в public, same-origin — canvas не «пачкается»)
  const loadClip = (src: string) => {
    const v = document.createElement("video");
    v.src = src;
    attachVideo(v);
    setClip(src);
  };

  // при входе сразу показываем первый клип
  useEffect(() => { loadClip("/ascii-demo.mp4"); }, []);

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
          <button style={btn(mode === "video" && clip === "/ascii-demo.mp4")} onClick={() => loadClip("/ascii-demo.mp4")}>Клип 1</button>
          <button style={btn(mode === "video" && clip === "/ascii-demo2.mp4")} onClick={() => loadClip("/ascii-demo2.mp4")}>Клип 2</button>
          <button style={btn(mode === "plasma")} onClick={() => setMode("plasma")}>Плазма</button>

          <label style={{ ...btn(mode === "image"), display: "inline-block" }}>
            Загрузить видео / картинку
            <input type="file" accept="video/*,image/*" style={{ display: "none" }} onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])} />
          </label>

          {(Object.keys(RAMPS) as (keyof typeof RAMPS)[]).map((k) => (
            <button key={k} style={btn(rampKey === k)} onClick={() => setRampKey(k)}>{k}</button>
          ))}

          <button style={btn(edge)} onClick={() => setEdge((v) => !v)}>Контуры</button>
          <button style={btn(colorOnly)} onClick={() => setColorOnly((v) => !v)}>Только цвет</button>
          <button style={btn(invert)} onClick={() => setInvert((v) => !v)}>Инверсия</button>
        </div>

        {/* ползунки отделения объектов от фона */}
        <div style={{ marginTop: 12, display: "flex", flexWrap: "wrap", gap: mob ? 12 : 24, alignItems: "center", justifyContent: "center", fontFamily: BODY_FONT, fontSize: 11, color: C.muted }}>
          <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
            Плотность {cols}
            <input type="range" min={40} max={mob ? 110 : 200} value={cols} onChange={(e) => setCols(+e.target.value)} style={{ accentColor: ACS }} />
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
            Контраст {contrast.toFixed(1)}
            <input type="range" min={0.5} max={3} step={0.1} value={contrast} onChange={(e) => setContrast(+e.target.value)} style={{ accentColor: ACS }} />
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
            Порог чёрного {floor.toFixed(2)}
            <input type="range" min={0} max={0.7} step={0.02} value={floor} onChange={(e) => setFloor(+e.target.value)} style={{ accentColor: ACS }} />
          </label>
          {colorOnly && (
            <label style={{ display: "flex", alignItems: "center", gap: 8, color: ACS }}>
              Насыщенность {satThr.toFixed(2)}
              <input type="range" min={0.05} max={0.6} step={0.01} value={satThr} onChange={(e) => setSatThr(+e.target.value)} style={{ accentColor: ACS }} />
            </label>
          )}
        </div>

        <div style={{ marginTop: 14, textAlign: "center", fontFamily: BODY_FONT, fontSize: 11, color: C.muted, lineHeight: 1.6 }}>
          Закинь короткий клип (mp4/gif) или картинку — всё считается прямо в браузере, ничего не загружается на сервер.
        </div>
      </div>
    </div>
  );
};

export default AsciiLab;
