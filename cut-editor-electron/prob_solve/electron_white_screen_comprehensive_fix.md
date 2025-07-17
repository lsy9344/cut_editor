# Electron White Screen Issue - Comprehensive Solution Guide
## 🚨 Issue Overview
**Symptoms**: After launching the Electron app, only a white screen is displayed, and the Cut Editor UI is not visible.
**Root Cause**: Inconsistent file loading methods between development and production modes, and API communication errors.
**Resolution Date**: 2025-07-17
**Applicable Version**: Cut Editor Electron v1.0.0
---
## 🔍 Root Cause Analysis
### 1. **Main Cause: Development Mode File Loading Method Error**
**Issue**:
- In development mode, the webpack dev server (`http://localhost:3000`) should be used, but the built files are being loaded directly
- This prevents dynamic module loading and HMR (Hot Module Replacement) from working
**Code Evidence**:
```typescript
// Incorrect implementation (BEFORE)
const rendererIndexPath = path.join(__dirname, ‘../renderer/index.html’);
void this.mainWindow.loadFile(rendererIndexPath); // Always loads the file
// Correct implementation (AFTER)
if (this.isDevelopment) {
void this.mainWindow.loadURL(‘http://localhost:3000’); // Development server
} else {
const rendererIndexPath = path.join(__dirname, ‘../renderer/index.html’);
void this.mainWindow.loadFile(rendererIndexPath); // Production file
}
```
### 2. **Secondary cause: API method mismatch**
**Issue**:
- Renderer process: `window.electronAPI?.openFiles()` (plural)
- Preload script: `openFile()` (singular)
- Result: Browser default behavior executed due to `undefined` return
**Solution**:
```typescript
// Renderer process modification
const fileData = await window.electronAPI.openFile(); // Unify to singular
```
### 3. **Additional cause: CSP (Content Security Policy) conflict**
**Issue**:
- Duplicate CSP header settings in the main process and webpack development server
- Resource loading failure due to the conflict
**Solution**:
- Remove CSP headers from webpack settings
- Manage CSP centrally in the main process
---
## 🛠️ Step-by-step solution
### **Step 1: Separate development and production modes**
**File**: `src/main/index.ts`
```typescript
private createMainWindow(): void {
this.mainWindow = new BrowserWindow({
width: 1200,
height: 800,
webPreferences: {
preload: path.join(__dirname, ‘../preload/index.js’),
contextIsolation: true,
nodeIntegration: false,
webSecurity: !this.isDevelopment,
},
});
// Development mode CSP settings
this.mainWindow.webContents.session.webRequest.onHeadersReceived((_, callback) => {
callback({
responseHeaders: {
‘Content-Security-Policy’: [
"default-src ‘self’ 'unsafe-inline' ‘unsafe-eval’ data: blob: http://localhost:3000 ws://localhost:3000;“ +
”script-src ‘self’ 'unsafe-inline' ‘unsafe-eval’ http://localhost:3000;“ +
”style-src ‘self’ 'unsafe-inline' http://localhost:3000;" +
“connect-src ‘self’ http://localhost:3000 ws://localhost:3000;”,
],
},
});
});
// Core: Separate development and production modes
if (this.isDevelopment) {
void this.mainWindow.loadURL(‘http://localhost:3000’);
this.mainWindow.webContents.openDevTools();
} else {
const rendererIndexPath = path.join(__dirname, ‘../renderer/index.html’);
void this.mainWindow.loadFile(rendererIndexPath);
}
}
```
### **Step 2: Unify API methods**
**File**: `src/renderer/index.tsx`
```typescript
const handleFileUpload = async () => {
try {
if (!window.electronAPI?.openFile) {
return;
}
const fileData = await window.electronAPI.openFile(); // singular
if (fileData && Array.isArray(fileData)) {
const imageUrls = fileData.map(file => file.data);
setImages(imageUrls);
}
} catch (error) {
// Prevent browser default behavior
}
};
```
### **Step 3: TypeScript Type Definitions**
**File**: `src/preload/index.ts`
```
// File data type definitions
interface FileData {
name: string;
path: string;
data: string;
size: number;
}
// Global type declarations
declare global {
interface Window {
electronAPI?: {
openFile: () => Promise<FileData[] | null>;
// Other methods...
};
}
}
```
### **Step 4: Improve development server startup timing**
**File**: `package.json`
```json
{
“scripts”: {
“dev:electron”: “wait-on dist/main/index.js dist/preload/index.js http://localhost:3000/index.html && nodemon --exec electron . --watch dist/main --watch dist/preload --ext js --delay 1000ms”
}
}
```
### **Step 5: Resolve CSP conflicts**
**File**: `webpack.renderer.config.js`
```javascript
// Remove CSP headers (managed by the main process)
devServer: {
// Remove headers: { ... }
// CSP headers are handled by the main process to avoid conflicts
}
```
---
## 🔬 Troubleshooting Checklist
### **Development Environment Diagnosis**
```bash
# 1. Check the development server
curl http://localhost:3000/index.html
# Success: HTML response received
# Failure: Connection refused or 404
# 2. Check build status
npm run build:main && npm run build:preload && npm run build:renderer
# All builds must succeed
# 3. Check process startup order
npm run dev
# Order: MAIN → PRELOAD → RENDERER → ELECTRON
```
### **Runtime diagnostics**
```javascript
// Check in the browser console
console.log(‘API status:’, window.electronAPI); // Should not be undefined
console.log(‘Development mode:’, process.env.NODE_ENV); // ‘development’
```
### **Network Diagnostics**
- Check the request for `http://localhost:3000` in the DevTools Network tab
- Verify a 200 OK response and correct MIME type
- Ensure no CSP-related errors are present
---
## 🎯 Verification Methods
### **1. Basic Functionality Testing**
- [ ] UI displays without a white screen when the app launches
- [ ] Frame selection buttons work properly
- [ ] “Load Image” button displays file dialog when clicked
- [ ] Thumbnail displayed in sidebar after image selection
- [ ] Selected image is correctly positioned in canvas area
### **2. Development Environment Testing**
- [ ] All processes start normally when running `npm run dev`
- [ ] HMR works properly when files are changed
- [ ] DevTools opens automatically and functions properly
- [ ] No fatal errors in the console
### **3. Production Build Testing**
- [ ] `npm run build` succeeds
- [ ] `npm start` runs normally
- [ ] All features work the same as in the development environment
---
## 🚨 Preventive Strategy
### **1. Improve Development Process**
- Adhere to the principle of separating development and production modes
- Set API method naming conventions
- Prioritize writing type definitions
### **2. Automated Validation**
```json
{
“scripts”: {
“pre-commit”: “npm run lint && npm run typecheck && npm run test”,
“dev-check”: “wait-on http://localhost:3000 && echo ‘Dev server ready’”,
“build-check”: “npm run build && echo ‘Build successful’”
}
}
```
### **3. Documentation and Team Sharing**
- Update preload/renderer simultaneously when adding new API methods
- Share with the entire team when changing the development environment settings
- Update this document immediately when problems occur
---
## 🔧 Troubleshooting Guide
### **Symptom-Specific Solutions**
#### **1. If a white screen is still displayed**
```bash
# Check the development server status
netstat -an | grep 3000
# Completely delete the cache
rm -rf node_modules/.cache
rm -rf dist/
npm install
npm run build
```
#### **2. If the “Load Image” button does not work**
```javascript
// Check the API in the console
console.log(‘electronAPI:’, window.electronAPI);
console.log(‘openFile method:’, window.electronAPI?.openFile);
```
#### **3. Development server startup failure**
```bash
# Check for port conflicts
lsof -ti:3000 | xargs kill -9
# Reinstall dependencies
rm -rf node_modules
npm install
```
#### **4. CSP error occurs**
- Check for CSP-related errors in the DevTools Console
- Review CSP settings in the main process
- Remove duplicate CSP headers from webpack settings
---
## 📊 Performance Metrics
### **Normal Operation Criteria**
- **App startup time**: < 3 seconds
- **UI response time**: < 100 milliseconds
- **Image loading time**: < 2 seconds (10MB or less)
- **Memory usage**: < 500MB (initial state)
### **Monitoring method**
```javascript
// Performance measurement code
const startTime = performance.now();
// Execute task
const endTime = performance.now();
console.log(`Task completion time: ${endTime - startTime}ms`);
```
---
## 🎉 Success Story
### **Before (BEFORE)**
- ❌ White screen when app launches
- ❌ Download popup displayed
- ❌ DevTools not working
- ❌ TypeScript compilation error
### **After (AFTER)**
- ✅ UI displayed immediately
- ✅ All features work properly
- ✅ Development environment HMR works
- ✅ Passed all quality checks
---
## 💡 Key Lessons
### **1. Importance of Environment Separation**
- Development and production environments operate in completely different ways
- Implement loading methods appropriate for each environment
### **2. Maintain API Consistency**
- Unify method names between preload and renderer
- Compile-time validation using TypeScript type definitions
### **3. Step-by-step problem solving**
- Verify basic functionality first
- Break down complex issues into individual components and resolve them one by one
### **4. Automated quality verification**
- Issues that may be missed during manual testing
- Ensure quality through continuous automated verification
---
## 🔗 Related Resources
### **Official Documentation**
- [Electron Official Documentation](https://www.electronjs.org/docs)
- [Webpack DevServer Configuration](https://webpack.js.org/configuration/dev-server/)
- [React Development Guide](https://react.dev/learn)
### **Project Files**
- `src/main/index.ts` - Main process logic
- `src/preload/index.ts` - IPC bridge
- `src/renderer/index.tsx` - Renderer process entry point
- `webpack.renderer.config.js` - Renderer build configuration
---
**This document is a comprehensive troubleshooting guide for Claude Code, created to help you quickly resolve similar issues in the future.**
*Last updated: 2025-07-17*
*Author: Claude Code Assistant*
*Verified: Passed all automated checks*