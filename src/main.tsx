import './good-internet/migrateStorage.ts';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource-variable/geist';
import '@fontsource-variable/geist-mono';
import './good-internet/tokens.css';
import App from './App.tsx';
import { applyTheme, getTheme } from './good-internet/theme.ts';

// Apply a chosen light or dark mode before the first paint.
applyTheme(getTheme());

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
