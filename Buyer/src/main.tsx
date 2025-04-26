import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { BuyerProvider } from './Context/BuyerContext.jsx';
import { ThemeProvider } from './Context/ThemeContext.jsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <BuyerProvider>
        <App />
      </BuyerProvider>
    </ThemeProvider>
  </StrictMode>
);