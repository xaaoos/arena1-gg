import { useState, useEffect } from "react";

export function useCountdown(target: Date | null) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    if (!target) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [target]);
  if (!target) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  const d = Math.max(0, target.getTime() - now);
  return {
    days: Math.floor(d / 864e5),
    hours: Math.floor((d % 864e5) / 36e5),
    minutes: Math.floor((d % 36e5) / 6e4),
    seconds: Math.floor((d % 6e4) / 1e3),
  };
}
