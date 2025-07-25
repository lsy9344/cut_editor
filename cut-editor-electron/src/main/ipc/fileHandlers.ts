/**
 * Cut Editor - File IPC Handlers
 * IPC channel handlers for file operations
 */

import { ipcMain } from 'electron';
import { FileService } from '../services/FileService';
import {
  FileFilter,
  ImageData,
  ExportData,
  FontData,
} from '../../shared/types';

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
 * Create success response
 */
function createSuccessResponse<T>(data: T): IpcResponse<T> {
  return {
    success: true,
    data,
  };
}

/**
 * Create error response
 */
function createErrorResponse(
  code: string,
  message: string
): IpcResponse<never> {
  return {
    success: false,
    error: {
      code,
      message,
    },
  };
}

/**
 * Set up all file-related IPC handlers
 */
export function setupFileHandlers(): void {
  // File selection handler
  ipcMain.handle(
    'file:select',
    async (_, filters: FileFilter[]): Promise<IpcResponse<string | null>> => {
      try {
        const filePath = await FileService.selectFile(filters);
        return createSuccessResponse(filePath);
      } catch (error) {
        return createErrorResponse(
          'FILE_SELECTION_ERROR',
          error instanceof Error
            ? error.message
            : 'Unknown file selection error'
        );
      }
    }
  );

  // Save location selection handler
  ipcMain.handle(
    'file:select-save',
    async (
      _,
      defaultName: string,
      filters: FileFilter[]
    ): Promise<IpcResponse<string | null>> => {
      try {
        const filePath = await FileService.selectSaveLocation(
          defaultName,
          filters
        );
        return createSuccessResponse(filePath);
      } catch (error) {
        return createErrorResponse(
          'SAVE_LOCATION_ERROR',
          error instanceof Error ? error.message : 'Unknown save location error'
        );
      }
    }
  );

  // Image loading handler
  ipcMain.handle(
    'file:load-image',
    async (_, filePath: string): Promise<IpcResponse<ImageData>> => {
      try {
        const imageData = await FileService.loadImage(filePath);
        return createSuccessResponse(imageData);
      } catch (error) {
        return createErrorResponse(
          'IMAGE_LOAD_ERROR',
          error instanceof Error ? error.message : 'Unknown image loading error'
        );
      }
    }
  );

  // Image saving handler
  ipcMain.handle(
    'file:save-image',
    async (
      _,
      data: ExportData,
      filePath: string
    ): Promise<IpcResponse<void>> => {
      try {
        await FileService.saveImage(data, filePath);
        return createSuccessResponse(undefined);
      } catch (error) {
        return createErrorResponse(
          'IMAGE_SAVE_ERROR',
          error instanceof Error ? error.message : 'Unknown image save error'
        );
      }
    }
  );

  // Font loading handler
  ipcMain.handle(
    'file:load-font',
    async (_, filePath: string): Promise<IpcResponse<FontData>> => {
      try {
        const fontData = await FileService.loadFont(filePath);
        return createSuccessResponse(fontData);
      } catch (error) {
        return createErrorResponse(
          'FONT_LOAD_ERROR',
          error instanceof Error ? error.message : 'Unknown font loading error'
        );
      }
    }
  );
}

/**
 * Clean up all file-related IPC handlers
 */
export function cleanupFileHandlers(): void {
  ipcMain.removeAllListeners('file:select');
  ipcMain.removeAllListeners('file:select-save');
  ipcMain.removeAllListeners('file:load-image');
  ipcMain.removeAllListeners('file:save-image');
  ipcMain.removeAllListeners('file:load-font');
}
