

import { app, BrowserWindow, dialog, ipcMain } from 'electron';
import * as path from 'path';
import * as fs from 'fs/promises';
import { APP_CONFIG, IPC_CHANNELS } from '@shared/constants';
import { WindowSettings } from '@shared/types';

class CutEditorApp {
  private mainWindow: BrowserWindow | null = null;
  private isDevelopment = !app.isPackaged;

  constructor() {
    this.setupEventHandlers();
  }

  private setupEventHandlers(): void {
    void app.whenReady().then(() => {
      this.createMainWindow();
    });

    app.on('window-all-closed', () => {
      app.quit();
    });

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        this.createMainWindow();
      }
    });

    this.setupIpcHandlers();
  }

  private createMainWindow(): void {
    const windowSettings: WindowSettings = {
      width: APP_CONFIG.WINDOW_DEFAULT_WIDTH,
      height: APP_CONFIG.WINDOW_DEFAULT_HEIGHT,
      minWidth: APP_CONFIG.WINDOW_MIN_WIDTH,
      minHeight: APP_CONFIG.WINDOW_MIN_HEIGHT,
      resizable: true,
      maximizable: true,
      minimizable: true,
      closable: true,
    };

    this.mainWindow = new BrowserWindow({
      ...windowSettings,
      webPreferences: {
        contextIsolation: true,
        nodeIntegration: false,
        preload: path.join(__dirname, '../preload/index.js'),
      },
      titleBarStyle: 'default',
      show: false,
      ...(this.isDevelopment ? {} : { icon: path.join(__dirname, '../../assets/icon.png') }),
    });

    // Load the renderer
    if (this.isDevelopment) {
      void this.mainWindow.loadURL('http://localhost:3000');
      this.mainWindow.webContents.openDevTools();
    } else {
      void this.mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
    }

    // Show window when ready
    this.mainWindow.once('ready-to-show', () => {
      this.mainWindow?.show();
      this.mainWindow?.focus();
    });

    // Handle window closed
    this.mainWindow.on('closed', () => {
      this.mainWindow = null;
    });
  }

  private setupIpcHandlers(): void {
    // Window controls
    ipcMain.handle(IPC_CHANNELS.WINDOW_READY, () => ({
      isDevelopment: this.isDevelopment,
      appName: APP_CONFIG.APP_NAME,
      appVersion: APP_CONFIG.APP_VERSION,
    }));

    ipcMain.handle(IPC_CHANNELS.WINDOW_CLOSE, () => {
      this.mainWindow?.close();
    });

    ipcMain.handle(IPC_CHANNELS.WINDOW_MINIMIZE, () => {
      this.mainWindow?.minimize();
    });

    ipcMain.handle(IPC_CHANNELS.WINDOW_MAXIMIZE, () => {
      if (this.mainWindow?.isMaximized()) {
        this.mainWindow.unmaximize();
      } else {
        this.mainWindow?.maximize();
      }
    });

    // File operations
    ipcMain.handle(IPC_CHANNELS.FILE_OPEN, async () => {
      if (!this.mainWindow) return null;

      const result = await dialog.showOpenDialog(this.mainWindow, {
        title: 'Select Image Files',
        filters: [
          {
            name: 'Images',
            extensions: ['jpg', 'jpeg', 'png', 'webp', 'bmp', 'tiff'],
          },
          { name: 'All Files', extensions: ['*'] },
        ],
        properties: ['openFile', 'multiSelections'],
      });

      if (result.canceled || result.filePaths.length === 0) {
        return null;
      }

      try {
        const fileData = await Promise.all(
          result.filePaths.map(async filePath => {
            const buffer = await fs.readFile(filePath);
            const base64 = buffer.toString('base64');
            const fileName = path.basename(filePath);
            const mimeType = this.getMimeType(path.extname(filePath));

            return {
              name: fileName,
              path: filePath,
              data: `data:${mimeType};base64,${base64}`,
              size: buffer.length,
            };
          }),
        );

        return fileData;
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error reading files:', error);
        throw new Error('Failed to read selected files');
      }
    });

    ipcMain.handle(IPC_CHANNELS.FILE_SAVE, async (_, data) => {
      if (!this.mainWindow) return null;

      const result = await dialog.showSaveDialog(this.mainWindow, {
        title: 'Save File',
        defaultPath: 'untitled.png',
        filters: [
          { name: 'PNG Files', extensions: ['png'] },
          { name: 'JPEG Files', extensions: ['jpg', 'jpeg'] },
          { name: 'WebP Files', extensions: ['webp'] },
        ],
      });

      if (result.canceled || !result.filePath) {
        return null;
      }

      try {
        await fs.writeFile(result.filePath, data);
        return result.filePath;
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error saving file:', error);
        throw new Error('Failed to save file');
      }
    });

    ipcMain.handle(IPC_CHANNELS.IMAGE_EXPORT, async (_, imageData) => {
      if (!this.mainWindow) return null;

      const result = await dialog.showSaveDialog(this.mainWindow, {
        title: 'Export Image',
        defaultPath: 'exported-image.png',
        filters: [
          { name: 'PNG Files', extensions: ['png'] },
          { name: 'JPEG Files', extensions: ['jpg', 'jpeg'] },
          { name: 'WebP Files', extensions: ['webp'] },
        ],
      });

      if (result.canceled || !result.filePath) {
        return null;
      }

      try {
        // Handle base64 data URL
        let buffer: Buffer;
        if (typeof imageData === 'string' && imageData.startsWith('data:')) {
          const base64Data = imageData.split(',')[1];
          if (!base64Data) {
            throw new Error('Invalid base64 data URL');
          }
          buffer = Buffer.from(base64Data, 'base64');
        } else {
          buffer = Buffer.from(imageData as ArrayBufferLike);
        }

        await fs.writeFile(result.filePath, buffer);
        return result.filePath;
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error exporting image:', error);
        throw new Error('Failed to export image');
      }
    });
  }

  private getMimeType(extension: string): string {
    const mimeTypes: Record<string, string> = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.webp': 'image/webp',
      '.bmp': 'image/bmp',
      '.tiff': 'image/tiff',
      '.tif': 'image/tiff',
    };

    return mimeTypes[extension.toLowerCase()] ?? 'application/octet-stream';
  }
}

// Start the application
new CutEditorApp();
