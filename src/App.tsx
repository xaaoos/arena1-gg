import { type FC } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LangProvider } from "./hooks/useLang";
import { ThemeProvider } from "./hooks/useTheme";
import { TopNav } from "./components/TopNav";
import { useGridParallax } from "./hooks/useParallax";
import { C } from "./theme";
import Championship from "./pages/Championship";
import Announce from "./pages/Announce";
import Verified from "./pages/Verified";
import Trainer from "./pages/Trainer";
import EloCup from "./pages/EloCup";
import Divisions from "./pages/Divisions";
import Player from "./pages/Player";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";

const App: FC = () => {
  // фоновая клетка скроллится медленнее контента
  useGridParallax(0.5);
  return (
  <ThemeProvider>
    <LangProvider>
      <BrowserRouter>
        {/* фон не задаём — клетка-грид живёт на body */}
        <div style={{ color: C.text, minHeight: "100vh", fontFamily: "'Xolonium','Tektur','Courier New',monospace", transition: "color 0.3s" }}>
          <TopNav />
          <div style={{ paddingTop: 0 }}>
            <Routes>
              <Route path="/" element={<Announce />} />
              <Route path="/championship" element={<Championship />} />
              <Route path="/non-pro-duel-cups" element={<EloCup />} />
              <Route path="/divisions" element={<Divisions />} />
              <Route path="/player/:nick" element={<Player />} />
              <Route path="/verified" element={<Verified />} />
              <Route path="/trainer" element={<Trainer />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </LangProvider>
  </ThemeProvider>
  );
};

export default App;
