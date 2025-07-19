/**
 * Modern Development Tools Service
 * Provides enhanced development tools integration without external dependencies
 * Uses Electron's built-in extension loading for maximum reliability
 */

import { BrowserWindow, session, shell } from 'electron';
import * as path from 'path';
import * as fs from 'fs/promises';
import * as os from 'os';

interface ExtensionInfo {
  id: string;
  name: string;
  chromeWebStoreUrl?: string;
  localPath?: string;
}

export class DevToolsService {
  private static instance: DevToolsService;
  private isEnabled: boolean = false;
  private loadedExtensions: Set<string> = new Set();

  // Common development extensions
  private readonly EXTENSIONS: ExtensionInfo[] = [
    {
      id: 'fmkadmapgofadopljbjfkapdkoienihi',
      name: 'React Developer Tools',
      chromeWebStoreUrl: 'https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi',
    },
    {
      id: 'lmhkpmbekcpmknklioeibfkpmmfibljd',
      name: 'Redux DevTools',
      chromeWebStoreUrl: 'https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd',
    },
  ];

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
   * Modern approach using Electron's built-in capabilities
   */
  public async setupDevTools(window: BrowserWindow): Promise<void> {
    if (!this.isEnabled) return;

    try {
      // Load development extensions from local installation
      await this.loadLocalExtensions();

      // Setup keyboard shortcuts for development
      this.setupDevKeyboards(window);

      // Setup additional development features
      this.setupDevelopmentFeatures(window);

      // Auto-open DevTools in development if requested
      if (process.env.AUTO_OPEN_DEVTOOLS === 'true') {
        window.webContents.openDevTools();
      }

      this.logDevInfo('✅ Development tools setup completed');
    } catch (error) {
      this.logDevInfo('⚠️ Some development tools may not be available', error);
    }
  }

  /**
   * Load extensions from local Chrome/Edge installation
   * More reliable than downloading from web store
   */
  private async loadLocalExtensions(): Promise<void> {
    const extensionPaths = await this.findLocalExtensions();

    for (const extension of this.EXTENSIONS) {
      const localPath = extensionPaths.get(extension.id);

      if (localPath) {
        try {
          await session.defaultSession.loadExtension(localPath, {
            allowFileAccess: true,
          });
          this.loadedExtensions.add(extension.id);
          this.logDevInfo(`✅ Loaded ${extension.name} from local installation`);
        } catch (error) {
          this.logDevInfo(`❌ Failed to load ${extension.name}:`, error);
        }
      } else {
        this.logDevInfo(`⚠️ ${extension.name} not found in local Chrome installation`);
        this.suggestExtensionInstallation(extension);
      }
    }
  }

  /**
   * Find locally installed Chrome/Edge extensions
   */
  private async findLocalExtensions(): Promise<Map<string, string>> {
    const extensionPaths = new Map<string, string>();

    // Chrome and Edge extension directories for different platforms
    const possiblePaths = this.getExtensionDirectories();

    for (const basePath of possiblePaths) {
      try {
        const exists = await fs.access(basePath).then(() => true).catch(() => false);
        if (!exists) continue;

        const entries = await fs.readdir(basePath, { withFileTypes: true });

        for (const entry of entries) {
          if (entry.isDirectory()) {
            const extensionId = entry.name;

            // Check if this is one of our target extensions
            if (this.EXTENSIONS.some(ext => ext.id === extensionId)) {
              const extensionPath = path.join(basePath, extensionId);

              // Find the latest version directory
              const latestVersion = await this.findLatestExtensionVersion(extensionPath);
              if (latestVersion) {
                extensionPaths.set(extensionId, latestVersion);
              }
            }
          }
        }
      } catch (error) {
        // Silently ignore inaccessible directories
      }
    }

    return extensionPaths;
  }

