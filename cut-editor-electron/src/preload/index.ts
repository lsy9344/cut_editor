import { contextBridge, ipcRenderer } from 'electron';
import { Buffer } from 'buffer';
import { IPC_CHANNELS } from '@shared/constants';

// Global polyfill for Fabric.js compatibility - earliest possible initialization
interface GlobalThisWithGlobal {
  global?: typeof globalThis;
}

if (typeof (globalThis as GlobalThisWithGlobal).global === 'undefined') {
  (globalThis as GlobalThisWithGlobal).global = globalThis;
}

// Expose Buffer to global scope for fabric.js compatibility
interface GlobalThisWithBuffer {
  Buffer?: typeof Buffer;
}

(globalThis as GlobalThisWithBuffer).Buffer = Buffer;

// Define the API that will be exposed to the renderer process
const electronAPI = {
  // App configuration
  getAppConfig: () => ipcRenderer.invoke(IPC_CHANNELS.APP_CONFIG),

  // Window controls
  closeWindow: () => ipcRenderer.invoke(IPC_CHANNELS.WINDOW_CLOSE),
  minimizeWindow: () => ipcRenderer.invoke(IPC_CHANNELS.WINDOW_MINIMIZE),
  maximizeWindow: () => ipcRenderer.invoke(IPC_CHANNELS.WINDOW_MAXIMIZE),

  // File operations
  openFile: () => ipcRenderer.invoke(IPC_CHANNELS.FILE_OPEN),
  saveFile: (data: unknown) => ipcRenderer.invoke(IPC_CHANNELS.FILE_SAVE, data),

  // Image operations
  exportImage: (imageData: unknown) => ipcRenderer.invoke(IPC_CHANNELS.IMAGE_EXPORT, imageData),

  // Node.js Buffer utilities for fabric.js compatibility
  buffer: {
    from: (data: string | ArrayBuffer | Uint8Array, encoding?: BufferEncoding) =>
      Buffer.from(data, encoding),
    isBuffer: (obj: unknown) => Buffer.isBuffer(obj),
    alloc: (size: number, fill?: string | Buffer | number, encoding?: BufferEncoding) =>
      Buffer.alloc(size, fill, encoding),
    allocUnsafe: (size: number) => Buffer.allocUnsafe(size),
    concat: (list: readonly Uint8Array[], totalLength?: number) =>
      Buffer.concat(list, totalLength),
  },
};

// Expose the API to the renderer process
contextBridge.exposeInMainWorld('electronAPI', electronAPI);

// Type for file data returned by file operations
interface FileData {
  name: string;
  path: string;
  data: string;
  size: number;
}

// Type declaration for the exposed API
declare global {
  interface Window {
    electronAPI?: {
      getAppConfig: () => Promise<{
        isDevelopment: boolean;
        appName: string;
        appVersion: string;
      }>;
      closeWindow: () => Promise<void>;
      minimizeWindow: () => Promise<void>;
      maximizeWindow: () => Promise<void>;
      openFile: () => Promise<FileData[] | null>;
      saveFile: (data: unknown) => Promise<string | null>;
      exportImage: (imageData: unknown) => Promise<string | null>;
      buffer: {
        from: (data: string | ArrayBuffer | Uint8Array, encoding?: BufferEncoding) => Buffer;
        isBuffer: (obj: unknown) => boolean;
        alloc: (size: number, fill?: string | Buffer | number,
          encoding?: BufferEncoding) => Buffer;
        allocUnsafe: (size: number) => Buffer;
        concat: (list: readonly Uint8Array[], totalLength?: number) => Buffer;
      };
    };
  }
}
