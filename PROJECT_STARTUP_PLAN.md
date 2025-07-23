# Cut Editor - Project Startup Plan

## Project Overview

**Goal**: Migrate "XYZ Studio" from Python/PySide2/OpenCV to Electron/React/TypeScript  
**Status**: Fresh restart (previous implementation deleted)  
**Approach**: Feature-for-feature recreation with modern web technologies

## Current State Analysis

### What We Have
- ✅ `MIGRATION_PLAN.md` - Detailed 5-phase implementation roadmap
- ✅ `CLAUDE.md` - Comprehensive development guidelines and standards
- ✅ `original/for_inform/` - Reference Python implementation files
  - `basic.py` - Core application logic
  - `ui.ui` - Qt Designer interface file
  - `basic.spec` - PyInstaller specification

### What Was Deleted
- Complete `cut-editor-electron/` directory and all source code
- All configuration files (package.json, tsconfig.json, webpack configs)
- All React components and TypeScript source files
- Development tooling and documentation

## Phase 1: Project Foundation Setup

### 1.1 Initialize Electron/React/TypeScript Project
```bash
# Create new Electron project with TypeScript template
npm create electron-app@latest cut-editor-electron -- --template=typescript-webpack
cd cut-editor-electron
```

### 1.2 Install Core Dependencies
```bash
# React ecosystem
npm install react react-dom
npm install -D @types/react @types/react-dom

# Image processing and canvas manipulation
npm install fabric
npm install sharp
npm install -D @types/fabric

# Tailwind CSS for styling
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Development tools
npm install -D prettier eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
npm install -D jest @types/jest ts-jest
```

### 1.3 Configure Development Environment
- Setup TypeScript strict configuration
- Configure ESLint rules per CLAUDE.md standards
- Setup Prettier formatting
- Configure Webpack for renderer process
- Setup Jest testing framework

### 1.4 Project Structure Creation
```
cut-editor-electron/
├── src/
│   ├── main/              # Electron main process
│   │   ├── index.ts       # Main entry point
│   │   └── services/      # IPC services
│   ├── renderer/          # React renderer process
│   │   ├── App.tsx        # Main React app
│   │   ├── components/    # React components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── context/       # React context providers
│   │   └── styles/        # CSS and styling
│   ├── shared/            # Shared types and utilities
│   │   ├── types/         # TypeScript interfaces
│   │   └── constants/     # App constants
│   └── assets/            # Static assets (fonts, images)
├── tests/                 # Test files
└── docs/                  # Documentation
```

## Phase 2: Core UI Implementation

### 2.1 Main Layout Components
Following the original Qt interface design:

**Components to Create:**
- `Layout.tsx` - Main two-column layout (canvas + control panel)
- `Header.tsx` - Application header with title
- `Sidebar.tsx` - Right-side control panel
- `ImageCanvas.tsx` - Left-side canvas area for frame templates
- `ErrorBoundary.tsx` - Error handling wrapper

### 2.2 Control Panel Components
Recreate all Qt widgets as React components:

- `FrameSelector.tsx` - Frame template selection button
- `ImageUploader.tsx` - Image selection for slots
- `ScaleController.tsx` - Image size percentage input
- `TextEditor.tsx` - Text content and font size inputs
- `ActionButtons.tsx` - Reset, apply, download buttons
- `StatusDisplay.tsx` - Log messages display

### 2.3 Canvas System
Implement the multi-frame template system using Fabric.js:

- Canvas container with frame template switching
- Image slot positioning and manipulation
- Drag-and-drop functionality for image positioning
- Zoom/scale controls with mouse wheel
- Crosshair overlay for alignment

## Phase 3: State Management & Logic

### 3.1 React Context Setup
Create type-safe global state management:

```typescript
interface AppState {
  currentFrame: FrameTemplate | null;
  imageSlots: ImageSlot[];
  textSettings: TextSettings;
  exportSettings: ExportSettings;
}
```

### 3.2 Custom Hooks
Extract complex logic into reusable hooks:

