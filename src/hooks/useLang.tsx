import { createContext, useContext, useState, type FC, type ReactNode } from "react";

export type Lang = "ru" | "en";

interface LangCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
}

const Ctx = createContext<LangCtx>({ lang: "ru", setLang: () => {} });

export const useLang = () => useContext(Ctx);

export const LangProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Lang>("ru");
  return <Ctx.Provider value={{ lang, setLang }}>{children}</Ctx.Provider>;
};
