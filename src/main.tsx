
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { initSentry } from './lib/sentry';
import { analytics } from './lib/analytics';
import { setupSecurityHeaders } from './lib/security';
import ErrorBoundary from './components/ErrorBoundary';

// Initialize services
initSentry();
analytics.init();
setupSecurityHeaders();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
