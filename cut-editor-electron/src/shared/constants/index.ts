export const APP_CONFIG = {
  WINDOW_DEFAULT_WIDTH: 1200,
  WINDOW_DEFAULT_HEIGHT: 800,
  WINDOW_MIN_WIDTH: 800,
  WINDOW_MIN_HEIGHT: 600,
  APP_NAME: 'Cut Editor',
  APP_VERSION: '1.0.0',
} as const;

export const IPC_CHANNELS = {
  WINDOW_READY: 'window-ready',
  APP_CONFIG: 'app-config',
  WINDOW_CLOSE: 'window-close',
  WINDOW_MINIMIZE: 'window-minimize',
  WINDOW_MAXIMIZE: 'window-maximize',
  FILE_OPEN: 'file-open',
  FILE_SAVE: 'file-save',
  IMAGE_EXPORT: 'image-export',
} as const;
