import { type FC } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LangProvider } from "./hooks/useLang";
import { TopNav } from "./components/TopNav";
import Championship from "./pages/Championship";
import Verified from "./pages/Verified";
import Trainer from "./pages/Trainer";

const App: FC = () => (
  <LangProvider>
    <BrowserRouter>
      <div style={{ background: "#08080c", color: "#e0e0e0", minHeight: "100vh", fontFamily: "'Orbitron','Courier New',monospace" }}>
        <TopNav />
        <div style={{ paddingTop: 0 }}>
          <Routes>
            <Route path="/" element={<Championship />} />
            <Route path="/verified" element={<Verified />} />
            <Route path="/trainer" element={<Trainer />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  </LangProvider>
);

export default App;
