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

// Multiple approaches to ensure global is defined
if (typeof (globalThis as GlobalThisWithGlobal).global === 'undefined') {
  (globalThis as GlobalThisWithGlobal).global = globalThis;
}

// Additional polyfill for window.global
interface WindowWithGlobal {
  global?: typeof globalThis;
}

if (
  typeof window !== 'undefined' &&
  typeof (window as unknown as WindowWithGlobal).global === 'undefined'
) {
  (window as unknown as WindowWithGlobal).global = window;
}

// Fallback polyfill at the very beginning
if (typeof global === 'undefined') {
  (globalThis as GlobalThisWithGlobal).global = globalThis;
}

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>,
);
