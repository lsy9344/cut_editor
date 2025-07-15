# Cut Editor - Electron Migration Project

## Overview

This project migrates the existing Python/PySide2 cut editor application to Electron for improved cross-platform compatibility, modern web technology stack, and enhanced user experience.

### Current Application Analysis

The existing Python application is a sophisticated image editing tool with the following core features:

- **Frame Layout System**: Support for 2, 4, 6, and 9 image layouts in both horizontal and vertical orientations
- **Image Management**: Drag-and-drop image placement, scaling, positioning, and manipulation
- **Text Overlays**: Custom Korean font support with italic text rendering
- **Export System**: High-resolution (1200 DPI) image export with proper frame and text composition
- **Interactive UI**: Mouse-based image manipulation (drag, zoom, click selection)

### Key Components Identified

1. **Frame Management**: Dynamic frame loading based on filename conventions
2. **Image Processing**: OpenCV-based image scaling, positioning, and canvas composition
3. **Text Rendering**: PIL-based Korean text with italic styling and alignment
4. **Export Engine**: High-DPI image composition with transparency support
5. **Event System**: Mouse event handling for interactive image manipulation

## Migration Strategy

### Technology Stack

**Frontend:**
- Electron (latest LTS)
- React with TypeScript
- Tailwind CSS for styling
- Fabric.js for canvas manipulation
- React DnD for drag-and-drop

**Backend/Processing:**
- Node.js with native modules
- Sharp for image processing
- Canvas API for text rendering
- File system operations

### Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Electron Main Process                    │
├─────────────────────────────────────────────────────────────┤
│  File Operations │  Image Processing │  Export Engine      │
└─────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                 Electron Renderer Process                   │
├─────────────────────────────────────────────────────────────┤
│  React UI Components │  Canvas Manager │  Event Handlers   │
└─────────────────────────────────────────────────────────────┘
```

## Project Structure

```
cut-editor-electron/
├── src/
│   ├── main/                    # Electron main process
│   │   ├── index.ts            # Main entry point
│   │   ├── image-processor.ts  # Image processing services
│   │   ├── export-engine.ts    # High-resolution export
│   │   └── file-manager.ts     # File operations
│   ├── renderer/               # Electron renderer process
│   │   ├── components/         # React components
│   │   │   ├── FrameSelector/
│   │   │   ├── ImageCanvas/
│   │   │   ├── TextOverlay/
│   │   │   └── ExportPanel/
│   │   ├── hooks/             # Custom React hooks
│   │   ├── utils/             # Utility functions
│   │   └── types/             # TypeScript definitions
│   └── shared/                # Shared types and utilities
├── assets/                    # Static assets
│   ├── frames/               # Frame images
│   └── fonts/                # Font files
├── dist/                     # Built application
├── package.json
├── tsconfig.json
├── webpack.config.js
└── electron-builder.json
```

## Development Phases

### Phase 1: Foundation Setup (Week 1)
- [x] Project structure creation
- [x] Electron + React + TypeScript configuration
- [x] Development environment setup
- [x] Basic window and menu structure

### Phase 2: Core UI Components (Week 2)
- [ ] Frame selection and display system
- [ ] Image canvas with Fabric.js integration
- [ ] Drag-and-drop image loading
- [ ] Basic scaling and positioning

### Phase 3: Advanced Features (Week 3)
- [ ] Text overlay system with Korean font support
- [ ] Mouse interaction handlers (drag, zoom, click)
- [ ] State management for image and text data
- [ ] Undo/redo functionality

### Phase 4: Export System (Week 4)
- [ ] High-resolution export engine
- [ ] Frame and alpha channel composition
- [ ] Text rendering with proper positioning
- [ ] File format support (PNG, JPEG)

### Phase 5: Polish and Testing (Week 5)
- [ ] Error handling and validation
- [ ] Performance optimization
- [ ] Cross-platform testing
- [ ] User interface refinements

## Feature Mapping

### Frame System
- **Original**: Filename-based frame detection (`2_horizontal.png`, etc.)
- **Electron**: JSON-based frame configuration with dynamic loading

### Image Processing
- **Original**: OpenCV for image manipulation
- **Electron**: Sharp for server-side processing, Canvas API for display

### Text Rendering
- **Original**: PIL with custom font loading
- **Electron**: HTML5 Canvas with web fonts and CSS transforms

### Export Engine
- **Original**: High-DPI OpenCV composition
- **Electron**: Node.js Sharp processing with precise positioning

## Technical Considerations

### Performance Optimizations
- Lazy loading of frame images
- Image thumbnail generation for UI
- Background processing for export operations
- Memory management for large images

### Cross-Platform Compatibility
- Native file dialogs
- Font loading across different OS
- Path handling (Windows vs Unix)
- DPI scaling support

### User Experience Improvements
- Real-time preview during editing
- Keyboard shortcuts
- Modern drag-and-drop interface
- Progress indicators for export

## Development Environment

### Prerequisites
- Node.js (LTS version)
- npm or yarn
- Git

### Setup Commands
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Package for distribution
npm run package
```

### Development Scripts
- `npm run dev` - Start development with hot reload
- `npm run build` - Build for production
- `npm run test` - Run test suite
- `npm run lint` - Code linting
- `npm run package` - Create distributable packages

## Configuration Files

### package.json
Main project configuration with dependencies and scripts

### tsconfig.json
TypeScript compilation settings

### webpack.config.js
Bundling configuration for both main and renderer processes

### electron-builder.json
Application packaging and distribution settings

## Quality Assurance

### Testing Strategy
- Unit tests for utility functions
- Integration tests for core workflows
- E2E tests for user interactions
- Cross-platform testing on macOS, Windows, Linux

### Code Quality
- TypeScript for type safety
- ESLint for code quality
- Prettier for formatting
- Husky for pre-commit hooks

## Deployment Strategy

### Distribution Channels
- GitHub Releases for direct download
- Auto-updater integration
- Platform-specific installers (dmg, exe, AppImage)

### Version Management
- Semantic versioning (semver)
- Automated changelog generation
- Release notes with feature highlights

## Migration Benefits

### Technical Advantages
- Modern web technology stack
- Better cross-platform compatibility
- Easier maintenance and updates
- Rich ecosystem of libraries

### User Experience Improvements
- Faster startup times
- More responsive interface
- Better file handling
- Modern UI/UX patterns

### Development Benefits
- Hot reload during development
- Component-based architecture
- Strong typing with TypeScript
- Extensive testing capabilities

## Next Steps

1. **Environment Setup**: Configure development environment
2. **Basic Structure**: Create project skeleton
3. **Core Features**: Implement frame and image systems
4. **Advanced Features**: Add text and export capabilities
5. **Testing and Polish**: Comprehensive testing and refinement

This migration will modernize the cut editor application while preserving all existing functionality and improving the overall user experience.