  /**
   * Get platform-specific extension directories
   */
  private getExtensionDirectories(): string[] {
    const homeDir = os.homedir();
    const platform = os.platform();

    const paths: string[] = [];

    if (platform === 'darwin') {
      // macOS
      paths.push(
        path.join(homeDir, 'Library/Application Support/Google/Chrome/Default/Extensions'),
        path.join(homeDir, 'Library/Application Support/Microsoft Edge/Default/Extensions'),
        path.join(homeDir, 'Library/Application Support/Google/Chrome/Profile 1/Extensions'),
      );
    } else if (platform === 'win32') {
      // Windows
      const appData = process.env.LOCALAPPDATA ?? path.join(homeDir, 'AppData', 'Local');
      paths.push(
        path.join(appData, 'Google/Chrome/User Data/Default/Extensions'),
        path.join(appData, 'Microsoft/Edge/User Data/Default/Extensions'),
      );
    } else {
      // Linux
      paths.push(
        path.join(homeDir, '.config/google-chrome/Default/Extensions'),
        path.join(homeDir, '.config/microsoft-edge/Default/Extensions'),
        path.join(homeDir, '.config/chromium/Default/Extensions'),
      );
    }

    return paths;
  }

  /**
   * Find the latest version of an extension
   */
  private async findLatestExtensionVersion(extensionPath: string): Promise<string | null> {
    try {
      const versions = await fs.readdir(extensionPath, { withFileTypes: true });
      const versionDirs = versions
        .filter(entry => entry.isDirectory())
        .map(entry => entry.name)
        .sort((a, b) => b.localeCompare(a, undefined, { numeric: true }));

      for (const version of versionDirs) {
        const fullPath = path.join(extensionPath, version);
        const manifestPath = path.join(fullPath, 'manifest.json');

        try {
          await fs.access(manifestPath);
          return fullPath;
        } catch {
          continue;
        }
      }
    } catch {
      // Extension directory doesn't exist or is inaccessible
    }

    return null;
  }

  /**
   * Setup development keyboard shortcuts with enhanced functionality
   */
  private setupDevKeyboards(window: BrowserWindow): void {
    window.webContents.on('before-input-event', (_event, input) => {
      // Toggle DevTools with F12 or Cmd+Option+I
      if (input.key === 'F12' || (input.key === 'I' && input.meta && input.alt)) {
        this.toggleDevTools(window);
      }

      // Force reload with Cmd+R or Ctrl+R
      if (input.key === 'R' && (input.meta || input.control) && !input.shift) {
        this.logDevInfo('🔄 Reloading application...');
        window.webContents.reload();
      }

      // Force hard reload with Cmd+Shift+R or Ctrl+Shift+R
      if (input.key === 'R' && (input.meta || input.control) && input.shift) {
        this.logDevInfo('🔄 Hard reloading application...');
        window.webContents.reloadIgnoringCache();
      }

      // Open DevTools in detached mode with Cmd+Shift+I or Ctrl+Shift+I
      if (input.key === 'I' && (input.meta || input.control) && input.shift) {
        this.openDevToolsDetached(window);
      }

      // Clear cache and reload with Cmd+Shift+Delete or Ctrl+Shift+Delete
      if (input.key === 'Delete' && (input.meta || input.control) && input.shift) {
        void this.clearCacheAndReload(window);
      }
    });
  }

