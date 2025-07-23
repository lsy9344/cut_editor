/**
 * Cut Editor - Image Uploader Component
 * File selection with drag-drop support and file validation
 */

import React, { memo, useCallback, useRef, useState, useEffect } from 'react';
import { ImageUploaderProps } from '../../shared/types';
import {
  loadImageFromFile,
  hasValidImageFiles,
  getValidImageFilesFromDrag,
  SUPPORTED_IMAGE_EXTENSIONS,
} from '../../shared/utils/fileValidation';

const ImageUploader: React.FC<ImageUploaderProps> = memo(({
  selectedSlotId,
  onImageUpload,
  isLoading,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Clear error when selectedSlotId changes
  useEffect(() => {
    setUploadError(null);
  }, [selectedSlotId]);

  // Handle file selection from input
  const handleFileSelect = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0 || !selectedSlotId) return;

      const file = files[0];
      if (!file) return;
      
      setIsUploading(true);
      setUploadError(null);

      try {
        // Validate and load the image
        await loadImageFromFile(file);
        onImageUpload(selectedSlotId, file);
      } catch (error) {
        setUploadError(error instanceof Error ? error.message : 'Failed to load image');
      } finally {
        setIsUploading(false);
      }
    },
    [selectedSlotId, onImageUpload]
  );

  // Handle file input change
  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      void handleFileSelect(event.target.files);
      // Reset input value to allow selecting the same file again
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    },
    [handleFileSelect]
  );

  // Handle drag over
  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    
    if (hasValidImageFiles(event.nativeEvent)) {
      setIsDragOver(true);
    }
  }, []);

  // Handle drag leave
  const handleDragLeave = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    
    // Only reset if leaving the drop zone completely
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX;
    const y = event.clientY;
    
    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      setIsDragOver(false);
    }
  }, []);

  // Handle drop
  const handleDrop = useCallback(
    async (event: React.DragEvent) => {
      event.preventDefault();
      event.stopPropagation();
      setIsDragOver(false);

      if (!selectedSlotId) return;

      const files = getValidImageFilesFromDrag(event.nativeEvent);
      if (files.length === 0) {
        setUploadError('No valid image files found in drop');
        return;
      }

      const file = files[0]; // Use first valid file
      if (!file) return;
      
      setIsUploading(true);
      setUploadError(null);

      try {
        await loadImageFromFile(file);
        onImageUpload(selectedSlotId, file);
      } catch (error) {
        setUploadError(error instanceof Error ? error.message : 'Failed to load image');
      } finally {
        setIsUploading(false);
      }
    },
    [selectedSlotId, onImageUpload]
  );

  // Handle click to open file dialog
  const handleClick = useCallback(() => {
    if (!isLoading && !isUploading && fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, [isLoading, isUploading]);

  // Handle keyboard interaction
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        handleClick();
      }
    },
    [handleClick]
  );

  const isDisabled = isLoading || isUploading || !selectedSlotId;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-900">Upload Image</h3>
        {selectedSlotId && (
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
            Slot {selectedSlotId.replace('slot_', '')}
          </span>
        )}
      </div>

      {/* Upload Area */}
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-6 transition-all duration-200
          ${
            isDragOver
              ? 'border-blue-400 bg-blue-50'
              : isDisabled
              ? 'border-gray-200 bg-gray-50'
              : 'border-gray-300 bg-white hover:border-gray-400'
          }
          ${!isDisabled ? 'cursor-pointer' : 'cursor-not-allowed'}
        `}
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={(e) => void handleDrop(e)}
        onKeyDown={handleKeyDown}
        tabIndex={isDisabled ? -1 : 0}
        role="button"
        aria-label={
          selectedSlotId
            ? `Upload image to ${selectedSlotId}`
            : 'Select a frame slot first'
        }
        aria-disabled={isDisabled}
      >
        <div className="text-center">
          {isUploading ? (
            <>
              <svg
                className="mx-auto h-12 w-12 text-blue-400 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <p className="mt-2 text-sm text-gray-600">Uploading image...</p>
            </>
          ) : (
            <>
              <svg
                className={`mx-auto h-12 w-12 ${
                  isDisabled ? 'text-gray-300' : 'text-gray-400'
                }`}
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              
              <div className="mt-4">
                {!selectedSlotId ? (
                  <p className="text-sm text-gray-500">
                    Select a frame slot first to upload an image
                  </p>
                ) : (
                  <div>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium text-blue-600">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {SUPPORTED_IMAGE_EXTENSIONS.join(', ')} up to 50MB
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept={SUPPORTED_IMAGE_EXTENSIONS.join(',')}
          onChange={handleInputChange}
          className="hidden"
          disabled={isDisabled}
        />

        {/* Drag overlay */}
        {isDragOver && (
          <div className="absolute inset-0 bg-blue-100 bg-opacity-75 rounded-lg flex items-center justify-center">
            <div className="text-blue-600 font-medium">Drop image here</div>
          </div>
        )}
      </div>

      {/* Error Display */}
      {uploadError && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-800">{uploadError}</p>
            </div>
            <div className="ml-auto pl-3">
              <button
                type="button"
                className="inline-flex rounded-md bg-red-50 p-1.5 text-red-500 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-red-50"
                onClick={() => setUploadError(null)}
                aria-label="Dismiss error"
              >
                <svg
                  className="h-3 w-3"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      {!selectedSlotId && (
        <div className="text-xs text-gray-500 space-y-1">
          <p>1. Select a frame layout above</p>
          <p>2. Click on a slot in the preview</p>
          <p>3. Upload an image for that slot</p>
        </div>
      )}
    </div>
  );
});

ImageUploader.displayName = 'ImageUploader';

export default ImageUploader;