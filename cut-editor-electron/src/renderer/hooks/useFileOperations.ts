/**
 * Cut Editor - File Operations Hook
 * Custom hook for handling file operations through Electron IPC
 */

import { useState, useCallback } from 'react';
import {
  FileFilter,
  ImageData,
  ExportData,
  FontData,
} from '../../shared/types';

export interface FileOperationState {
  isLoading: boolean;
  error: string | null;
  progress: number;
}

export interface UseFileOperationsReturn {
  state: FileOperationState;
  selectImageFile: () => Promise<string | null>;
  selectProjectFile: () => Promise<string | null>;
  selectSaveLocation: (defaultName: string) => Promise<string | null>;
  loadImage: (filePath: string) => Promise<ImageData>;
  saveImage: (data: ExportData, filePath: string) => Promise<void>;
  loadFont: (filePath: string) => Promise<FontData>;
  clearError: () => void;
}

/**
 * File filters for different file types
 */
const FILE_FILTERS = {
  IMAGE: [
    {
      name: 'Image Files',
      extensions: ['png', 'jpg', 'jpeg', 'webp', 'bmp', 'gif'],
    },
  ] as FileFilter[],

  PROJECT: [
    {
      name: 'Cut Editor Projects',
      extensions: ['cutproj', 'json'],
    },
  ] as FileFilter[],

  EXPORT: [
    {
      name: 'PNG Images',
      extensions: ['png'],
    },
    {
      name: 'JPEG Images',
      extensions: ['jpg', 'jpeg'],
    },
  ] as FileFilter[],

  FONT: [
    {
      name: 'Font Files',
      extensions: ['ttf', 'otf', 'woff', 'woff2'],
    },
  ] as FileFilter[],
};

/**
 * Custom hook for file operations
 */
export const useFileOperations = (): UseFileOperationsReturn => {
  const [state, setState] = useState<FileOperationState>({
    isLoading: false,
    error: null,
    progress: 0,
  });

  /**
   * Set loading state
   */
  const setLoading = useCallback((isLoading: boolean, progress = 0) => {
    setState(prev => ({
      ...prev,
      isLoading,
      progress,
      error: isLoading ? null : prev.error,
    }));
  }, []);

  /**
   * Set error state
   */
  const setError = useCallback((error: string) => {
    setState(prev => ({
      ...prev,
      isLoading: false,
      error,
      progress: 0,
    }));
  }, []);

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setState(prev => ({
      ...prev,
      error: null,
    }));
  }, []);

  /**
   * Select image file for import
   */
  const selectImageFile = useCallback(async (): Promise<string | null> => {
    try {
      setLoading(true);

      if (!window.electronAPI) {
        throw new Error('Electron API not available');
      }

      const filePath = await window.electronAPI.selectFile(FILE_FILTERS.IMAGE);
      return filePath;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to select image file';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [setError, setLoading]);

  /**
   * Select project file for loading
   */
  const selectProjectFile = useCallback(async (): Promise<string | null> => {
    try {
      setLoading(true);

      if (!window.electronAPI) {
        throw new Error('Electron API not available');
      }

      const filePath = await window.electronAPI.selectFile(
        FILE_FILTERS.PROJECT
      );
      return filePath;
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to select project file';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [setError, setLoading]);

  /**
   * Select save location for export
   */
  const selectSaveLocation = useCallback(
    async (defaultName: string): Promise<string | null> => {
      try {
        setLoading(true);

        if (!window.fileAPI) {
          throw new Error('File API not available');
        }

        const filePath = await window.fileAPI.selectSaveLocation(
          defaultName,
          FILE_FILTERS.EXPORT
        );
        return filePath;
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : 'Failed to select save location';
        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [setError, setLoading]
  );

  /**
   * Load image data from file path
   */
  const loadImage = useCallback(
    async (filePath: string): Promise<ImageData> => {
      try {
        setLoading(true, 25);

        if (!window.electronAPI) {
          throw new Error('Electron API not available');
        }

        setLoading(true, 50);
        const imageData = await window.electronAPI.loadImage(filePath);

        setLoading(true, 100);
        return imageData;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to load image';
        setError(errorMessage);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [setError, setLoading]
  );

  /**
   * Save image data to file
   */
  const saveImage = useCallback(
    async (data: ExportData, filePath: string): Promise<void> => {
      try {
        setLoading(true, 25);

        if (!window.electronAPI) {
          throw new Error('Electron API not available');
        }

        setLoading(true, 75);
        await window.electronAPI.saveImage(data, filePath);

        setLoading(true, 100);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to save image';
        setError(errorMessage);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [setError, setLoading]
  );

  /**
   * Load font data from file path
   */
  const loadFont = useCallback(
    async (filePath: string): Promise<FontData> => {
      try {
        setLoading(true);

        if (!window.electronAPI) {
          throw new Error('Electron API not available');
        }

        const fontData = await window.electronAPI.loadFont(filePath);
        return fontData;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to load font';
        setError(errorMessage);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [setError, setLoading]
  );

  return {
    state,
    selectImageFile,
    selectProjectFile,
    selectSaveLocation,
    loadImage,
    saveImage,
    loadFont,
    clearError,
  };
};