  /**
   * Setup additional development features
   */
  private setupDevelopmentFeatures(window: BrowserWindow): void {
    // Enable web security bypass in development
    if (this.isEnabled) {
      window.webContents.session.webRequest.onHeadersReceived((details, callback) => {
        callback({
          responseHeaders: {
            ...details.responseHeaders,
            'Content-Security-Policy': [
              'script-src \'self\' \'unsafe-inline\' \'unsafe-eval\' data:',
            ],
          },
        });
      });
    }

    // Setup console message forwarding
    window.webContents.on('console-message', (_event, level, message, line) => {
      if (this.isEnabled) {
        const logLevels = ['log', 'info', 'warn', 'error'];
        const logLevel = logLevels[level] ?? 'log';
        // eslint-disable-next-line no-console
        console[logLevel as keyof Console](`[Renderer:${line}] ${message}`);
      }
    });

    // Setup crash reporter for development
    window.webContents.on('crashed', (_event, killed) => {
      this.logDevInfo(`💥 Renderer process ${killed ? 'was killed' : 'crashed'}`);
    });

    window.webContents.on('unresponsive', () => {
      this.logDevInfo('⏰ Renderer process became unresponsive');
    });

    window.webContents.on('responsive', () => {
      this.logDevInfo('✅ Renderer process became responsive again');
    });
  }

  /**
   * Toggle DevTools programmatically
   */
  public toggleDevTools(window: BrowserWindow): void {
    if (!this.isEnabled) return;

    if (window.webContents.isDevToolsOpened()) {
      window.webContents.closeDevTools();
      this.logDevInfo('🔧 DevTools closed');
    } else {
      window.webContents.openDevTools();
      this.logDevInfo('🔧 DevTools opened');
    }
  }

  /**
   * Open DevTools in detached mode
   */
  public openDevToolsDetached(window: BrowserWindow): void {
    if (!this.isEnabled) return;

    window.webContents.openDevTools({ mode: 'detach' });
    this.logDevInfo('🔧 DevTools opened in detached mode');
  }

  /**
   * Clear cache and reload
   */
  public async clearCacheAndReload(window: BrowserWindow): Promise<void> {
    if (!this.isEnabled) return;

    try {
      await window.webContents.session.clearCache();
      await window.webContents.session.clearStorageData();
      window.webContents.reloadIgnoringCache();
      this.logDevInfo('🧹 Cache cleared and application reloaded');
    } catch (error) {
      this.logDevInfo('❌ Failed to clear cache:', error);
    }
  }

  /**
   * Suggest extension installation to user
   */
  private suggestExtensionInstallation(extension: ExtensionInfo): void {
    if (extension.chromeWebStoreUrl) {
      this.logDevInfo(
        `💡 To use ${extension.name}, install it in Chrome/Edge: ${extension.chromeWebStoreUrl}`,
      );
    }
  }

  /**
   * Open extension in Chrome Web Store
   */
  public async openExtensionInStore(extensionId: string): Promise<void> {
    const extension = this.EXTENSIONS.find(ext => ext.id === extensionId);
    if (extension?.chromeWebStoreUrl) {
      await shell.openExternal(extension.chromeWebStoreUrl);
      this.logDevInfo(`🌐 Opened ${extension.name} in Chrome Web Store`);
    }
  }

  /**
   * Get loaded extensions info
   */
  public getLoadedExtensions(): string[] {
    return Array.from(this.loadedExtensions);
  }

  /**
   * Check if development tools are enabled
   */
  public isDevToolsEnabled(): boolean {
    return this.isEnabled;
  }

  /**
   * Enhanced development logging with timestamps
   */
  public logDevInfo(message: string, data?: unknown): void {
    if (!this.isEnabled) return;

    const timestamp = new Date().toISOString().substr(11, 12);
    // eslint-disable-next-line no-console
    console.log(`🔧 [${timestamp}] ${message}`, data || '');
  }

  /**
   * Get development environment info
   */
  public getDevEnvironmentInfo(): Record<string, unknown> {
    return {
      nodeVersion: process.version,
      electronVersion: process.versions.electron,
      chromeVersion: process.versions.chrome,
      platform: os.platform(),
      arch: os.arch(),
      loadedExtensions: this.getLoadedExtensions(),
      devToolsEnabled: this.isEnabled,
    };
  }

  /**
   * Clean up resources
   */
  public dispose(): void {
    this.loadedExtensions.clear();
    this.logDevInfo('🧹 DevTools service disposed');
  }
}
