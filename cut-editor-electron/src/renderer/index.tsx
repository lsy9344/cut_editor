import { createRoot } from 'react-dom/client';
import { App } from './App';
import './styles/index.css';

// Wait for DOM and mount React
const initApp = () => {
  const container = document.getElementById('root');
  if (!container) {
    return;
  }

  const root = createRoot(container);
  root.render(<App />);
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
