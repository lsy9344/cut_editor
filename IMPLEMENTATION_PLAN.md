# Cut Editor - Electron Migration Implementation Plan

## Project Status
- **Current State**: Fresh start - complete `cut-editor-electron/` directory deleted
- **Working Directory**: `/Users/sooyeol/Desktop/Code/CutEditor`
- **Target**: Feature-for-feature migration from Python/PySide2 to Electron+React+TypeScript

## Critical Requirements (NON-NEGOTIABLE)
- ✅ ALL automated checks must pass: `npm run lint && npm run typecheck && npm run format && npm run test`
- ✅ TypeScript strict mode - zero `any` types allowed
- ✅ Zero tolerance for linting/formatting errors
- ✅ Feature parity with original Python application
- ✅ Export quality: pixel-perfect 1200 DPI output

## Implementation Phases

### Phase 1: Foundation Setup (CRITICAL PATH)
**Status**: Ready to execute  
**Dependencies**: None  
**Estimated Time**: 2-3 hours

#### Tasks:
1. **Initialize Electron Project**
   ```bash
   npm create electron-app@latest cut-editor-electron -- --template=typescript-webpack
   cd cut-editor-electron
   ```

2. **Install Core Dependencies**
   ```bash
   # React ecosystem
   npm install react react-dom
   npm install -D @types/react @types/react-dom
   
   # Image processing and canvas
   npm install fabric sharp
   npm install -D @types/fabric
   
   # Styling and UI
   npm install -D tailwindcss postcss autoprefixer
   npx tailwindcss init -p
   
   # Development tools
   npm install -D prettier eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
   npm install -D jest @types/jest ts-jest @testing-library/react @testing-library/jest-dom
   ```

3. **Configure Development Environment**
   - Setup TypeScript strict configuration
   - Configure ESLint rules per CLAUDE.md standards
   - Setup Prettier formatting rules
   - Configure Jest testing framework
   - Setup Tailwind CSS configuration

4. **Create Project Structure**
   ```
   cut-editor-electron/
   ├── src/
   │   ├── main/              # Electron main process
   │   │   ├── index.ts       # Main entry point
   │   │   ├── services/      # IPC services
   │   │   └── utils/         # Main process utilities
   │   ├── renderer/          # React renderer process
   │   │   ├── App.tsx        # Main React app
   │   │   ├── components/    # React components
   │   │   ├── hooks/         # Custom React hooks
   │   │   ├── context/       # React context providers
   │   │   ├── utils/         # Renderer utilities
   │   │   └── styles/        # CSS and styling
   │   ├── shared/            # Shared types and utilities
   │   │   ├── types/         # TypeScript interfaces
   │   │   ├── constants/     # App constants
   │   │   └── utils/         # Shared utilities
   │   └── assets/            # Static assets
   │       ├── fonts/         # Korean font files
   │       └── frames/        # Frame template images
   ├── tests/                 # Test files
   └── docs/                  # Documentation
   ```

#### Validation Criteria:
- [ ] Project initializes without errors
- [ ] All dependencies install successfully
- [ ] `npm run lint` passes with zero warnings
- [ ] `npm run typecheck` passes with zero errors
- [ ] `npm run format` completes successfully
- [ ] `npm run test` passes (even if no tests yet)
- [ ] `npm run build` succeeds
- [ ] Application starts and shows basic Electron window

### Phase 2: Electron Architecture (PARALLEL WORK)
**Status**: Pending Phase 1 completion  
**Dependencies**: Phase 1 foundation  
**Agent Assignment**: Architecture Agent

#### Tasks:
1. **Main Process Setup**
   - Configure main process entry point
   - Setup secure window creation with contextIsolation
   - Implement file system access patterns
   - Setup development tools integration

2. **IPC Communication Interfaces**
   ```typescript
   // Define type-safe IPC interfaces
   interface IpcApi {
     selectFile: (filters: FileFilter[]) => Promise<string | null>;
     loadImage: (path: string) => Promise<ImageData>;
     saveImage: (data: ExportData, path: string) => Promise<void>;
     loadFont: (path: string) => Promise<FontData>;
   }
   ```

3. **Preload Script Configuration**
   - Setup contextBridge for secure IPC
   - Expose typed APIs to renderer
   - Implement security validations

#### Validation Criteria:
- [ ] Main/renderer processes communicate securely
- [ ] File dialogs work correctly
- [ ] IPC interfaces are fully typed
- [ ] No security warnings in Electron

### Phase 3: React UI Foundation (PARALLEL WORK)
**Status**: Pending Phase 1 completion  
**Dependencies**: Phase 1 foundation  
**Agent Assignment**: UI Agent

#### Tasks:
1. **Core Layout Components**
   - `Layout.tsx` - Main two-column layout
   - `Header.tsx` - Application header
   - `ErrorBoundary.tsx` - Error handling wrapper

2. **Sidebar Components** (Control Panel)
   - `Sidebar.tsx` - Container component
   - `FrameSelector.tsx` - Frame template selection
   - `ImageUploader.tsx` - Image file selection
   - `ScaleController.tsx` - Image scaling controls
   - `TextEditor.tsx` - Text input and font controls
   - `ActionButtons.tsx` - Reset, apply, download buttons
   - `StatusDisplay.tsx` - Status messages and feedback

3. **Canvas Area Components**
   - `ImageCanvas.tsx` - Main canvas container
   - `FrameTemplate.tsx` - Frame template display
   - `ImageSlot.tsx` - Individual image slot management
   - `TextOverlay.tsx` - Text rendering overlay

