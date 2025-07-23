/**
 * Cut Editor - Image Processing Utilities
 * Utilities for image manipulation, canvas operations, and export
 */

import { ImageSlot, FrameSlot, ExportSettings } from '../types';

/**
 * Creates a thumbnail from an image for preview purposes
 */
export function createImageThumbnail(
  image: HTMLImageElement,
  maxWidth = 150,
  maxHeight = 150
): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    throw new Error('Could not get 2D context for thumbnail canvas');
  }

  // Calculate scaled dimensions maintaining aspect ratio
  const { width: scaledWidth, height: scaledHeight } = calculateScaledDimensions(
    image.width,
    image.height,
    maxWidth,
    maxHeight
  );

  canvas.width = scaledWidth;
  canvas.height = scaledHeight;

  // Draw the scaled image
  ctx.drawImage(image, 0, 0, scaledWidth, scaledHeight);

  return canvas;
}

/**
 * Calculates scaled dimensions while maintaining aspect ratio
 */
export function calculateScaledDimensions(
  originalWidth: number,
  originalHeight: number,
  maxWidth: number,
  maxHeight: number
): { width: number; height: number } {
  const aspectRatio = originalWidth / originalHeight;

  let width = originalWidth;
  let height = originalHeight;

  // Scale down if too wide
  if (width > maxWidth) {
    width = maxWidth;
    height = width / aspectRatio;
  }

  // Scale down if too tall
  if (height > maxHeight) {
    height = maxHeight;
    width = height * aspectRatio;
  }

  return {
    width: Math.round(width),
    height: Math.round(height),
  };
}

/**
 * Calculates the best fit scale for an image within a slot
 */
export function calculateBestFitScale(
  imageWidth: number,
  imageHeight: number,
  slotWidth: number,
  slotHeight: number
): number {
  const scaleX = slotWidth / imageWidth;
  const scaleY = slotHeight / imageHeight;
  
  // Use the smaller scale to ensure the image fits within the slot
  return Math.min(scaleX, scaleY);
}

/**
 * Calculates the position to center an image within a slot
 */
export function calculateCenterPosition(
  imageWidth: number,
  imageHeight: number,
  scale: number,
  slotWidth: number,
  slotHeight: number
): { x: number; y: number } {
  const scaledImageWidth = imageWidth * scale;
  const scaledImageHeight = imageHeight * scale;

  const x = (slotWidth - scaledImageWidth) / 2;
  const y = (slotHeight - scaledImageHeight) / 2;

  return { x, y };
}

/**
 * Draws an image slot on a canvas context
 */
export function drawImageSlot(
  ctx: CanvasRenderingContext2D,
  imageSlot: ImageSlot,
  frameSlot: FrameSlot
): void {
  if (!imageSlot.image) return;

  const { image, scale, position } = imageSlot;
  const { bounds } = frameSlot;

  // Save context state
  ctx.save();

  // Create clipping region for the slot
  ctx.beginPath();
  ctx.rect(bounds.x, bounds.y, bounds.width, bounds.height);
  ctx.clip();

  // Calculate drawing dimensions and position
  const drawWidth = image.width * scale;
  const drawHeight = image.height * scale;
  const drawX = bounds.x + position.x;
  const drawY = bounds.y + position.y;

  // Draw the image
  ctx.drawImage(image, drawX, drawY, drawWidth, drawHeight);

  // Restore context state
  ctx.restore();
}

/**
 * Renders text with italic shear effect
 */
export function drawItalicText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  fontSize: number,
  fontFamily: string,
  color: string,
  isItalic = false,
  shearAngle = 0.2
): void {
  ctx.save();

  // Apply italic transformation if needed
  if (isItalic) {
    ctx.transform(1, 0, -shearAngle, 1, 0, 0);
  }

  // Set text properties
  ctx.font = `${fontSize}px ${fontFamily}`;
  ctx.fillStyle = color;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';

  // Draw the text
  ctx.fillText(text, x, y);

  ctx.restore();
}

/**
 * Creates a high-quality export canvas
 */
export function createExportCanvas(
  width: number,
  height: number,
  backgroundColor = '#ffffff'
): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Could not get 2D context for export canvas');
  }

  canvas.width = width;
  canvas.height = height;

  // Fill background
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, width, height);

  // Set high-quality rendering
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  return canvas;
}

/**
 * Exports canvas to blob with specified format and quality
 */
export function exportCanvasToBlob(
  canvas: HTMLCanvasElement,
  format: 'png' | 'jpeg' = 'png',
  quality = 0.95
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const mimeType = format === 'png' ? 'image/png' : 'image/jpeg';
    
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to export canvas to blob'));
        }
      },
      mimeType,
      quality
    );
  });
}

/**
 * Downloads a blob as a file
 */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  link.href = url;
  link.download = filename;
  link.style.display = 'none';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up the object URL
  URL.revokeObjectURL(url);
}

/**
 * Generates a filename for export based on current timestamp
 */
export function generateExportFilename(
  format: 'png' | 'jpeg',
  prefix = 'cut-editor'
): string {
  const timestamp = new Date().toISOString()
    .replace(/[:.]/g, '-')
    .replace('T', '_')
    .split('.')[0];
  
  return `${prefix}_${timestamp ?? 'unknown'}.${format}`;
}

/**
 * Validates canvas export settings
 */
export function validateExportSettings(settings: ExportSettings): {
  isValid: boolean;
  error?: string;
} {
  // Check dimensions
  if (settings.dimensions.width <= 0 || settings.dimensions.height <= 0) {
    return {
      isValid: false,
      error: 'Export dimensions must be greater than 0',
    };
  }

  // Check quality for JPEG
  if (settings.format === 'jpeg' && (settings.quality < 0 || settings.quality > 100)) {
    return {
      isValid: false,
      error: 'JPEG quality must be between 0 and 100',
    };
  }

  // Check DPI
  if (settings.dpi <= 0) {
    return {
      isValid: false,
      error: 'DPI must be greater than 0',
    };
  }

  return { isValid: true };
}

/**
 * Calculates export dimensions based on DPI
 */
export function calculateExportDimensions(
  baseWidth: number,
  baseHeight: number,
  targetDpi: number,
  baseDpi = 72
): { width: number; height: number } {
  const scaleFactor = targetDpi / baseDpi;
  
  return {
    width: Math.round(baseWidth * scaleFactor),
    height: Math.round(baseHeight * scaleFactor),
  };
}

/**
 * Creates a progress tracking wrapper for long operations
 */
export function withProgress<T>(
  operation: () => Promise<T>,
  onProgress: (progress: number) => void,
  steps = 100
): Promise<T> {
  return new Promise((resolve, reject) => {
    let currentStep = 0;
    
    const updateProgress = (): void => {
      currentStep++;
      onProgress((currentStep / steps) * 100);
    };

    // Simulate progress updates during the operation
    const progressInterval = setInterval(updateProgress, 50);

    operation()
      .then((result) => {
        clearInterval(progressInterval);
        onProgress(100);
        resolve(result);
      })
      .catch((error) => {
        clearInterval(progressInterval);
        reject(error);
      });
  });
}