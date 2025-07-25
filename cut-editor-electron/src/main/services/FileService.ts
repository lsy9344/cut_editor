/**
 * Cut Editor - File Service
 * Handles file dialogs, validation, and I/O operations in the main process
 */

import { dialog, BrowserWindow } from 'electron';
import { readFile, writeFile } from 'fs/promises';
import { extname, basename } from 'path';
import {
  FileFilter,
  ImageData,
  ExportData,
  FontData,
} from '../../shared/types';
import { ImageProcessingService } from './ImageProcessingService';

export class FileService {
  /**
   * Show file selection dialog
   */
  static async selectFile(filters: FileFilter[]): Promise<string | null> {
    try {
      const mainWindow = BrowserWindow.getFocusedWindow();
      if (!mainWindow) {
        throw new Error('No active window found');
      }

      const result = await dialog.showOpenDialog(mainWindow, {
        properties: ['openFile'],
        filters: filters.map(filter => ({
          name: filter.name,
          extensions: filter.extensions,
        })),
      });

      if (result.canceled || result.filePaths.length === 0) {
        return null;
      }

      const filePath = result.filePaths[0];
      if (!filePath) {
        return null;
      }

      // Validate file path
      if (!this.isValidFilePath(filePath)) {
        throw new Error('Invalid file path selected');
      }

      // Validate file extension
      const extension = extname(filePath).toLowerCase().substring(1);
      const allowedExtensions = filters.flatMap(filter => filter.extensions);

      if (!allowedExtensions.includes(extension)) {
        throw new Error(`File type .${extension} is not supported`);
      }

      return filePath;
    } catch (error) {
      throw new Error(
        `File selection failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Show save file dialog
   */
  static async selectSaveLocation(
    defaultName: string,
    filters: FileFilter[]
  ): Promise<string | null> {
    try {
      const mainWindow = BrowserWindow.getFocusedWindow();
      if (!mainWindow) {
        throw new Error('No active window found');
      }

      const result = await dialog.showSaveDialog(mainWindow, {
        defaultPath: defaultName,
        filters: filters.map(filter => ({
          name: filter.name,
          extensions: filter.extensions,
        })),
      });

      if (result.canceled || !result.filePath) {
        return null;
      }

      const filePath = result.filePath;
      if (!filePath) {
        return null;
      }

      // Validate file path
      if (!this.isValidFilePath(filePath)) {
        throw new Error('Invalid save path selected');
      }

      return filePath;
    } catch (error) {
      throw new Error(
        `Save location selection failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Load image file and return image data
   */
  static async loadImage(filePath: string): Promise<ImageData> {
    try {
      // Validate file path and extension
      if (!this.isValidFilePath(filePath)) {
        throw new Error('Invalid file path');
      }

      const extension = extname(filePath).toLowerCase();
      const supportedImageFormats = [
        '.png',
        '.jpg',
        '.jpeg',
        '.webp',
        '.bmp',
        '.gif',
      ];

      if (!supportedImageFormats.includes(extension)) {
        throw new Error(`Unsupported image format: ${extension}`);
      }

      // Read file buffer
      const buffer = await readFile(filePath);

      // Validate image format with Sharp.js
      const isValid = await ImageProcessingService.validateImage(buffer);
      if (!isValid) {
        throw new Error('Invalid or corrupted image file');
      }

      // Use Sharp.js for comprehensive image processing and metadata extraction
      // Enable streaming for large images to manage memory usage
      return await ImageProcessingService.loadImageWithMetadata(buffer, {
        streaming: true,
        memoryLimit: 512, // 512MB limit for file loading
      });
    } catch (error) {
      throw new Error(
        `Image loading failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Save image data to file
   */
  static async saveImage(data: ExportData, filePath: string): Promise<void> {
    try {
      // Validate file path
      if (!this.isValidFilePath(filePath)) {
        throw new Error('Invalid save path');
      }

      // Validate export data
      if (!data.imageBuffer || data.width <= 0 || data.height <= 0) {
        throw new Error('Invalid image data for export');
      }

      // Use Sharp.js for high-quality processing and format conversion
      const processedBuffer =
        await ImageProcessingService.processForExport(data);

      // Write processed file
      await writeFile(filePath, processedBuffer);
    } catch (error) {
      throw new Error(
        `Image save failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Load font file and return font data
   */
  static async loadFont(filePath: string): Promise<FontData> {
    try {
      // Validate file path and extension
      if (!this.isValidFilePath(filePath)) {
        throw new Error('Invalid file path');
      }

      const extension = extname(filePath).toLowerCase();
      const supportedFontFormats = ['.ttf', '.otf', '.woff', '.woff2'];

      if (!supportedFontFormats.includes(extension)) {
        throw new Error(`Unsupported font format: ${extension}`);
      }

      // Read font file
      const buffer = await readFile(filePath);
      const fileName = basename(filePath, extension);

      return {
        family: fileName,
        data: buffer.buffer.slice(
          buffer.byteOffset,
          buffer.byteOffset + buffer.byteLength
        ),
      };
    } catch (error) {
      throw new Error(
        `Font loading failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Validate file path for security
   */
  private static isValidFilePath(filePath: string): boolean {
    if (!filePath || filePath.trim().length === 0) {
      return false;
    }

    // Prevent directory traversal attacks
    const normalizedPath = filePath.replace(/\\/g, '/');
    if (normalizedPath.includes('../') || normalizedPath.includes('./')) {
      return false;
    }

    // Check for null bytes and other dangerous characters
    if (
      normalizedPath.includes('\0') ||
      normalizedPath.includes('\r') ||
      normalizedPath.includes('\n')
    ) {
      return false;
    }

    return true;
  }
}
