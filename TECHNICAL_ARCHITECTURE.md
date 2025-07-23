# Cut Editor - Technical Architecture Documentation

## Architecture Overview

The Cut Editor is a desktop image editing application built with Electron, React, and TypeScript. It migrates functionality from a Python/PySide2/OpenCV application to modern web technologies while maintaining feature parity and export quality.

## Technology Stack

### Core Technologies
- **Electron** - Desktop application framework
- **React 18** - UI framework with functional components and hooks
- **TypeScript** - Strict typing for reliability and maintainability
- **Webpack** - Module bundling and build system

### Key Libraries
- **Fabric.js** - Interactive canvas manipulation and image positioning
- **Sharp.js** - High-quality server-side image processing
- **Tailwind CSS** - Utility-first CSS framework for styling
- **React Context API** - Global state management

### Development Tools
- **ESLint** - Code linting with TypeScript rules
- **Prettier** - Code formatting
- **Jest** - Unit testing framework
- **React Testing Library** - Component testing

## Application Architecture

### Process Architecture

```
┌─────────────────────────────────────────────────┐
│                Main Process                     │
│  ┌─────────────────────────────────────────┐   │
│  │           Electron Main              │   │
│  │  - Window management                 │   │
│  │  - File system operations           │   │
│  │  - IPC service handlers             │   │
│  └─────────────────────────────────────────┘   │
└─────────────────────────────────────────────────┘
                        │ IPC
                        ▼
┌─────────────────────────────────────────────────┐
│              Renderer Process                   │
│  ┌─────────────────────────────────────────┐   │
│  │            React App                 │   │
│  │  - UI Components                     │   │
│  │  - State Management                  │   │
│  │  - Canvas Operations                 │   │
│  │  - Image Processing                  │   │
│  └─────────────────────────────────────────┘   │
└─────────────────────────────────────────────────┘
```

### Component Architecture

```
App.tsx
├── Layout.tsx
│   ├── Header.tsx
│   ├── ImageCanvas.tsx
│   │   ├── FrameTemplate.tsx
│   │   ├── ImageSlot.tsx
│   │   └── TextOverlay.tsx
│   └── Sidebar.tsx
│       ├── FrameSelector.tsx
│       ├── ImageUploader.tsx
│       ├── ScaleController.tsx
│       ├── TextEditor.tsx
│       ├── ActionButtons.tsx
│       └── StatusDisplay.tsx
└── ErrorBoundary.tsx
```

## Data Flow Architecture

### State Management

The application uses React Context API for global state management with the following structure:

```typescript
interface AppState {
  // Frame template management
  currentFrame: {
    id: string;
    path: string;
    layout: 'horizontal_2' | 'vertical_4' | string;
    slots: SlotDefinition[];
  } | null;

  // Image slot data
  imageSlots: {
    id: string;
    image: HTMLImageElement | null;
    scale: number;
    position: { x: number; y: number };
    bounds: { width: number; height: number };
  }[];

  // Text rendering settings
  textSettings: {
    content: string;
    fontSize: number;
    fontFamily: string;
    positions: TextPosition[];
  };

  // Export configuration
  exportSettings: {
    format: 'png' | 'jpeg';
    quality: number;
    dpi: number;
    dimensions: { width: number; height: number };
  };
}
```

### Event Flow

1. **User Actions** → Component Event Handlers
2. **Event Handlers** → Context Actions (useContext dispatchers)
3. **Context Actions** → State Updates
4. **State Updates** → Component Re-renders
5. **Re-renders** → Canvas/UI Updates

### IPC Communication Flow

```
Renderer Process          Main Process
      │                        │
      │ ──── selectFile() ────▶ │
      │                        │ ──── File Dialog
      │                        │ ◀──── File Path
      │ ◀── filePath ─────────  │
      │                        │
      │ ──── loadImage() ─────▶ │
      │                        │ ──── Sharp.js Processing
      │                        │ ◀──── Processed Image
      │ ◀── imageData ────────  │
```

## Core Systems

### 1. Frame Template System

**Purpose**: Manages different layout templates (2-cut horizontal, 4-cut vertical, etc.)

**Components**:
- `FrameSelector.tsx` - UI for template selection
- `FrameTemplate.tsx` - Template rendering and slot positioning
- Frame template data in `shared/data/frameTemplates.ts`

**Data Flow**:
1. User selects frame template
2. Template configuration loads slot definitions
3. Canvas resets with new slot positions
4. Frame overlay image loads and displays

### 2. Image Manipulation System

**Purpose**: Handles image loading, positioning, scaling, and interactive manipulation

**Components**:
- `ImageSlot.tsx` - Individual image slot management
- `useImageManipulation` hook - Core manipulation logic
- Fabric.js canvas integration

**Key Features**:
- Drag-and-drop positioning within slot boundaries
- Mouse wheel zooming with center-point preservation
- Scale percentage input with real-time updates
- Constraint-based movement within slot bounds

