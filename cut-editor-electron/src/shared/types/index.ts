/**
 * Cut Editor - TypeScript Type Definitions
 * Comprehensive type definitions for the entire application
 */

// Basic Utility Types
export interface Dimensions {
  width: number;
  height: number;
}

// Frame Template Types
export type FrameType =
  | 'horizontal_2'
  | 'vertical_2'
  | 'horizontal_4'
  | 'vertical_4'
  | 'horizontal_6'
  | 'vertical_6'
  | 'horizontal_9'
  | 'vertical_9';

export interface FrameTemplate {
  id: string;
  type: FrameType;
  name: string;
  slots: FrameSlot[];
  dimensions: { width: number; height: number };
}

export interface FrameSlot {
  id: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  bounds: { x: number; y: number; width: number; height: number };
}

// Image Management Types
export interface ImageSlot {
  id: string;
  slotId: string;
  image: HTMLImageElement | null;
  originalFile: File | null;
  scale: number; // Zoom level (1.0 = 100%)
  position: { x: number; y: number }; // Pan offset from center
  bounds: { width: number; height: number }; // Slot boundaries
  isSelected: boolean;
}

// Text Rendering Types
export interface TextSettings {
  content: string;
  fontSize: number;
  fontFamily: string;
  color: string;
  positions: TextPosition[];
  isItalic: boolean;
  shearAngle: number; // For italic shear effect
}

export interface TextPosition {
  id: string;
  x: number;
  y: number;
  rotation?: number;
  alignment: 'left' | 'center' | 'right';
}

// Export Configuration Types
export interface ExportSettings {
  format: 'png' | 'jpeg';
  quality: number; // 0-100 for JPEG
  dpi: number; // Target DPI (default: 1200)
  dimensions: { width: number; height: number }; // Output dimensions
  backgroundColor: string;
}

// Application State Types
export interface AppState {
  // Frame management
  currentFrame: FrameTemplate | null;
  availableFrames: FrameTemplate[];

  // Image slot management
  imageSlots: { [slotId: string]: ImageSlot };

  // Text rendering
  textSettings: TextSettings;

  // Export configuration
  exportSettings: ExportSettings;

  // UI state
  uiState: UIState;
}

export interface UIState {
  selectedSlotId: string | null;
  isLoading: boolean;
  error: string | null;
  loadingMessage: string | null;
  isExporting: boolean;
  exportProgress: number; // 0-100
}

// Action Types for State Management
export type AppAction =
  | { type: 'SELECT_FRAME'; payload: FrameTemplate }
  | {
      type: 'LOAD_IMAGE_TO_SLOT';
      payload: { slotId: string; file: File; image: HTMLImageElement };
    }
  | {
      type: 'UPDATE_IMAGE_POSITION';
      payload: { slotId: string; x: number; y: number };
    }
  | { type: 'UPDATE_IMAGE_SCALE'; payload: { slotId: string; scale: number } }
  | { type: 'SELECT_SLOT'; payload: string | null }
  | { type: 'UPDATE_TEXT_SETTINGS'; payload: Partial<TextSettings> }
  | { type: 'UPDATE_EXPORT_SETTINGS'; payload: Partial<ExportSettings> }
  | { type: 'SET_LOADING'; payload: { isLoading: boolean; message?: string } }
  | { type: 'SET_ERROR'; payload: string | null }
  | {
      type: 'SET_EXPORT_PROGRESS';
      payload: { isExporting: boolean; progress: number };
    }
  | { type: 'RESET_ALL' }
  | { type: 'RESET_SELECTED_IMAGE' };

// Component Props Types
export interface LayoutProps {
  children: React.ReactNode;
}

export interface HeaderProps {
  title: string;
  version: string;
}

export interface SidebarProps {
  children: React.ReactNode;
  className?: string;
}

export interface ImageCanvasProps {
  frame: FrameTemplate | null;
  imageSlots: { [slotId: string]: ImageSlot };
  selectedSlotId: string | null;
  onSlotClick: (slotId: string) => void;
  onImagePositionChange: (slotId: string, x: number, y: number) => void;
  onImageScaleChange: (slotId: string, scale: number) => void;
}

