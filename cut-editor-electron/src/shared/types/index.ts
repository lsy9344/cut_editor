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

export interface ImageFile {
  name: string;
  path: string;
  data: string;
  size: number;
}

export interface FrameSlot {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  aspectRatio?: number;
}

export interface FrameTemplate {
  id: string;
  name: string;
  description: string;
  slots: FrameSlot[];
  orientation: 'horizontal' | 'vertical';
  canvasWidth: number;
  canvasHeight: number;
  thumbnail?: string;
}

export interface TextStyle {
  fontFamily: string;
  fontSize: number;
  color: string;
  textAlign: 'left' | 'center' | 'right';
  fontWeight: 'normal' | 'bold';
  fontStyle: 'normal' | 'italic';
}

export interface TextData {
  id: string;
  text: string;
  x: number;
  y: number;
  style: TextStyle;
}

export interface FrameData {
  template: FrameTemplate;
  images: { [slotId: string]: ImageFile };
  texts: { [slotId: string]: TextData };
}

export type FrameType = '2-frame' | '4-frame' | '6-frame' | '9-frame';
