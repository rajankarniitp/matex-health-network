
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { initSentry } from './lib/sentry';
import { analytics } from './lib/analytics';
import { setupSecurityHeaders } from './lib/security';
import ErrorBoundary from './components/ErrorBoundary';

// Initialize services safely
try {
  initSentry();
  analytics.init();
  setupSecurityHeaders();
} catch (error) {
  console.warn('Service initialization failed:', error);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
