import { type FC } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LangProvider } from "./hooks/useLang";
import { ThemeProvider } from "./hooks/useTheme";
import { TopNav } from "./components/TopNav";
import { C } from "./theme";
import Championship from "./pages/Championship";
import Announce from "./pages/Announce";
import Verified from "./pages/Verified";
import Trainer from "./pages/Trainer";
import EloCup from "./pages/EloCup";
import Divisions from "./pages/Divisions";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";

const App: FC = () => (
  <ThemeProvider>
    <LangProvider>
      <BrowserRouter>
        <div style={{ background: C.bg, color: C.text, minHeight: "100vh", fontFamily: "'Xolonium','Tektur','Courier New',monospace", transition: "background 0.3s, color 0.3s" }}>
          <TopNav />
          <div style={{ paddingTop: 0 }}>
            <Routes>
              <Route path="/" element={<Announce />} />
              <Route path="/championship" element={<Championship />} />
              <Route path="/non-pro-duel-cups" element={<EloCup />} />
              <Route path="/divisions" element={<Divisions />} />
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

export default App;
