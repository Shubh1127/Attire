import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";
import { BuyerProvider } from "./Context/BuyerContext.js";
import { ThemeProvider } from "./Context/ThemeContext.jsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Router>
      <ThemeProvider>
        <BuyerProvider>
          <App />
        </BuyerProvider>
      </ThemeProvider>
    </Router>
  </StrictMode>
);