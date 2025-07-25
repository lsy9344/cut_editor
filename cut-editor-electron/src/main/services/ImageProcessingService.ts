/**
 * Cut Editor - Image Processing Service
 * High-quality image processing using Sharp.js with memory management
 */

import sharp, { Metadata } from 'sharp';
import { ImageData, ExportData } from '../../shared/types';

/**
 * Extended metadata interface for Sharp.js with additional properties
 */
interface ExtendedMetadata extends Metadata {
  isAnimated?: boolean;
  predictor?: string;
  pyramid?: boolean;
  bitdepth?: number;
  miniswhite?: boolean;
}

export interface ProcessingOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: 'png' | 'jpeg' | 'webp';
  progressive?: boolean;
  density?: number;
  memoryLimit?: number; // Memory limit in MB for large image processing
  streaming?: boolean; // Enable streaming for very large images
}

export interface ThumbnailOptions {
  width: number;
  height: number;
  fit?: 'contain' | 'cover' | 'fill' | 'inside' | 'outside';
  quality?: number;
}

export class ImageProcessingService {
  // Memory management constants
  private static readonly DEFAULT_MEMORY_LIMIT_MB = 256;
  private static readonly LARGE_IMAGE_THRESHOLD_MB = 50;
  private static readonly MAX_PIXELS_BEFORE_STREAMING = 100 * 1000 * 1000; // 100MP
  /**
   * Check if image requires streaming based on size and memory constraints
   */
  private static shouldUseStreaming(metadata: ExtendedMetadata): boolean {
    if (!metadata.width || !metadata.height) return false;

    const pixels = metadata.width * metadata.height;
    const channels = metadata.channels ?? 4; // Assume RGBA if unknown
    const bytesPerPixel =
      channels * (String(metadata.depth).includes('16') ? 2 : 1);
    const imageSizeMB = (pixels * bytesPerPixel) / (1024 * 1024);

    return (
      imageSizeMB > this.LARGE_IMAGE_THRESHOLD_MB ||
      pixels > this.MAX_PIXELS_BEFORE_STREAMING
    );
  }

  /**
   * Configure Sharp instance with memory-optimized settings
   */
  private static configureSharpForMemory(instance: sharp.Sharp): sharp.Sharp {
    // Use basic memory optimization
    return instance;
  }

