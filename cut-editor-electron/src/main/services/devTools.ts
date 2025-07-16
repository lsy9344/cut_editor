/**
 * Development Tools Service
 * Provides enhanced development tools integration
 */

import { BrowserWindow } from 'electron';

export class DevToolsService {
  private static instance: DevToolsService;
  private isEnabled: boolean = false;

  private constructor() {
    this.isEnabled = process.env.NODE_ENV === 'development';
  }

  public static getInstance(): DevToolsService {
    if (!DevToolsService.instance) {
      DevToolsService.instance = new DevToolsService();
    }
    return DevToolsService.instance;
  }

  /**
   * Setup development tools for main window
   */
  public setupDevTools(window: BrowserWindow): void {
    if (!this.isEnabled) return;

    // Install React DevTools extension
    this.installReactDevTools();

    // Setup keyboard shortcuts for development
    this.setupDevKeyboards(window);

    // Auto-open DevTools in development
    if (process.env.AUTO_OPEN_DEVTOOLS === 'true') {
      window.webContents.openDevTools();
    }
  }

  /**
   * Install React DevTools extension
   */
  private installReactDevTools(): void {
    try {
      // Try to install React DevTools
      /* eslint-disable @typescript-eslint/no-require-imports */
      /* eslint-disable @typescript-eslint/no-var-requires */
      /* eslint-disable @typescript-eslint/no-unsafe-assignment */
      const {
        default: installExtension,
        REACT_DEVELOPER_TOOLS,
      } = require('electron-devtools-installer');

      /* eslint-disable @typescript-eslint/no-unsafe-call */
      /* eslint-disable @typescript-eslint/no-unsafe-member-access */
      installExtension([REACT_DEVELOPER_TOOLS])
        .then((name: string) => {
          // eslint-disable-next-line no-console
          console.log(`✅ Added Extension: ${name}`);
        })
        .catch((err: Error) => {
          // eslint-disable-next-line no-console
          console.log('❌ Failed to install React DevTools:', err);
        });
      /* eslint-enable @typescript-eslint/no-unsafe-call */
      /* eslint-enable @typescript-eslint/no-unsafe-member-access */
      /* eslint-enable @typescript-eslint/no-unsafe-assignment */
      /* eslint-enable @typescript-eslint/no-var-requires */
      /* eslint-enable @typescript-eslint/no-require-imports */
    } catch (error) {
      // Extension installer not available
      // eslint-disable-next-line no-console
      console.log('⚠️  React DevTools installer not available');
    }
  }

  /**
   * Setup development keyboard shortcuts
   */
  private setupDevKeyboards(window: BrowserWindow): void {
    window.webContents.on('before-input-event', (_event, input) => {
      // Toggle DevTools with F12 or Cmd+Option+I
      if (input.key === 'F12' || (input.key === 'I' && input.meta && input.alt)) {
        if (window.webContents.isDevToolsOpened()) {
          window.webContents.closeDevTools();
        } else {
          window.webContents.openDevTools();
        }
      }

      // Force reload with Cmd+R or Ctrl+R
      if (input.key === 'R' && (input.meta || input.control)) {
        window.webContents.reload();
      }

      // Force hard reload with Cmd+Shift+R or Ctrl+Shift+R
      if (input.key === 'R' && (input.meta || input.control) && input.shift) {
        window.webContents.reloadIgnoringCache();
      }
    });
  }

  /**
   * Toggle DevTools programmatically
   */
  public toggleDevTools(window: BrowserWindow): void {
    if (!this.isEnabled) return;

    if (window.webContents.isDevToolsOpened()) {
      window.webContents.closeDevTools();
    } else {
      window.webContents.openDevTools();
    }
  }

  /**
   * Open DevTools in detached mode
   */
  public openDevToolsDetached(window: BrowserWindow): void {
    if (!this.isEnabled) return;

    window.webContents.openDevTools({ mode: 'detach' });
  }

  /**
   * Check if development tools are enabled
   */
  public isDevToolsEnabled(): boolean {
    return this.isEnabled;
  }

  /**
   * Log development information
   */
  public logDevInfo(message: string, data?: unknown): void {
    if (!this.isEnabled) return;

    // eslint-disable-next-line no-console
    console.log(`🔧 [DevTools] ${message}`, data || '');
  }
}
