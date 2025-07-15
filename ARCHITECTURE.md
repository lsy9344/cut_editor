# Cut Editor - Electron Architecture Design

## Technical Architecture Overview

This document details the technical architecture for the Electron-based cut editor application, focusing on maintainable, scalable, and performant design patterns.

## Core Architecture Principles

### 1. Process Separation
- **Main Process**: File operations, image processing, system integration
- **Renderer Process**: UI components, user interactions, visual feedback
- **Shared**: Type definitions, utility functions, constants

### 2. Component-Based Design
- Modular React components with single responsibilities
- Custom hooks for state management and side effects
- Separation of concerns between UI and business logic

### 3. Event-Driven Communication
- IPC (Inter-Process Communication) for main-renderer communication
- Custom event system for component interactions
- State management with React Context/Redux

## Detailed System Architecture

### Main Process Architecture

```typescript
// src/main/index.ts
interface MainProcessServices {
  fileManager: FileManagerService;
  imageProcessor: ImageProcessorService;
  exportEngine: ExportEngineService;
  windowManager: WindowManagerService;
}

class Application {
  private services: MainProcessServices;
  
  async initialize() {
    // Initialize services
    // Set up IPC handlers
    // Create application window
  }
}
```

#### Core Services

**FileManagerService**
```typescript
interface FileManagerService {
  openImageFile(path: string): Promise<ImageData>;
  openFrameFile(path: string): Promise<FrameData>;
  saveExportedImage(data: ExportData): Promise<string>;
  validateFileType(path: string): boolean;
}
```

**ImageProcessorService**
```typescript
interface ImageProcessorService {
  processImage(image: ImageData, options: ProcessOptions): Promise<ProcessedImage>;
  generateThumbnail(image: ImageData): Promise<ThumbnailData>;
  scaleImage(image: ImageData, scale: number): Promise<ImageData>;
  cropImage(image: ImageData, bounds: Rectangle): Promise<ImageData>;
}
```

**ExportEngineService**
```typescript
interface ExportEngineService {
  exportComposition(
    layout: LayoutData,
    images: ImageData[],
    texts: TextData[],
    frame: FrameData,
    options: ExportOptions
  ): Promise<ExportResult>;
}
```

### Renderer Process Architecture

#### Component Hierarchy

```
App
├── Header
│   ├── MenuBar
│   └── StatusBar
├── MainContent
│   ├── Sidebar
│   │   ├── FrameSelector
│   │   ├── ImageList
│   │   └── TextControls
│   └── Canvas
│       ├── FrameOverlay
│       ├── ImageLayer[]
│       └── TextLayer[]
└── Footer
    ├── ActionButtons
    └── ExportPanel
```

#### Key Components

**FrameSelector Component**
```typescript
interface FrameSelectorProps {
  onFrameSelect: (frame: FrameData) => void;
  availableFrames: FrameData[];
  selectedFrame?: FrameData;
}

const FrameSelector: React.FC<FrameSelectorProps> = ({
  onFrameSelect,
  availableFrames,
  selectedFrame
}) => {
  // Frame selection logic
  // Thumbnail display
  // Layout validation
};
```

**ImageCanvas Component**
```typescript
interface ImageCanvasProps {
  layout: LayoutData;
  images: ImageData[];
  onImageUpdate: (index: number, data: ImageData) => void;
  onImageSelect: (index: number) => void;
}

const ImageCanvas: React.FC<ImageCanvasProps> = ({
  layout,
  images,
  onImageUpdate,
  onImageSelect
}) => {
  // Fabric.js canvas integration
  // Image manipulation handlers
  // Selection management
};
```

**TextOverlay Component**
```typescript
interface TextOverlayProps {
  texts: TextData[];
  layout: LayoutData;
  onTextUpdate: (index: number, data: TextData) => void;
  font: FontData;
}

const TextOverlay: React.FC<TextOverlayProps> = ({
  texts,
  layout,
  onTextUpdate,
  font
}) => {
  // Text input handling
  // Font rendering
  // Position management
};
```

## Data Models

### Core Data Types

```typescript
interface ImageData {
  id: string;
  path: string;
  width: number;
  height: number;
  scale: number;
  position: Position;
  rotation: number;
  thumbnail?: string;
}

interface FrameData {
  id: string;
  name: string;
  path: string;
  layout: LayoutType;
  orientation: 'horizontal' | 'vertical';
  slots: SlotDefinition[];
}

interface TextData {
  id: string;
  content: string;
  position: Position;
  font: FontData;
  style: TextStyle;
  alignment: TextAlignment;
}

interface LayoutData {
  type: LayoutType;
  orientation: 'horizontal' | 'vertical';
  slots: SlotData[];
  dimensions: Dimensions;
}

interface SlotData {
  id: string;
  bounds: Rectangle;
  imageId?: string;
  textId?: string;
}

type LayoutType = '2-frame' | '4-frame' | '6-frame' | '9-frame';
```

### State Management

```typescript
interface ApplicationState {
  ui: UIState;
  project: ProjectState;
  export: ExportState;
}

interface ProjectState {
  currentFrame?: FrameData;
  layout?: LayoutData;
  images: ImageData[];
  texts: TextData[];
  selectedSlot?: string;
}

interface UIState {
  isLoading: boolean;
  error?: string;
  sidebarOpen: boolean;
  selectedTool: ToolType;
}
```