4. **Global State Management**
   ```typescript
   interface AppState {
     currentFrame: FrameTemplate | null;
     imageSlots: ImageSlot[];
     textSettings: TextSettings;
     exportSettings: ExportSettings;
     uiState: UIState;
   }
   ```

#### Validation Criteria:
- [ ] All components render without errors
- [ ] Layout is responsive and matches design
- [ ] State management works correctly
- [ ] Error boundaries catch and display errors
- [ ] Tailwind CSS styling applied correctly

### Phase 4: Canvas & Image Manipulation (SEQUENTIAL)
**Status**: Pending Phase 2-3 completion  
**Dependencies**: Phases 2-3  
**Agent Assignment**: Canvas Agent

#### Tasks:
1. **Fabric.js Integration**
   - Setup Fabric.js canvas with proper TypeScript typing
   - Implement image loading and display
   - Configure canvas event handling
   - Optimize for high-DPI displays

2. **Frame Template System**
   - Load frame template images
   - Calculate slot positions dynamically
   - Implement template switching logic
   - Handle different layout types (2-cut horizontal, 4-cut vertical)

3. **Image Manipulation Features**
   - Drag-and-drop positioning within slots
   - Mouse wheel zoom functionality
   - Scale percentage input controls
   - Constraint-based movement within bounds
   - Visual feedback (crosshairs, boundaries)

4. **Custom Hooks**
   ```typescript
   // Extract complex logic into reusable hooks
   const useImageManipulation = () => { /* ... */ };
   const useFrameSelection = () => { /* ... */ };
   const useCanvasInteraction = () => { /* ... */ };
   ```

#### Validation Criteria:
- [ ] Images load and display correctly
- [ ] Drag-and-drop positioning works smoothly
- [ ] Zoom controls function properly
- [ ] Frame templates switch correctly
- [ ] Performance is responsive on all interactions
- [ ] Memory usage remains stable

### Phase 5: Image Processing & Export (SEQUENTIAL)
**Status**: Pending Phase 4 completion  
**Dependencies**: Phases 2-4  
**Agent Assignment**: Processing Agent

#### Tasks:
1. **Sharp.js Integration**
   - Setup Sharp.js in main process
   - Implement high-quality image processing
   - Handle various image formats (PNG, JPEG, WebP)
   - Optimize memory usage for large images

2. **Korean Font System**
   - Load custom Korean .ttf font
   - Implement font fallback mechanisms
   - Calculate proper text metrics
   - Apply italic shear transformation

3. **High-Resolution Export**
   - Generate 1200 DPI output canvas
   - Scale all elements properly
   - Composite layers (images, frame, text)
   - Maintain pixel-perfect quality
   - Implement progress feedback

4. **Export Pipeline**
   ```typescript
   interface ExportOptions {
     format: 'png' | 'jpeg';
     quality: number;
     dpi: number;
     dimensions: { width: number; height: number };
   }
   ```

#### Validation Criteria:
- [ ] Export produces pixel-perfect 1200 DPI output
- [ ] Korean font renders correctly with italic shear
- [ ] Multiple format support works
- [ ] Progress feedback functions properly
- [ ] Export quality matches original Python version
- [ ] Memory management prevents crashes

## Agent Delegation Strategy

### Phase 1: Foundation (Single Agent)
Execute foundation setup first - all other work depends on this.

### Phase 2-3: Parallel Development
- **Architecture Agent**: Electron main process and IPC setup
- **UI Agent**: React components and state management

### Phase 4-5: Sequential Development  
- **Canvas Agent**: Fabric.js integration and image manipulation
- **Processing Agent**: Sharp.js processing and export system

## Quality Checkpoints

### After Every 3 File Edits:
```bash
npm run lint && npm run typecheck
```

### After Each Component Implementation:
```bash
npm run test -- --testPathPattern=ComponentName
```

### After Each Phase:
```bash
npm run lint && npm run typecheck && npm run format && npm run test && npm run build
```

### Before Phase Completion:
- [ ] All automated checks pass
- [ ] Feature works end-to-end
- [ ] No TODO or FIXME comments
- [ ] Documentation updated
- [ ] Tests provide meaningful coverage

## Risk Mitigation

### High-Risk Areas:
1. **Fabric.js TypeScript Integration** - Complex typing requirements
2. **Sharp.js Memory Management** - Large image processing
3. **Korean Font Rendering** - Cross-platform compatibility
4. **Export Quality** - Pixel-perfect 1200 DPI output
5. **Performance** - Smooth canvas interactions

### Mitigation Strategies:
- Implement comprehensive error handling
- Use TypeScript strict mode to catch errors early
- Test with realistic image sizes and formats
- Benchmark performance at each phase
- Maintain fallback mechanisms for all features

## Success Metrics

### Technical Metrics:
- ✅ Zero linting/TypeScript errors
- ✅ All tests pass with >80% coverage
- ✅ Application starts in <3 seconds
- ✅ Canvas interactions respond in <16ms
- ✅ Export completes in reasonable time with progress feedback

### Functional Metrics:
- ✅ All original Python features working
- ✅ Export quality matches original
- ✅ Korean font rendering accurate
- ✅ Memory usage remains stable
- ✅ Error handling provides clear feedback

## Next Steps

1. **Execute Phase 1 Foundation** - Initialize project and validate tooling
2. **Spawn Parallel Agents** - Delegate Phase 2-3 work
3. **Continuous Integration** - Maintain quality standards throughout
4. **Sequential Integration** - Phase 4-5 development
5. **Final Validation** - End-to-end testing and quality verification

This plan ensures systematic, quality-focused development that will deliver a production-ready Electron application matching the original Python version's functionality.