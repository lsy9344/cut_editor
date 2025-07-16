import ReactDOM from 'react-dom/client';
import { App } from './App';
import { ErrorBoundary } from './components/ErrorBoundary';
import './styles/index.css';
import { loadFonts, preloadFonts } from './utils/fontManager';

// Preload fonts for performance
preloadFonts();

// Load fonts asynchronously
// eslint-disable-next-line no-console
loadFonts().catch(console.error);

// Global polyfill for Fabric.js compatibility
interface GlobalThisWithGlobal {
  global?: typeof globalThis;
}

if (typeof (globalThis as GlobalThisWithGlobal).global === 'undefined') {
  (globalThis as GlobalThisWithGlobal).global = globalThis;
}

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>,
);