## Canvas Integration Strategy

### Fabric.js Integration

```typescript
class CanvasManager {
  private canvas: fabric.Canvas;
  private imageObjects: Map<string, fabric.Image>;
  private textObjects: Map<string, fabric.Text>;

  constructor(canvasElement: HTMLCanvasElement) {
    this.canvas = new fabric.Canvas(canvasElement);
    this.setupEventHandlers();
  }

  addImage(imageData: ImageData, slot: SlotData) {
    // Add image to canvas
    // Apply transformations
    // Set up interaction handlers
  }

  addText(textData: TextData, slot: SlotData) {
    // Add text to canvas
    // Apply font and styling
    // Set up editing handlers
  }

  private setupEventHandlers() {
    // Mouse events
    // Selection events
    // Modification events
  }
}
```

### Image Processing Pipeline

```typescript
class ImagePipeline {
  async processImage(
    originalImage: ImageData,
    transformations: Transformation[]
  ): Promise<ProcessedImage> {
    let result = originalImage;
    
    for (const transform of transformations) {
      result = await this.applyTransformation(result, transform);
    }
    
    return result;
  }

  private async applyTransformation(
    image: ImageData,
    transform: Transformation
  ): Promise<ImageData> {
    switch (transform.type) {
      case 'scale':
        return this.scaleImage(image, transform.params);
      case 'crop':
        return this.cropImage(image, transform.params);
      case 'rotate':
        return this.rotateImage(image, transform.params);
      default:
        return image;
    }
  }
}
```

## IPC Communication Layer

### Main Process IPC Handlers

```typescript
// src/main/ipc-handlers.ts
export const setupIPCHandlers = (services: MainProcessServices) => {
  ipcMain.handle('file:open-image', async (event, path: string) => {
    return await services.fileManager.openImageFile(path);
  });

  ipcMain.handle('image:process', async (event, data: ImageData, options: ProcessOptions) => {
    return await services.imageProcessor.processImage(data, options);
  });

  ipcMain.handle('export:compose', async (event, exportData: ExportData) => {
    return await services.exportEngine.exportComposition(exportData);
  });
};
```

### Renderer Process IPC Client

```typescript
// src/renderer/services/ipc-client.ts
export class IPCClient {
  static async openImage(path: string): Promise<ImageData> {
    return await ipcRenderer.invoke('file:open-image', path);
  }

  static async processImage(data: ImageData, options: ProcessOptions): Promise<ProcessedImage> {
    return await ipcRenderer.invoke('image:process', data, options);
  }

  static async exportComposition(data: ExportData): Promise<ExportResult> {
    return await ipcRenderer.invoke('export:compose', data);
  }
}
```

## Performance Optimization Strategy

### Image Handling Optimizations

1. **Lazy Loading**: Load images only when needed
2. **Thumbnail Generation**: Create low-res previews for UI
3. **Memory Management**: Dispose of unused image objects
4. **Caching**: Cache processed images for reuse

### Canvas Performance

1. **Object Pooling**: Reuse Fabric.js objects
2. **Selective Rendering**: Only render visible elements
3. **Debounced Updates**: Batch UI updates
4. **Virtual Scrolling**: For large image lists

### Export Performance

1. **Background Processing**: Export in main process
2. **Progress Feedback**: Real-time progress updates
3. **Streaming**: Process images in chunks
4. **Worker Threads**: Parallel processing for multiple images

## Error Handling Strategy

### Error Types and Handling

```typescript
enum ErrorType {
  FileNotFound = 'FILE_NOT_FOUND',
  InvalidFormat = 'INVALID_FORMAT',
  ProcessingFailed = 'PROCESSING_FAILED',
  ExportFailed = 'EXPORT_FAILED',
  MemoryError = 'MEMORY_ERROR'
}

interface ApplicationError {
  type: ErrorType;
  message: string;
  details?: any;
  timestamp: Date;
}

class ErrorHandler {
  static handleError(error: ApplicationError) {
    // Log error
    // Show user notification
    // Attempt recovery
    // Report to monitoring service
  }
}
```

### Graceful Degradation

1. **Fallback Mechanisms**: Alternative processing methods
2. **Partial Functionality**: Continue working with available features
3. **User Feedback**: Clear error messages and recovery options
4. **Auto-Recovery**: Automatic retry for transient errors

## Testing Strategy

### Unit Testing
- Service layer testing with mocks
- Component testing with React Testing Library
- Utility function testing

### Integration Testing
- IPC communication testing
- End-to-end workflow testing
- Cross-platform compatibility testing

### Performance Testing
- Memory usage monitoring
- Canvas performance benchmarks
- Export speed testing

## Security Considerations

### File System Security
- Path validation and sanitization
- File type verification
- Sandboxed file access

### Image Processing Security
- Memory bounds checking
- Input validation
- Resource limits

### User Data Protection
- No sensitive data persistence
- Secure temporary file handling
- Privacy-focused analytics

## Future Extensibility

### Plugin System
- External image processors
- Custom export formats
- Third-party integrations

### API Design
- RESTful service endpoints
- WebSocket real-time updates
- Batch processing capabilities

### Scalability Considerations
- Microservice architecture readiness
- Database integration points
- Cloud processing integration

This architecture provides a solid foundation for the Electron cut editor application with emphasis on maintainability, performance, and user experience.