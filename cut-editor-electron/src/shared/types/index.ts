export interface WindowSettings {
  width: number;
  height: number;
  minWidth: number;
  minHeight: number;
  resizable: boolean;
  maximizable: boolean;
  minimizable: boolean;
  closable: boolean;
}

export interface AppConfig {
  isDevelopment: boolean;
  appName: string;
  appVersion: string;
}

export interface ImageSlot {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  scale: number;
  imageUrl?: string;
}
