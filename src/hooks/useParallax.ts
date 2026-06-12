import { useEffect, useRef } from "react";

const reducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Параллакс фоновой клетки: грид на body движется медленнее контента.
// background-attachment: fixed не используем — сломан на iOS Safari.
export function useGridParallax(factor = 0.5) {
  useEffect(() => {
    if (reducedMotion()) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = window.scrollY * factor;
        document.body.style.backgroundPositionY = `${y}px, ${y}px`;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
      document.body.style.backgroundPositionY = "";
    };
  }, [factor]);
}

// Параллакс элемента: transform напрямую через ref, без ре-рендеров
export function useParallax<T extends HTMLElement>(factor = 0.25) {
  const ref = useRef<T | null>(null);
  useEffect(() => {
    if (reducedMotion()) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        if (ref.current) ref.current.style.transform = `translateY(${window.scrollY * factor}px)`;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
      if (ref.current) ref.current.style.transform = "";
    };
  }, [factor]);
  return ref;
}
