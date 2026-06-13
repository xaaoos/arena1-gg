import { useEffect, useRef, type FC } from "react";

const RAMPS: Record<string, string> = {
  classic: " .:-=+*#%@",
  blocks: " ░▒▓█",
};

interface Props {
  src: string;
  cols?: number;
  contrast?: number;
  floor?: number;
  ramp?: keyof typeof RAMPS;
  color?: string;
  maxWidth?: number;
  loop?: boolean;
  onEnded?: () => void;
}

// ASCII-плеер видео для прода: рисует кадры символами в <pre>.
// Считает только когда виден на экране и вкладка активна.
export const AsciiVideo: FC<Props> = ({
  src, cols = 200, contrast = 1.1, floor = 0, ramp = "classic", color = "#4ade80", maxWidth = 620,
  loop = true, onEnded,
}) => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const preRef = useRef<HTMLPreElement>(null);
  const endedRef = useRef(onEnded);
  endedRef.current = onEnded;

  useEffect(() => {
    const wrap = wrapRef.current!;
    const video = document.createElement("video");
    video.src = src; video.muted = true; video.loop = loop; video.playsInline = true;
    video.preload = "auto";
    video.onended = () => endedRef.current?.();

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
    const chars = RAMPS[ramp];
    const lastIdx = chars.length - 1;

    let raf = 0;
    let last = 0;
    let visible = false;
    let active = true;

    const tick = (ts: number) => {
      raf = requestAnimationFrame(tick);
      if (!visible || document.hidden || video.readyState < 2) return;
      if (ts - last < 1000 / 20) return; // ~20 fps
      last = ts;

      const sw = video.videoWidth || 4, sh = video.videoHeight || 3;
      const rows = Math.max(1, Math.round((cols * sh) / sw * 0.5));
      canvas.width = cols; canvas.height = rows;
      try { ctx.drawImage(video, 0, 0, cols, rows); } catch { return; }
      const data = ctx.getImageData(0, 0, cols, rows).data;

      // подгоняем размер шрифта под ширину контейнера (моно ≈ 0.6em на символ)
      const fs = Math.max(3, (Math.min(wrap.clientWidth, maxWidth) / cols) / 0.6);
      if (preRef.current && Math.abs(parseFloat(preRef.current.style.fontSize || "0") - fs) > 0.3) {
        preRef.current.style.fontSize = `${fs}px`;
      }

      let out = "";
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const i = (y * cols + x) * 4;
          let b = (0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]) / 255;
          b = (b - 0.5) * contrast + 0.5;
          if (b < floor) b = 0;
          b = b < 0 ? 0 : b > 1 ? 1 : b;
          out += chars[Math.floor(b * lastIdx)];
        }
        out += "\n";
      }
      if (preRef.current) preRef.current.textContent = out;
    };

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && active) video.play().catch(() => {}); else video.pause();
    }, { threshold: 0.05 });
    io.observe(wrap);

    const onVis = () => {
      active = !document.hidden;
      if (visible && active) video.play().catch(() => {}); else video.pause();
    };
    document.addEventListener("visibilitychange", onVis);

    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      video.pause(); video.removeAttribute("src"); video.load();
    };
  }, [src, cols, contrast, floor, ramp, maxWidth, loop]);

  return (
    <div ref={wrapRef} style={{ width: "100%", maxWidth, margin: "0 auto", background: "#000", overflow: "hidden", lineHeight: 0 }}>
      <pre
        ref={preRef}
        aria-hidden
        style={{
          margin: 0, fontFamily: "'JetBrains Mono', monospace",
          lineHeight: 1, color, whiteSpace: "pre", letterSpacing: 0, userSelect: "none",
        }}
      />
    </div>
  );
};