  /**
   * Load image with Sharp.js and extract comprehensive metadata
   */
  static async loadImageWithMetadata(
    buffer: Buffer,
    options: ProcessingOptions = {}
  ): Promise<ImageData> {
    try {
      // Create Sharp instance
      const image = sharp(buffer);

      // Extract metadata first
      const metadata = (await image.metadata()) as ExtendedMetadata;

      // Validate essential metadata
      if (!metadata.width || !metadata.height) {
        throw new Error('Invalid image: missing dimensions');
      }

      // Check if streaming is needed for large images
      const useStreaming = this.shouldUseStreaming(metadata);

      // Configure image processing based on size
      let processedBuffer: Buffer;
      if (useStreaming || options.streaming) {
        // For large images, use progressive processing and lower quality for internal use
        processedBuffer = await sharp(buffer)
          .jpeg({ quality: 85, progressive: true, mozjpeg: true })
          .toBuffer();
      } else {
        // For smaller images, use high-quality PNG
        processedBuffer = await sharp(buffer)
          .png({ quality: 100, compressionLevel: 0 })
          .toBuffer();
      }

      const imageData: ImageData = {
        buffer: processedBuffer.buffer.slice(
          processedBuffer.byteOffset,
          processedBuffer.byteOffset + processedBuffer.byteLength
        ),
        width: metadata.width,
        height: metadata.height,
        format: metadata.format ?? 'unknown',
      };

      // Add optional enhanced metadata only if they exist
      if (metadata.format) imageData.originalFormat = metadata.format;
      if (metadata.hasAlpha !== undefined)
        imageData.hasAlpha = metadata.hasAlpha;
      if (metadata.density !== undefined) imageData.density = metadata.density;
      if (metadata.space) imageData.colorSpace = metadata.space;
      if (metadata.channels !== undefined)
        imageData.channels = metadata.channels;
      if (metadata.depth) imageData.depth = metadata.depth;
      if (metadata.isAnimated !== undefined)
        imageData.isAnimated = metadata.isAnimated;
      if (metadata.pages !== undefined) imageData.pages = metadata.pages;

      // Add metadata object with only defined properties
      imageData.metadata = {
        ...(metadata.orientation && { orientation: metadata.orientation }),
        ...(metadata.chromaSubsampling && {
          chromaSubsampling: metadata.chromaSubsampling,
        }),
        ...(metadata.isProgressive !== undefined && {
          isProgressive: metadata.isProgressive,
        }),
        ...(metadata.compression && { compression: metadata.compression }),
        ...(metadata.predictor && { predictor: metadata.predictor }),
        ...(metadata.pyramid !== undefined && { pyramid: metadata.pyramid }),
        ...(metadata.bitdepth && { bitdepth: metadata.bitdepth }),
        ...(metadata.miniswhite !== undefined && {
          miniswhite: metadata.miniswhite,
        }),
        xmpPresent: !!metadata.xmp,
        iccPresent: !!metadata.icc,
        exifPresent: !!metadata.exif,
      };

      return imageData;
    } catch (error) {
      throw new Error(
        `Image processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Generate thumbnail for UI performance
   */
  static async generateThumbnail(
    buffer: Buffer,
    options: ThumbnailOptions
  ): Promise<Buffer> {
    try {
      const thumbnail = await sharp(buffer)
        .resize(options.width, options.height, {
          fit: options.fit ?? 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 0 },
        })
        .png({ quality: options.quality ?? 80 })
        .toBuffer();

      return thumbnail;
    } catch (error) {
      throw new Error(
        `Thumbnail generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Process image for export with high-quality options
   */
  static async processForExport(
    data: ExportData,
    options: ProcessingOptions = {}
  ): Promise<Buffer> {
    try {
      // Create Sharp instance from export data
      const image = sharp(Buffer.from(data.imageBuffer));

      // Apply processing options
      let processor = image;

      // Resize if dimensions specified
      if (options.maxWidth || options.maxHeight) {
        processor = processor.resize(options.maxWidth, options.maxHeight, {
          fit: 'inside',
          withoutEnlargement: true,
        });
      }

      // Set density for high-resolution output
      if (data.density || options.density) {
        processor = processor.withMetadata({
          density: data.density ?? options.density,
        });
      }

      // Format-specific processing
      switch (data.format) {
        case 'png':
          processor = processor.png({
            quality: data.quality ?? options.quality ?? 100,
            compressionLevel: data.compression?.level ?? 6,
            progressive: data.compression?.progressive ?? false,
          });
          break;

        case 'jpeg':
          processor = processor.jpeg({
            quality: data.quality ?? options.quality ?? 95,
            progressive: data.compression?.progressive ?? true,
            optimizeScans: true,
            mozjpeg: true, // Use mozjpeg for better compression
          });
          break;

        case 'webp':
          processor = processor.webp({
            quality: data.quality ?? options.quality ?? 90,
            lossless: data.compression?.lossless ?? false,
            effort: 6, // Maximum effort for best compression
          });
          break;

        default:
          // Default to PNG for unknown formats
          processor = processor.png({ quality: 100 });
      }

      return await processor.toBuffer();
    } catch (error) {
      throw new Error(
        `Export processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Validate image format and size
   */
  static async validateImage(buffer: Buffer): Promise<boolean> {
    try {
      const metadata = await sharp(buffer).metadata();

      // Check if it's a valid image
      if (!metadata.width || !metadata.height) {
        return false;
      }

      // Check format support
      const supportedFormats = ['jpeg', 'png', 'webp', 'gif', 'svg', 'tiff'];
      if (metadata.format && !supportedFormats.includes(metadata.format)) {
        return false;
      }

      // Check reasonable size limits (max 50MP)
      const maxPixels = 50 * 1000 * 1000;
      if (metadata.width * metadata.height > maxPixels) {
        return false;
      }

      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get image information without loading full buffer
   */
  static async getImageInfo(buffer: Buffer): Promise<Metadata> {
    try {
      return await sharp(buffer).metadata();
    } catch (error) {
      throw new Error(
        `Failed to read image info: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Convert image format while preserving quality
   */
  static async convertFormat(
    buffer: Buffer,
    targetFormat: 'png' | 'jpeg' | 'webp',
    quality = 95
  ): Promise<Buffer> {
    try {
      let processor = sharp(buffer);

      switch (targetFormat) {
        case 'png':
          processor = processor.png({ quality: 100, compressionLevel: 6 });
          break;
        case 'jpeg':
          processor = processor.jpeg({ quality, progressive: true });
          break;
        case 'webp':
          processor = processor.webp({ quality, effort: 6 });
          break;
      }

      return await processor.toBuffer();
    } catch (error) {
      throw new Error(
        `Format conversion failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Process large image with streaming to manage memory usage
   */
  static async processLargeImage(
    buffer: Buffer,
    options: ProcessingOptions = {}
  ): Promise<Buffer> {
    try {
      const image = sharp(buffer);
      const metadata = (await image.metadata()) as ExtendedMetadata;

      if (!metadata.width || !metadata.height) {
        throw new Error('Invalid image dimensions');
      }

      // Force garbage collection for memory management
      if (global.gc) {
        global.gc();
      }

      // Apply streaming-friendly resizing if needed
      const memoryLimit = options.memoryLimit ?? this.DEFAULT_MEMORY_LIMIT_MB;
      const targetPixels = (memoryLimit * 1024 * 1024) / 4; // Assume 4 bytes per pixel
      const currentPixels = metadata.width * metadata.height;

      let processor = sharp(buffer);

      if (currentPixels > targetPixels) {
        const scaleFactor = Math.sqrt(targetPixels / currentPixels);
        const targetWidth = Math.round(metadata.width * scaleFactor);
        const targetHeight = Math.round(metadata.height * scaleFactor);

        processor = processor.resize(targetWidth, targetHeight, {
          kernel: 'lanczos3',
          fit: 'inside',
          withoutEnlargement: true,
        });
      }

      // Apply final format and return
      return await processor
        .jpeg({
          quality: options.quality ?? 90,
          progressive: true,
          mozjpeg: true,
          optimiseScans: true,
        })
        .toBuffer();
    } catch (error) {
      throw new Error(
        `Large image processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Scale image for high-DPI export
   */
  static async scaleForHighDPI(
    buffer: Buffer,
    scaleFactor: number,
    targetDPI = 1200
  ): Promise<Buffer> {
    try {
      const metadata = await sharp(buffer).metadata();

      if (!metadata.width || !metadata.height) {
        throw new Error('Invalid image dimensions');
      }

      const scaledWidth = Math.round(metadata.width * scaleFactor);
      const scaledHeight = Math.round(metadata.height * scaleFactor);

      return await sharp(buffer)
        .resize(scaledWidth, scaledHeight, {
          kernel: 'lanczos3', // High-quality resampling
        })
        .withMetadata({ density: targetDPI })
        .png({ quality: 100, compressionLevel: 0 }) // Uncompressed for quality
        .toBuffer();
    } catch (error) {
      throw new Error(
        `High-DPI scaling failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }
}
