# Electron White Screen Issue - Complete Solution Guide

## Problem Description

**Issue**: Electron application launches but displays only a white screen or shows "Loading..." text without rendering React components.

**Symptoms**:
- Application window opens successfully
- HTML template loads (showing "Loading..." text)
- JavaScript bundle appears to load but React components don't render
- DevTools console may show no obvious errors
- Development server compiles successfully

## Root Cause Analysis

The white screen issue in Electron React applications typically stems from **multiple layered problems**:

### 1. Development Server Loading Issues
**Problem**: Electron tries to load `http://localhost:3000` but encounters:
- Port conflicts or server not ready
- MIME type issues causing download dialogs
- Network connectivity problems between Electron and webpack dev server

### 2. JavaScript Execution Context Problems
**Problem**: Even when files load, JavaScript may not execute properly due to:
- Content Security Policy (CSP) restrictions
- Missing or incorrect DOM ready state handling
- Module loading failures

### 3. React Mounting Failures
**Problem**: React components fail to mount due to:
- Missing `DOMContentLoaded` event handling
- Incorrect root element selection
- Component lifecycle errors

## Complete Solution

### Step 1: Fix Development Server Loading

**Issue**: Download dialog appears instead of app loading.

**Solution**: Modify main process to use local files in development mode:

```typescript
// src/main/index.ts
// Load the renderer
if (this.isDevelopment) {
  // Use local file instead of dev server to avoid download dialog
  void this.mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
  this.mainWindow.webContents.openDevTools();
} else {
  void this.mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
}
```

### Step 2: Configure Permissive CSP

**Issue**: Content Security Policy blocks JavaScript execution.

**Solution**: Set permissive CSP in both HTML and main process:

```html
<!-- src/renderer/index.html -->
<meta http-equiv="Content-Security-Policy" content="default-src 'self' 'unsafe-inline' 'unsafe-eval' data: blob:; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; connect-src 'self' http://localhost:3000 ws://localhost:3000;">
```

```typescript
// src/main/index.ts
this.mainWindow.webContents.session.webRequest.onHeadersReceived((_, callback) => {
  callback({
    responseHeaders: {
      'Content-Security-Policy': [
        "default-src 'self' 'unsafe-inline' 'unsafe-eval' data: blob: http://localhost:3000 ws://localhost:3000;" +
          "script-src 'self' 'unsafe-inline' 'unsafe-eval' http://localhost:3000;" +
          "style-src 'self' 'unsafe-inline' http://localhost:3000;" +
          "connect-src 'self' http://localhost:3000 ws://localhost:3000;",
      ],
    },
  });
});
```

### Step 3: Implement Robust DOM Ready Handling

**Issue**: React tries to mount before DOM is ready.

**Solution**: Use proper DOM ready state checking:

```typescript
// src/renderer/index.tsx
const initApp = () => {
  const container = document.getElementById('root');
  if (!container) {
    console.error('❌ Root element not found');
    return;
  }
  
  console.log('🚀 Mounting React app...');
  const root = createRoot(container);
  root.render(<App />);
};

// Handle both loading states
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
```

### Step 4: Create Minimal React Test Component

**Issue**: Complex components may fail silently.

**Solution**: Start with minimal React component to verify mounting:

```typescript
import React from 'react';
import { createRoot } from 'react-dom/client';

const TestApp: React.FC = () => {
  const [count, setCount] = React.useState(0);

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>✅ React is Working!</h1>
      <button onClick={() => setCount(count + 1)}>
        Clicked {count} times
      </button>
    </div>
  );
};
```

### Step 5: Configure TypeScript for Optional electronAPI

**Issue**: TypeScript errors prevent compilation.

**Solution**: Make electronAPI optional in preload types:

```typescript
// src/preload/index.ts
declare global {
  interface Window {
    electronAPI?: typeof electronAPI; // Make optional
  }
}
```

## Development Workflow

### 1. Build Process
```bash
npm run build:main
npm run build:preload  
npm run build:renderer
```

### 2. Development Mode
```bash
npm run dev
```

### 3. Production Test
```bash
NODE_ENV=production npx electron .
```

## Debugging Steps

### 1. Verify File Structure
```bash
ls -la src/renderer/
# Should show: index.tsx, index.html, App.tsx
```

### 2. Check Webpack Compilation
```bash
npm run build:renderer
# Should complete without errors
```

### 3. Test JavaScript Execution
Add console.log statements to verify execution:
```typescript
console.log('🚀 Script loaded');
console.log('📄 DOM ready');
console.log('✅ React mounting');
```

### 4. Inspect Network Tab
In DevTools, check if all resources load successfully:
- index.html ✅
- index.js ✅
- No 404 errors ✅

## Prevention Best Practices

### 1. Always Use DOM Ready Checks
Never assume DOM is ready when script executes.

### 2. Start with Minimal Components
Build complexity gradually from working minimal components.

### 3. Handle Both Development and Production
Ensure consistent behavior across environments.

### 4. Use Error Boundaries
Wrap React components in ErrorBoundary for better error handling.

### 5. Implement Proper TypeScript Types
Make optional APIs optional to prevent compilation errors.

## Success Indicators

✅ **Electron window opens without white screen**
✅ **React components render correctly**
✅ **Interactive elements work (buttons, state updates)**
✅ **Console shows successful mounting logs**
✅ **No critical errors in DevTools**

## Common Pitfalls to Avoid

❌ **Don't assume dev server is always available**
❌ **Don't skip DOM ready state checks**
❌ **Don't use overly restrictive CSP in development**
❌ **Don't start with complex components when debugging**
❌ **Don't ignore TypeScript compilation errors**

This solution addresses the fundamental architectural gaps that cause white screen issues in Electron React applications and provides a systematic approach to resolution.