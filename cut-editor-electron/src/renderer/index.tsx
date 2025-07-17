import React from 'react';
import { createRoot } from 'react-dom/client';

// Simple React test component
const TestApp: React.FC = () => {
  const [count, setCount] = React.useState(0);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', textAlign: 'center' }}>
      <h1 style={{ color: '#2563eb' }}>🎉 React is Working!</h1>
      <p>Cut Editor renderer with React is functioning correctly.</p>
      
      <div style={{ margin: '20px 0' }}>
        <button 
          onClick={() => setCount(count + 1)}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Clicked {count} times
        </button>
      </div>
      
      <div style={{ background: '#f0f9ff', padding: '15px', borderRadius: '8px' }}>
        <strong>Status:</strong>
        <ul style={{ textAlign: 'left', margin: '10px 0' }}>
          <li>✅ React mounting</li>
          <li>✅ State management</li>
          <li>✅ Event handling</li>
          <li>✅ Component rendering</li>
        </ul>
      </div>
    </div>
  );
};

// Wait for DOM and mount React
const initApp = () => {
  const container = document.getElementById('root');
  if (!container) {
    console.error('❌ Root element not found');
    return;
  }
  
  console.log('🚀 Mounting React app...');
  const root = createRoot(container);
  root.render(<TestApp />);
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
