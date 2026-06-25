import { type FC } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LangProvider } from "./hooks/useLang";
import { ThemeProvider } from "./hooks/useTheme";
import { TopNav } from "./components/TopNav";
import { Metrika } from "./components/Metrika";
import { C } from "./theme";
import Championship from "./pages/Championship";
import Announce from "./pages/Announce";
import Verified from "./pages/Verified";
import Trainer from "./pages/Trainer";
import Spawns from "./pages/Spawns";
import HudEditor from "./pages/HudEditor";
import EloCup from "./pages/EloCup";
import Divisions from "./pages/Divisions";
import Join from "./pages/Join";
import Player from "./pages/Player";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import AsciiLab from "./pages/AsciiLab";

const App: FC = () => {
  return (
  <ThemeProvider>
    <LangProvider>
      <BrowserRouter>
        <Metrika />
        {/* фон не задаём — клетка-грид живёт на body */}
        <div style={{ color: C.text, minHeight: "100vh", fontFamily: "'Xolonium','Tektur','Courier New',monospace", transition: "color 0.3s" }}>
          <TopNav />
          <div style={{ paddingTop: 0 }}>
            <Routes>
              <Route path="/" element={<Announce />} />
              <Route path="/championship" element={<Championship />} />
              <Route path="/non-pro-duel-cups" element={<EloCup />} />
              <Route path="/divisions" element={<Divisions />} />
              <Route path="/join" element={<Join />} />
              <Route path="/player/:nick" element={<Player />} />
              <Route path="/verified" element={<Verified />} />
              <Route path="/skill/trainer" element={<Trainer />} />
              <Route path="/skill/respawns" element={<Spawns />} />
              {/* скрытая тестовая страница (WIP), не в навигации/пререндере */}
              <Route path="/skill/hud" element={<HudEditor />} />
              {/* старые URL → новые (редирект для SEO/закладок) */}
              <Route path="/trainer" element={<Navigate to="/skill/trainer" replace />} />
              <Route path="/spawns" element={<Navigate to="/skill/respawns" replace />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/ascii" element={<AsciiLab />} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </LangProvider>
  </ThemeProvider>
  );
};

export default App;
