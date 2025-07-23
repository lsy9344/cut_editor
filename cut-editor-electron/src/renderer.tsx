/**
 * Cut Editor - Renderer process entry point
 * This file initializes the React application in the Electron renderer process.
 */

import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './renderer/App';
import './renderer/styles/global.css';

const container = document.getElementById('root');
if (!container) {
  throw new Error('Root element not found');
}

const root = createRoot(container);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
