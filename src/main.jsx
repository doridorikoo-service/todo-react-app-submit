import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import App from './App.jsx';
import './index.css';

function initTheme() {
  try {
    const stored = localStorage.getItem('todo-theme-mode');
    if (!stored) return;

    const parsed = JSON.parse(stored);
    if (parsed?.state?.mode === 'dark') {
      document.documentElement.classList.add('dark');
    }
  } catch {
    // ignore invalid theme storage
  }
}

initTheme();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
