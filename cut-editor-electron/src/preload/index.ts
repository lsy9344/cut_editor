import { contextBridge, ipcRenderer } from 'electron';
import { IPC_CHANNELS } from '@shared/constants';

// Global polyfill for Fabric.js compatibility - earliest possible initialization
interface GlobalThisWithGlobal {
  global?: typeof globalThis;
}

if (typeof (globalThis as GlobalThisWithGlobal).global === 'undefined') {
  (globalThis as GlobalThisWithGlobal).global = globalThis;
}

// Define the API that will be exposed to the renderer process
const electronAPI = {
  // Window controls
  getAppConfig: () => ipcRenderer.invoke(IPC_CHANNELS.WINDOW_READY),
  closeWindow: () => ipcRenderer.invoke(IPC_CHANNELS.WINDOW_CLOSE),
  minimizeWindow: () => ipcRenderer.invoke(IPC_CHANNELS.WINDOW_MINIMIZE),
  maximizeWindow: () => ipcRenderer.invoke(IPC_CHANNELS.WINDOW_MAXIMIZE),

  // File operations
  openFile: () => ipcRenderer.invoke(IPC_CHANNELS.FILE_OPEN),
  saveFile: (data: unknown) => ipcRenderer.invoke(IPC_CHANNELS.FILE_SAVE, data),

  // Image operations
  exportImage: (imageData: unknown) => ipcRenderer.invoke(IPC_CHANNELS.IMAGE_EXPORT, imageData),
};

// Expose the API to the renderer process
contextBridge.exposeInMainWorld('electronAPI', electronAPI);

// Type declaration for the exposed API
declare global {
  interface Window {
    electronAPI?: typeof electronAPI;
  }
}
