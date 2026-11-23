import "@fontsource/cormorant-garamond/latin-700.css";
import "@fontsource/lora/latin-400.css";
import "@fontsource/lora/latin-500.css";
import "@fontsource/pinyon-script/latin-400.css";
import "@fontsource/noto-serif-devanagari/devanagari-600.css";
import "@fontsource/noto-serif-devanagari/devanagari-400.css";
import "@fontsource/tiro-devanagari-sanskrit/devanagari-400.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import { startAdaptiveQualityMonitor } from "./lib/device";
import "./styles/tokens.css";
import "./styles/global.css";
import "./styles/motion.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

startAdaptiveQualityMonitor();
