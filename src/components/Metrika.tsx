import { useEffect, useRef, type FC } from "react";
import { useLocation } from "react-router-dom";

// ID счётчика Яндекс.Метрики. 0 — метрика отключена.
const YM_ID = 109816462;

declare global {
  interface Window {
    ym?: (...args: unknown[]) => void;
  }
}

// Подключение Я.Метрики + отслеживание SPA-переходов.
export const Metrika: FC = () => {
  const { pathname } = useLocation();
  const inited = useRef(false);

  useEffect(() => {
    if (!YM_ID || inited.current) return;
    // не запускать при пререндере (headless-браузер) — иначе бот сборки засчитается как визит
    if (navigator.webdriver) return;
    inited.current = true;

    const src = `https://mc.yandex.ru/metrika/tag.js?id=${YM_ID}`;
    (function (m: any, e: Document, t: string, r: string, i: string) {
      m[i] = m[i] || function (...args: unknown[]) { (m[i].a = m[i].a || []).push(args); };
      m[i].l = 1 * (new Date() as any);
      for (let j = 0; j < e.scripts.length; j++) if (e.scripts[j].src === r) return;
      const k = e.createElement(t) as HTMLScriptElement;
      const a = e.getElementsByTagName(t)[0];
      k.async = true;
      k.src = r;
      a.parentNode?.insertBefore(k, a);
    })(window, document, "script", src, "ym");

    window.ym?.(YM_ID, "init", {
      ssr: true,
      webvisor: true,
      clickmap: true,
      ecommerce: "dataLayer",
      accurateTrackBounce: true,
      trackLinks: true,
    });
  }, []);

  // hit на каждую смену маршрута (SPA)
  useEffect(() => {
    if (!YM_ID || !inited.current) return;
    window.ym?.(YM_ID, "hit", window.location.href);
  }, [pathname]);

  return null;
};
