import { app, BrowserWindow, dialog, ipcMain } from 'electron';
import * as path from 'path';
import * as fs from 'fs/promises';
import { APP_CONFIG, IPC_CHANNELS } from '@shared/constants';
import { DevToolsService } from './services/devTools';

class CutEditorApp {
  private mainWindow: BrowserWindow | null = null;
  private isDevelopment = process.env.NODE_ENV !== 'production';
  private devToolsService = DevToolsService.getInstance();

  constructor() {
    // 앱 보안 관련 설정을 먼저 적용합니다.
    this.setupAppSecurity();

    // 앱이 중복 실행되는 것을 방지합니다.
    if (!app.requestSingleInstanceLock()) {
      app.quit();
      return;
    }

    // 두 번째 인스턴스가 실행될 때 기존 창을 활성화합니다.
    app.on('second-instance', () => {
      if (this.mainWindow) {
        if (this.mainWindow.isMinimized()) {
          this.mainWindow.restore();
        }
        this.mainWindow.focus();
      }
    });

    // 나머지 이벤트 핸들러들을 설정합니다.
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
      void this.createMainWindow();
    });

    app.on('window-all-closed', () => {
      if (process.platform !== 'darwin') {
        app.quit();
      }
    });

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        void this.createMainWindow();
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

  private async createMainWindow(): Promise<void> {
    // eslint-disable-next-line no-console
    console.log('🛠️  Creating main window...');
    // eslint-disable-next-line no-console
    console.log('🔧 Development mode:', this.isDevelopment);
    // eslint-disable-next-line no-console
    console.log('🔧 Node environment:', process.env.NODE_ENV);

    this.mainWindow = new BrowserWindow({
      width: 1200,
      height: 800,
      show: true, // 즉시 표시
      webPreferences: {
        preload: path.join(__dirname, '../preload/index.js'),
        contextIsolation: true,
        nodeIntegration: false,
        webSecurity: !this.isDevelopment, // 개발 모드에서 webSecurity 비활성화
        allowRunningInsecureContent: this.isDevelopment,
      },
    });

    // DISABLE CSP temporarily for debugging
    // this.mainWindow.webContents.session.webRequest.onHeadersReceived((_, callback) => {
    //   callback({
    //     responseHeaders: {
    //       'Content-Security-Policy': [
    //         "default-src 'self' 'unsafe-inline' 'unsafe-eval' data: blob: http://localhost:3000 ws://localhost:3000;" +
    //           "script-src 'self' 'unsafe-inline' 'unsafe-eval' http://localhost:3000;" +
    //           "style-src 'self' 'unsafe-inline' http://localhost:3000;" +
    //           "connect-src 'self' http://localhost:3000 ws://localhost:3000;",
    //       ],
    //     },
    //   });
    // });

    // UNIFIED SOLUTION: Staged Loading Strategy
    // Stage 1: Always load built files first (prevents download popup)
    // Stage 2: Enhance with dev server in development (prevents white screen)

    const rendererIndexPath = path.join(__dirname, '../renderer/index.html');

    // eslint-disable-next-line no-console
    console.log('🚀 Stage 1: Loading built files for immediate UI');

    try {
      await this.mainWindow.loadFile(rendererIndexPath);
      // eslint-disable-next-line no-console
      console.log('✅ Built files loaded successfully');

      // Stage 2: Development enhancement (non-blocking)
      if (this.isDevelopment) {
        this.enhanceWithDevServer();
        // Setup modern development tools
        void this.devToolsService.setupDevTools(this.mainWindow);
        // Dev. tool active
        this.mainWindow?.webContents.openDevTools({ mode: 'detach' });
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('❌ Built files failed to load:', error);

      // Last resort fallback to dev server
      if (this.isDevelopment) {
        await this.loadDevServerFallback();
      }
    }

    // Enhanced debugging for renderer process
    this.mainWindow.webContents.on('console-message', (_, level, message) => {
      // eslint-disable-next-line no-console
      console.log(`📱 RENDERER [${level}]:`, message);
    });

    this.mainWindow.webContents.on('dom-ready', () => {
      // eslint-disable-next-line no-console
      console.log('🏗️  DOM is ready - HTML parsed and loaded');

      // Check if scripts are loading
      this.mainWindow.webContents.executeJavaScript(`
        console.log('🔍 Checking script loading...');
        console.log('📄 Document ready state:', document.readyState);
        console.log('🎯 Root element:', document.getElementById('root'));
        console.log('📝 All scripts:', document.scripts.length);
        for(let i = 0; i < document.scripts.length; i++) {
          console.log('📜 Script', i, ':', document.scripts[i].src || 'inline');
        }
      `).catch(err => console.error('Script execution failed:', err));
    });

    // Show window when ready to prevent download popup
    this.mainWindow.webContents.once('did-finish-load', () => {
      if (this.mainWindow) {
        this.mainWindow.show();
        // eslint-disable-next-line no-console
        console.log('🎉 Window displayed after successful load');
      }
    });

    // DEBUGGING: Force show window after timeout as fallback
    setTimeout(() => {
      if (this.mainWindow && !this.mainWindow.isVisible()) {
        // eslint-disable-next-line no-console
        console.log('⚠️  DEBUGGING: Force showing window after 3 seconds');
        this.mainWindow.show();
      }
    }, 3000);

    // Handle loading failures
    this.mainWindow.webContents.on('did-fail-load', (_, errorCode, errorDescription) => {
      // eslint-disable-next-line no-console
      console.error('❌ Page failed to load:', errorCode, errorDescription);
      if (this.mainWindow) {
        this.mainWindow.show(); // Show window anyway to prevent hanging
      }
    });

    this.mainWindow.on('closed', () => {
      this.mainWindow = null;
    });
  }

  private enhanceWithDevServer(): void {
    // Non-blocking dev server connection for development features
    // eslint-disable-next-line no-console
    console.log('🔄 Stage 2: Checking dev server availability...');

    setTimeout(() => {
      void (async () => {
        try {
          const response = await fetch('http://localhost:3000');
          if (response.ok && response.status === 200) {
            // eslint-disable-next-line no-console
            console.log('🎯 Dev server ready and responding properly');
            // DO NOT transition to dev server automatically - this causes download popup
            // Instead, just log that it's available for manual refresh if needed
            // eslint-disable-next-line no-console
            console.log(
              'ℹ️  Dev server available at http://localhost:3000 (manual refresh if needed)',
            );
          }
        } catch (error) {
          // eslint-disable-next-line no-console
          console.log('ℹ️  Dev server not available, continuing with built files');
        }
      })();
    }, 1000); // Allow built files to render first
  }

  private async loadDevServerFallback(): Promise<void> {
    // eslint-disable-next-line no-console
    console.log('⚠️  Fallback: Checking dev server before attempting connection');

    try {
      // First, verify dev server is actually responding
      const response = await fetch('http://localhost:3000');
      if (response.ok && response.status === 200) {
        // eslint-disable-next-line no-console
        console.log('✅ Dev server verified and available');
        // REMOVED: loadURL causes download popup - user can manually refresh if needed
        // eslint-disable-next-line no-console
        console.log('ℹ️  Built files continue to be used (prevents download popup)');
      } else {
        throw new Error(`Dev server responded with status: ${response.status}`);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('❌ Dev server fallback failed:', error);
      // eslint-disable-next-line no-console
      console.log('❌ All loading methods failed - showing window with built files');

      // Show window anyway to prevent hanging
      if (this.mainWindow) {
        this.mainWindow.show();
      }
    }
  }

  private handleProcessCrash(): void {
    // eslint-disable-next-line no-console
    console.log('Handling process crash - attempting recovery');

    // 현재 창이 있다면 새로고침 시도
    if (this.mainWindow && !this.mainWindow.isDestroyed()) {
      this.mainWindow.webContents.reload();
    } else {
      // 창이 없다면 새로 생성
      void this.createMainWindow();
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
      void this.createMainWindow();
    }
  }

  private setupIpcHandlers(): void {
    // App configuration
    ipcMain.handle(IPC_CHANNELS.APP_CONFIG, () => ({
      isDevelopment: this.isDevelopment,
      appName: APP_CONFIG.APP_NAME,
      appVersion: APP_CONFIG.APP_VERSION,
    }));

    // Window controls
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
