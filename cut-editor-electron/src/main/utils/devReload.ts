/**
 * Enhanced Development Reload System
 * Provides better hot-reload functionality for development
 */

import { app } from 'electron';
import * as path from 'path';

export interface DevReloadOptions {
  electron?: string;
  hardResetMethod?: 'exit' | 'restart';
  ignore?: (string | RegExp)[];
  watchRendererSrc?: boolean;
}

class DevReloadManager {
  private isEnabled = false;
  private options: DevReloadOptions = {};

  /**
   * Initialize electron-reload with enhanced options
   */
  public init(options: DevReloadOptions = {}): void {
    // Only enable in development
    if (app.isPackaged || process.env.NODE_ENV !== 'development') {
      return;
    }

    this.options = {
      electron: path.join(__dirname, '..', '..', 'node_modules', '.bin', 'electron'),
      hardResetMethod: 'exit',
      ignore: [
        /node_modules/,
        /\.git/,
        /dist\/renderer/,
        /coverage/,
        /\.DS_Store/,
        /\.env/,
      ],
      watchRendererSrc: true,
      ...options,
    };

    this.setupElectronReload();
    this.setupEnhancedWatching();
    this.isEnabled = true;

    // eslint-disable-next-line no-console
    console.log('🔄 Enhanced dev reload system initialized');
  }

  /**
   * Setup basic electron-reload functionality
   */
  private setupElectronReload(): void {
    try {
      /* eslint-disable @typescript-eslint/no-require-imports */
      /* eslint-disable @typescript-eslint/no-unsafe-call */
      /* eslint-disable @typescript-eslint/no-var-requires */
      require('electron-reload')(__dirname, {
        electron: this.options.electron,
        hardResetMethod: this.options.hardResetMethod,
        ignore: this.options.ignore,
      });
      /* eslint-enable @typescript-eslint/no-require-imports */
      /* eslint-enable @typescript-eslint/no-unsafe-call */
      /* eslint-enable @typescript-eslint/no-var-requires */
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn('⚠️  electron-reload not available:', error);
    }
  }

  /**
   * Setup enhanced file watching for better development experience
   */
  private setupEnhancedWatching(): void {
    if (!this.options.watchRendererSrc) return;

    try {
      /* eslint-disable @typescript-eslint/no-require-imports */
      /* eslint-disable @typescript-eslint/no-var-requires */
      /* eslint-disable @typescript-eslint/no-unsafe-assignment */
      const chokidar = require('chokidar');

      // Watch renderer source files for changes
      const rendererSrcPath = path.join(__dirname, '..', '..', 'src', 'renderer');

      /* eslint-disable @typescript-eslint/no-unsafe-call */
      /* eslint-disable @typescript-eslint/no-unsafe-member-access */
      const watcher = chokidar.watch(rendererSrcPath, {
        ignored: this.options.ignore,
        ignoreInitial: true,
        persistent: true,
      });

      watcher.on('change', (filePath: string) => {
        // eslint-disable-next-line no-console
        console.log(`📝 File changed: ${path.relative(process.cwd(), filePath)}`);
      });

      watcher.on('error', (error: Error) => {
        // eslint-disable-next-line no-console
        console.error('❌ File watcher error:', error);
      });

      /* eslint-enable @typescript-eslint/no-unsafe-call */
      /* eslint-enable @typescript-eslint/no-unsafe-member-access */
      /* eslint-enable @typescript-eslint/no-unsafe-assignment */
      /* eslint-enable @typescript-eslint/no-var-requires */
      /* eslint-enable @typescript-eslint/no-require-imports */
    } catch (error) {
      // Chokidar not available, fallback to basic watching
      // eslint-disable-next-line no-console
      console.warn('⚠️  Enhanced file watching not available:', error);
    }
  }

  /**
   * Get reload status
   */
  public getStatus(): { enabled: boolean; options: DevReloadOptions } {
    return {
      enabled: this.isEnabled,
      options: this.options,
    };
  }

  /**
   * Force reload the application
   */
  public forceReload(): void {
    if (!this.isEnabled) return;

    // eslint-disable-next-line no-console
    console.log('🔄 Force reloading application...');

    if (this.options.hardResetMethod === 'restart') {
      app.relaunch();
      app.exit();
    } else {
      app.exit();
    }
  }
}

export const devReloadManager = new DevReloadManager();
