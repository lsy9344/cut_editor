/**
 * Cut Editor - Image Loader Hook
 * Custom hook for loading images with proper error handling and state management
 */

import { useCallback, useMemo } from 'react';
import { useFileOperations } from './useFileOperations';
import { ImageData } from '../../shared/types';

export interface UseImageLoaderReturn {
  isLoading: boolean;
  error: string | null;
  progress: number;
  selectAndLoadImage: () => Promise<{
    filePath: string;
    imageData: ImageData;
  } | null>;
  loadImageFromPath: (filePath: string) => Promise<ImageData>;
  clearError: () => void;
}

/**
 * Custom hook for image loading operations
 */
export const useImageLoader = (): UseImageLoaderReturn => {
  const fileOps = useFileOperations();

  /**
   * Select image file and load it
   */
  const selectAndLoadImage = useCallback(async (): Promise<{
    filePath: string;
    imageData: ImageData;
  } | null> => {
    try {
      // First, select the image file
      const filePath = await fileOps.selectImageFile();
      if (!filePath) {
        return null; // User cancelled
      }

      // Then load the image data
      const imageData = await fileOps.loadImage(filePath);

      return {
        filePath,
        imageData,
      };
    } catch (error) {
      // Error is already handled by useFileOperations
      return null;
    }
  }, [fileOps]);

  /**
   * Load image from existing file path
   */
  const loadImageFromPath = useCallback(
    async (filePath: string): Promise<ImageData> => {
      return await fileOps.loadImage(filePath);
    },
    [fileOps]
  );

  return useMemo(
    () => ({
      isLoading: fileOps.state.isLoading,
      error: fileOps.state.error,
      progress: fileOps.state.progress,
      selectAndLoadImage,
      loadImageFromPath,
      clearError: fileOps.clearError,
    }),
    [
      fileOps.state.isLoading,
      fileOps.state.error,
      fileOps.state.progress,
      selectAndLoadImage,
      loadImageFromPath,
      fileOps.clearError,
    ]
  );
};
