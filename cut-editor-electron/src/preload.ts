/**
 * Cut Editor - Preload Script
 * Secure context bridge between main and renderer processes
 */

import { contextBridge, ipcRenderer } from 'electron';
import {
  IpcApi,
  FileFilter,
  ImageData,
  ExportData,
  FontData,
} from './shared/types';

/**
 * IPC response wrapper for consistent error handling
 */
interface IpcResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

/**
 * Type-safe IPC API implementation
 */
const electronAPI: IpcApi = {
  /**
   * Show file selection dialog
   */
  selectFile: async (filters: FileFilter[]): Promise<string | null> => {
    const response = (await ipcRenderer.invoke(
      'file:select',
      filters
    )) as IpcResponse<string | null>;

    if (!response.success) {
      throw new Error(response.error?.message ?? 'File selection failed');
    }

    return response.data ?? null;
  },

  /**
   * Load image from file path
   */
  loadImage: async (path: string): Promise<ImageData> => {
    if (!path || path.trim().length === 0) {
      throw new Error('Invalid file path provided');
    }

    const response = (await ipcRenderer.invoke(
      'file:load-image',
      path
    )) as IpcResponse<ImageData>;

    if (!response.success) {
      throw new Error(response.error?.message ?? 'Image loading failed');
    }

    if (!response.data) {
      throw new Error('No image data received');
    }

    return response.data;
  },

  /**
   * Save image data to file
   */
  saveImage: async (data: ExportData, path: string): Promise<void> => {
    if (!data || !path || path.trim().length === 0) {
      throw new Error('Invalid data or path provided');
    }

    const response = (await ipcRenderer.invoke(
      'file:save-image',
      data,
      path
    )) as IpcResponse<void>;

    if (!response.success) {
      throw new Error(response.error?.message ?? 'Image save failed');
    }
  },

  /**
   * Load font from file path
   */
  loadFont: async (path: string): Promise<FontData> => {
    if (!path || path.trim().length === 0) {
      throw new Error('Invalid font path provided');
    }

    const response = (await ipcRenderer.invoke(
      'file:load-font',
      path
    )) as IpcResponse<FontData>;

    if (!response.success) {
      throw new Error(response.error?.message ?? 'Font loading failed');
    }

    if (!response.data) {
      throw new Error('No font data received');
    }

    return response.data;
  },
};

/**
 * Extended API for additional file operations
 */
const fileAPI = {
  /**
   * Show save file dialog
   */
  selectSaveLocation: async (
    defaultName: string,
    filters: FileFilter[]
  ): Promise<string | null> => {
    const response = (await ipcRenderer.invoke(
      'file:select-save',
      defaultName,
      filters
    )) as IpcResponse<string | null>;

    if (!response.success) {
      throw new Error(
        response.error?.message ?? 'Save location selection failed'
      );
    }

    return response.data ?? null;
  },
};

// Expose the APIs to the renderer process through contextBridge
contextBridge.exposeInMainWorld('electronAPI', electronAPI);
contextBridge.exposeInMainWorld('fileAPI', fileAPI);
