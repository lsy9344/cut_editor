import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import { ErrorBoundary } from './components/ErrorBoundary';
import './styles/index.css';

// Global polyfill for Fabric.js compatibility
interface GlobalThisWithGlobal {
  global?: typeof globalThis;
}

if (typeof (globalThis as GlobalThisWithGlobal).global === 'undefined') {
  (globalThis as GlobalThisWithGlobal).global = globalThis;
}

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
);
