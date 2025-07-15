import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
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
      if (process.platform !== 'darwin') {
        app.quit();
      }
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
  }
}

// Start the application
new CutEditorApp();
