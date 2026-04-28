import { createContext, useContext, useState, useEffect, type FC, type ReactNode } from "react";

export type Theme = "dark" | "light";

interface ThemeCtx {
  theme: Theme;
  setTheme: (t: Theme) => void;
  toggle: () => void;
}

const Ctx = createContext<ThemeCtx>({ theme: "dark", setTheme: () => {}, toggle: () => {} });

export const useTheme = () => useContext(Ctx);

export const ThemeProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("arena1-theme") as Theme) ?? "dark";
    }
    return "dark";
  });

  useEffect(() => {
    localStorage.setItem("arena1-theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggle = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  return <Ctx.Provider value={{ theme, setTheme, toggle }}>{children}</Ctx.Provider>;
};