export interface FrameSelectorProps {
  availableFrames: FrameTemplate[];
  currentFrame: FrameTemplate | null;
  onFrameSelect: (frame: FrameTemplate) => void;
  isLoading: boolean;
}

export interface ImageUploaderProps {
  selectedSlotId: string | null;
  onImageUpload: (slotId: string, file: File) => Promise<void> | void;
  isLoading: boolean;
}

export interface TextEditorProps {
  textSettings: TextSettings;
  onTextUpdate: (settings: Partial<TextSettings>) => void;
  isLoading: boolean;
}

export interface ScaleControllerProps {
  selectedSlotId: string | null;
  currentScale: number;
  onScaleChange: (scale: number) => void;
  min: number;
  max: number;
  step: number;
}

export interface ActionButtonsProps {
  onReset: () => void;
  onResetSelected: () => void;
  onApplyText: () => void;
  onExport: () => void;
  isLoading: boolean;
  isExporting: boolean;
  exportProgress: number;
}

export interface StatusDisplayProps {
  error: string | null;
  loadingMessage: string | null;
  isLoading: boolean;
  isExporting: boolean;
  exportProgress: number;
  onClearError: () => void;
}

export interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>;
}

// Utility Types
export interface Point {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface Bounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

// File Handling Types
export interface FileInfo {
  name: string;
  size: number;
  type: string;
  lastModified: number;
}

export interface ImageInfo extends FileInfo {
  dimensions: Size;
  format: string;
}

// IPC Communication Types (for Electron main/renderer communication)
export interface IpcApi {
  selectFile: (filters: FileFilter[]) => Promise<string | null>;
  loadImage: (path: string) => Promise<ImageData>;
  saveImage: (data: ExportData, path: string) => Promise<void>;
  loadFont: (path: string) => Promise<FontData>;
}

export interface FileFilter {
  name: string;
  extensions: string[];
}

export interface ImageData {
  buffer: ArrayBuffer;
  width: number;
  height: number;
  format: string;
  // Sharp.js enhanced metadata
  originalFormat?: string;
  hasAlpha?: boolean;
  density?: number; // DPI information
  colorSpace?: string;
  channels?: number;
  depth?: string; // bit depth (e.g., 'uchar', 'short')
  isAnimated?: boolean;
  pages?: number; // for multi-page formats like TIFF
  metadata?: {
    orientation?: number;
    chromaSubsampling?: string;
    isProgressive?: boolean;
    compression?: string;
    predictor?: string;
    pyramid?: boolean;
    bitdepth?: number;
    miniswhite?: boolean;
    xmpPresent?: boolean;
    iccPresent?: boolean;
    exifPresent?: boolean;
  };
}

export interface ExportData {
  imageBuffer: ArrayBuffer;
  width: number;
  height: number;
  format: 'png' | 'jpeg' | 'webp';
  quality?: number;
  // High-resolution export metadata
  density?: number; // DPI for high-resolution export
  colorSpace?: 'srgb' | 'adobe-rgb' | 'p3';
  hasAlpha?: boolean;
  compression?: {
    level?: number; // PNG compression level (0-9)
    progressive?: boolean; // JPEG progressive encoding
    lossless?: boolean; // WebP lossless mode
  };
}

export interface FontData {
  family: string;
  data: ArrayBuffer;
}

// Constants
export { FRAME_TEMPLATES as DEFAULT_FRAME_TEMPLATES } from '../constants/frameTemplates';
export const DEFAULT_TEXT_SETTINGS: TextSettings = {
  content: '',
  fontSize: 12,
  fontFamily: 'Korean Font',
  color: '#000000',
  positions: [],
  isItalic: false,
  shearAngle: 0.2, // Default italic shear
};

export const DEFAULT_EXPORT_SETTINGS: ExportSettings = {
  format: 'png',
  quality: 95,
  dpi: 1200,
  dimensions: { width: 1200, height: 800 },
  backgroundColor: '#ffffff',
};

export const INITIAL_UI_STATE: UIState = {
  selectedSlotId: null,
  isLoading: false,
  error: null,
  loadingMessage: null,
  isExporting: false,
  exportProgress: 0,
};