- `useFrameSelection` - Frame template management
- `useImageManipulation` - Image positioning, scaling, cropping
- `useTextRendering` - Text overlay management
- `useExportSystem` - High-resolution export functionality

### 3.3 IPC Communication
Implement type-safe Electron IPC for:

- File system operations (open/save dialogs)
- Image processing operations
- Export functionality
- Font loading and management

## Phase 4: Image Processing Pipeline

### 4.1 Image Loading System
- File validation and error handling
- Thumbnail generation for performance
- Memory management for large images
- Support for PNG, JPEG, WebP formats

### 4.2 Canvas Manipulation
Using Fabric.js for interactive image editing:

- Real-time image positioning
- Zoom/pan with smooth interactions
- Constraint-based positioning within slots
- High-DPI display support

### 4.3 Frame Template System
- Dynamic frame template loading
- Automatic slot positioning calculation
- Template switching with state preservation
- Support for 2-cut horizontal, 4-cut vertical layouts

## Phase 5: Export System

### 5.1 High-Resolution Rendering
Implement pixel-perfect export matching Python version:

- Canvas-based rendering at 1200 DPI
- Proper scaling calculations for print quality
- Alpha channel preservation for transparent frames
- Progress feedback for long operations

### 5.2 Text Rendering System
Korean font support with styling:

- Custom font loading (Korean .ttf file)
- Italic shear transformation
- Proper text positioning and alignment
- Vertical text support for specific layouts

### 5.3 File Export
- PNG/JPEG format support
- Quality settings for different use cases
- File size optimization
- Error handling and validation

## Phase 6: Testing & Quality Assurance

### 6.1 Unit Testing
- Component testing with React Testing Library
- Hook testing for complex logic
- IPC communication mocking
- Image processing pipeline tests

### 6.2 Integration Testing
- End-to-end workflow testing
- Export quality validation
- Memory leak detection
- Performance benchmarking

### 6.3 Code Quality
Strict adherence to CLAUDE.md standards:

- TypeScript strict mode (no `any` types)
- ESLint rules compliance
- Prettier formatting
- Zero tolerance for warnings/errors

## Phase 7: Performance & Polish

### 7.1 Performance Optimization
- Image loading and caching strategies
- Canvas rendering optimization
- Memory management improvements
- Startup time optimization

### 7.2 User Experience
- Loading states and progress indicators
- Error messages and user feedback
- Keyboard shortcuts
- Accessibility improvements

### 7.3 Production Build
- Webpack optimization
- Asset bundling
- Electron packaging
- Distribution preparation

## Development Approach

### Following CLAUDE.md Guidelines

1. **Research → Plan → Implement**
   - Always research existing patterns before coding
   - Create detailed plans for review
   - Implement with validation checkpoints

2. **Mandatory Quality Checks**
   - Run `npm run lint && npm run format && npm run test` after every feature
   - Fix ALL issues before continuing
   - Zero tolerance for warnings or errors

3. **Use Multiple Agents**
   - Spawn agents for parallel exploration
   - Delegate research tasks
   - Use agents for different aspects of complex problems

4. **Ultrathink for Complex Decisions**
   - Engage maximum reasoning for architectural choices
   - Use for challenging technical problems
   - Document decision rationale

## Success Criteria

✅ **Feature Parity**: All Python version features working identically  
✅ **Code Quality**: 100% TypeScript strict mode, no linting errors  
✅ **Performance**: Smooth interactions, fast startup, efficient memory usage  
✅ **Export Quality**: Pixel-perfect 1200 DPI output matching original  
✅ **User Experience**: Intuitive interface, proper error handling  
✅ **Maintainability**: Clean architecture, comprehensive tests, documentation

## Next Steps

1. Execute Phase 1 project setup
2. Validate tooling configuration 
3. Begin Phase 2 UI implementation
4. Maintain continuous quality checks throughout development

This plan ensures a systematic, quality-focused approach to recreating the Cut Editor with modern web technologies while maintaining the exact functionality of the original Python application.