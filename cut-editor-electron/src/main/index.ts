import { app, BrowserWindow, dialog, ipcMain } from 'electron';
import * as path from 'path';
import * as fs from 'fs/promises';
import { APP_CONFIG, IPC_CHANNELS } from '@shared/constants';
import { WindowSettings } from '@shared/types';

// Enhanced development reload system
import { devReloadManager } from './utils/devReload';
import { DevToolsService } from './services/devTools';

// Initialize enhanced dev reload
devReloadManager.init({
  hardResetMethod: 'exit',
  watchRendererSrc: true,
  ignore: [
    /node_modules/,
    /\.git/,
    /dist\/renderer/,
    /coverage/,
    /\.DS_Store/,
    /\.env/,
    /\.log$/,
  ],
});

class CutEditorApp {
  private mainWindow: BrowserWindow | null = null;
  private isDevelopment = process.env.NODE_ENV === 'development';

  constructor() {
    this.setupAppSecurity();
    this.setupEventHandlers();
  }

  private setupAppSecurity(): void {
    // 앱이 준비되기 전에 보안 설정
    app.commandLine.appendSwitch('--disable-features', 'VizDisplayCompositor');
    app.commandLine.appendSwitch('--disable-background-timer-throttling');
    app.commandLine.appendSwitch('--disable-backgrounding-occluded-windows');
    app.commandLine.appendSwitch('--disable-renderer-backgrounding');

    // 메모리 사용량 최적화
    app.commandLine.appendSwitch('--max-old-space-size', '4096');
    app.commandLine.appendSwitch('--js-flags', '--max-old-space-size=4096');
  }

  private setupEventHandlers(): void {
    void app.whenReady().then(() => {
      this.createMainWindow();
    });

    app.on('window-all-closed', () => {
      if (process.platform !== 'darwin') {
        app.quit();
      }
    });

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        this.createMainWindow();
      }
    });

    // 백그라운드 프로세스 충돌 처리
    app.on('child-process-gone', (_, details) => {
      // eslint-disable-next-line no-console
      console.error('Child process gone:', details);
      if (details.type === 'Utility' && details.reason === 'crashed') {
        // 유틸리티 프로세스가 충돌한 경우 앱 재시작
        this.handleProcessCrash();
      }
    });

    // GPU 프로세스 충돌 처리
    app.on('gpu-process-crashed', (_, killed) => {
      // eslint-disable-next-line no-console
      console.error('GPU process crashed:', { killed });
      this.handleProcessCrash();
    });

    // 렌더러 프로세스 충돌 처리
    app.on('render-process-gone', (_, __, details) => {
      // eslint-disable-next-line no-console
      console.error('Renderer process gone:', details);
      if (details.reason === 'crashed' || details.reason === 'oom') {
        this.handleRendererCrash();
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
        sandbox: false,
        webSecurity: true,
        allowRunningInsecureContent: false,
        experimentalFeatures: false,
        backgroundThrottling: false,
      },
      titleBarStyle: 'default',
      show: false,
      ...(this.isDevelopment ? {} : { icon: path.join(__dirname, '../../assets/icon.png') }),
    });

    // Setup development tools
    const devTools = DevToolsService.getInstance();
    devTools.setupDevTools(this.mainWindow);

    // Load the renderer
    if (this.isDevelopment) {
      void this.mainWindow.loadURL('http://localhost:3000');

      // Auto-open DevTools based on environment variable
      if (process.env.AUTO_OPEN_DEVTOOLS !== 'false') {
        this.mainWindow.webContents.openDevTools();
      }

      devTools.logDevInfo('Development mode: Hot reload enabled');
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

  private handleProcessCrash(): void {
    // eslint-disable-next-line no-console
    console.log('Handling process crash - attempting recovery');

    // 현재 창이 있다면 새로고침 시도
    if (this.mainWindow && !this.mainWindow.isDestroyed()) {
      this.mainWindow.webContents.reload();
    } else {
      // 창이 없다면 새로 생성
      this.createMainWindow();
    }
  }

  private handleRendererCrash(): void {
    // eslint-disable-next-line no-console
    console.log('Handling renderer crash - reloading window');

    if (this.mainWindow && !this.mainWindow.isDestroyed()) {
      // 렌더러 프로세스만 재시작
      this.mainWindow.webContents.reload();
    } else {
      // 창 자체가 파괴되었다면 새로 생성
      this.createMainWindow();
    }
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