**Technical Implementation**:
```typescript
// Image transformation matrix
const transform = {
  scale: number,        // Zoom level (100% = 1.0)
  translate: {x, y},    // Pan offset from center
  bounds: {w, h}        // Slot boundary constraints
};

// Canvas rendering
fabricCanvas.setTransform(
  scale, 0, 0, scale, 
  translateX, translateY
);
```

### 3. Text Rendering System

**Purpose**: Handles text overlay with Korean font support and styling

**Components**:
- `TextEditor.tsx` - Text input and font controls
- `TextOverlay.tsx` - Canvas text rendering
- Font loading service in main process

**Key Features**:
- Korean font (.ttf) loading and fallback
- Italic shear transformation
- Vertical text for specific layouts
- Text positioning per frame template

**Font Handling**:
```typescript
// Font loading in main process
const fontBuffer = fs.readFileSync(fontPath);
webContents.send('font-loaded', {
  family: 'Korean Font',
  data: fontBuffer
});

// Canvas text rendering
ctx.font = `${fontSize}px "${fontFamily}"`;
ctx.setTransform(1, 0, Math.tan(italicAngle), 1, x, y);
ctx.fillText(text, 0, 0);
```

### 4. Export System

**Purpose**: High-resolution image export with pixel-perfect quality

**Components**:
- Export service in main process using Sharp.js
- Progress feedback system
- Format and quality options

**Export Pipeline**:
1. **Canvas Capture**: Render current view to high-DPI canvas
2. **Scale Calculation**: Calculate DPI scaling factors
3. **Image Composition**: Layer images, frame, and text
4. **Sharp Processing**: Final image processing and optimization
5. **File Output**: Save with user-selected format and location

**Technical Details**:
```typescript
// High-DPI export scaling
const scaleFactor = targetDPI / displayDPI; // 1200 / 96 = 12.5x
const exportCanvas = new OffscreenCanvas(
  viewWidth * scaleFactor,
  viewHeight * scaleFactor
);

// Layer composition order
1. User images (scaled and positioned)
2. Frame template overlay (alpha blended)
3. Text overlays (font-rendered)
```

## Performance Considerations

### Memory Management
- **Image Caching**: Thumbnails for UI, full resolution for export only
- **Canvas Optimization**: Selective re-rendering of changed regions
- **Resource Cleanup**: Proper disposal of image objects and canvas contexts

### Rendering Performance
- **Debounced Updates**: Scale and position changes batched
- **Virtual Scrolling**: For large frame template lists
- **Canvas Layers**: Separate layers for images, frame, and text

### Export Performance
- **Background Processing**: Export operations in main process
- **Progress Feedback**: Real-time progress updates to UI
- **Memory Streaming**: Process large images in chunks

## Security Considerations

### Electron Security
- **Context Isolation**: Enabled for renderer security
- **Node Integration**: Disabled in renderer process
- **Content Security Policy**: Strict CSP headers
- **File System Access**: Sandboxed through IPC only

### Input Validation
- **File Type Validation**: Whitelist image formats
- **Path Sanitization**: Prevent directory traversal
- **Size Limits**: Maximum image dimensions and file sizes
- **XSS Prevention**: Sanitize all user text input

## Error Handling Strategy

### Component Level
- **Error Boundaries**: Catch and display React component errors
- **Input Validation**: Real-time validation with user feedback
- **Graceful Degradation**: Fallback states for missing resources

### System Level
- **IPC Error Handling**: Proper error propagation between processes
- **File System Errors**: User-friendly messages for file operations
- **Memory Errors**: Cleanup and recovery for memory exhaustion
- **Network Errors**: Retry logic for remote resources

### Logging Strategy
- **Development**: Detailed console logging with stack traces
- **Production**: File-based logging with rotation
- **User Feedback**: Non-technical error messages with action guidance

## Testing Strategy

### Unit Testing
- **Pure Functions**: Image processing utilities
- **React Hooks**: Custom hooks with mock dependencies
- **State Management**: Context reducers and actions

### Integration Testing
- **Component Integration**: Parent-child component interactions
- **IPC Communication**: Main-renderer process communication
- **File System Operations**: Mocked file operations

### End-to-End Testing
- **User Workflows**: Complete image editing and export workflows
- **Performance Testing**: Memory usage and rendering performance
- **Quality Assurance**: Export image quality validation

## Development Guidelines

### Code Organization
- **Feature-based Structure**: Group related components and utilities
- **Separation of Concerns**: Clear boundaries between UI, logic, and data
- **Dependency Injection**: Testable services and utilities

### TypeScript Standards
- **Strict Mode**: No `any` types, proper null checking
- **Interface Definitions**: Comprehensive type coverage
- **Generic Types**: Reusable type-safe utilities

### React Patterns
- **Functional Components**: Hooks-based architecture
- **Custom Hooks**: Reusable stateful logic
- **Context Providers**: Centralized state management
- **Error Boundaries**: Proper error containment

This architecture ensures a maintainable, performant, and secure application that faithfully recreates the original Python application's functionality while leveraging modern web technologies.