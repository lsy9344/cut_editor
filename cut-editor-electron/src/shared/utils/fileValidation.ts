/**
 * Cut Editor - File Validation Utilities
 * Utilities for validating uploaded files with user-friendly error messages
 */

export interface FileValidationResult {
  isValid: boolean;
  error?: string;
  warning?: string;
}

// Supported image formats
export const SUPPORTED_IMAGE_FORMATS = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
] as const;

export const SUPPORTED_IMAGE_EXTENSIONS = [
  '.jpg',
  '.jpeg',
  '.png',
  '.webp',
  '.gif',
] as const;

// File size limits (in bytes)
export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
export const RECOMMENDED_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const MIN_IMAGE_DIMENSION = 100; // 100px minimum
export const MAX_IMAGE_DIMENSION = 8000; // 8000px maximum

/**
 * Validates if a file is a supported image format
 */
export function validateImageFile(file: File): FileValidationResult {
  // Check if file exists
  if (!file) {
    return {
      isValid: false,
      error: 'No file selected',
    };
  }

  // Check file type
  if (
    !SUPPORTED_IMAGE_FORMATS.includes(
      file.type as (typeof SUPPORTED_IMAGE_FORMATS)[number]
    )
  ) {
    return {
      isValid: false,
      error: `Unsupported file format. Please use: ${SUPPORTED_IMAGE_EXTENSIONS.join(', ')}`,
    };
  }

  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      isValid: false,
      error: `File size too large. Maximum size is ${formatFileSize(MAX_FILE_SIZE)}.`,
    };
  }

  // Check for recommended file size warning
  const result: FileValidationResult = { isValid: true };
  if (file.size > RECOMMENDED_FILE_SIZE) {
    result.warning = `Large file size (${formatFileSize(file.size)}). Consider optimizing for better performance.`;
  }

  return result;
}

/**
 * Validates image dimensions after loading
 */
export function validateImageDimensions(
  image: HTMLImageElement
): FileValidationResult {
  const { width, height } = image;

  // Check minimum dimensions
  if (width < MIN_IMAGE_DIMENSION || height < MIN_IMAGE_DIMENSION) {
    return {
      isValid: false,
      error: `Image too small. Minimum size is ${MIN_IMAGE_DIMENSION}x${MIN_IMAGE_DIMENSION}px.`,
    };
  }

  // Check maximum dimensions
  if (width > MAX_IMAGE_DIMENSION || height > MAX_IMAGE_DIMENSION) {
    return {
      isValid: false,
      error: `Image too large. Maximum size is ${MAX_IMAGE_DIMENSION}x${MAX_IMAGE_DIMENSION}px.`,
    };
  }

  // Check for potential quality issues with very small images
  const result: FileValidationResult = { isValid: true };
  if (width < 500 || height < 500) {
    result.warning =
      'Image resolution is quite low. Consider using a higher resolution image for better quality.';
  }

  return result;
}

/**
 * Validates multiple files for batch upload
 */
export function validateImageFiles(files: FileList | File[]): {
  validFiles: File[];
  invalidFiles: { file: File; error: string }[];
  warnings: string[];
} {
  const validFiles: File[] = [];
  const invalidFiles: { file: File; error: string }[] = [];
  const warnings: string[] = [];

  const fileArray = Array.from(files);

  for (const file of fileArray) {
    const result = validateImageFile(file);

    if (result.isValid) {
      validFiles.push(file);
      if (result.warning) {
        warnings.push(`${file.name}: ${result.warning}`);
      }
    } else {
      invalidFiles.push({
        file,
        error: result.error ?? 'Unknown error',
      });
    }
  }

  return { validFiles, invalidFiles, warnings };
}

/**
 * Loads and validates an image from a file
 */
export function loadImageFromFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    // First validate the file
    const fileValidation = validateImageFile(file);
    if (!fileValidation.isValid) {
      reject(new Error(fileValidation.error));
      return;
    }

    const image = new Image();

    image.onload = (): void => {
      // Validate dimensions after loading
      const dimensionValidation = validateImageDimensions(image);
      if (!dimensionValidation.isValid) {
        reject(new Error(dimensionValidation.error));
        return;
      }

      resolve(image);
    };

    image.onerror = (): void => {
      reject(new Error('Failed to load image. The file may be corrupted.'));
    };

    // Create object URL and load image
    const objectUrl = URL.createObjectURL(file);
    image.src = objectUrl;

    // Clean up object URL after loading
    image.onload = (): void => {
      URL.revokeObjectURL(objectUrl);

      // Validate dimensions after loading
      const dimensionValidation = validateImageDimensions(image);
      if (!dimensionValidation.isValid) {
        reject(new Error(dimensionValidation.error));
        return;
      }

      resolve(image);
    };
  });
}

/**
 * Formats file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';

  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i] ?? 'B'}`;
}

/**
 * Gets user-friendly error message for common file errors
 */
export function getFileErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  return 'An unknown error occurred while processing the file.';
}

/**
 * Checks if drag event contains valid image files
 */
export function hasValidImageFiles(event: DragEvent): boolean {
  if (!event.dataTransfer?.files) return false;

  const files = Array.from(event.dataTransfer.files);
  return files.some(file =>
    SUPPORTED_IMAGE_FORMATS.includes(
      file.type as (typeof SUPPORTED_IMAGE_FORMATS)[number]
    )
  );
}

/**
 * Extracts valid image files from drag event
 */
export function getValidImageFilesFromDrag(event: DragEvent): File[] {
  if (!event.dataTransfer?.files) return [];

  const files = Array.from(event.dataTransfer.files);
  return files.filter(file =>
    SUPPORTED_IMAGE_FORMATS.includes(
      file.type as (typeof SUPPORTED_IMAGE_FORMATS)[number]
    )
  );
}
