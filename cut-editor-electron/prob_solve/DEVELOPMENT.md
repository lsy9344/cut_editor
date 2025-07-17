# Cut Editor - Development Guide

> **⚠️ 문제 해결 가이드**: 흰색 화면 문제가 발생할 경우 [`electron_white_screen_comprehensive_fix.md`](./electron_white_screen_comprehensive_fix.md)를 참조하세요.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run all quality checks
npm run check-all

# Start enhanced development environment
npm run dev

# Start with DevTools closed
AUTO_OPEN_DEVTOOLS=false npm run dev

# Start with debugging enabled
npm run dev:reload

# Build for production
npm run build
```

## 🔄 Enhanced Hot Reload System

### ✨ New Development Features

#### **1. Enhanced Electron Reload**
- **Main Process**: Automatic restart on file changes with smart caching
- **Renderer Process**: Hot Module Replacement (HMR) with React Fast Refresh
- **Preload Script**: Automatic rebuild and reload with dependency tracking
- **File Watching**: Enhanced file watching with chokidar for better performance

#### **2. Development Tools Integration**
- **React DevTools**: Automatic installation and setup
- **Keyboard Shortcuts**:
  - `F12` or `Cmd+Option+I`: Toggle DevTools
  - `Cmd+R` or `Ctrl+R`: Reload renderer
  - `Cmd+Shift+R` or `Ctrl+Shift+R`: Hard reload ignoring cache
- **Auto-open DevTools**: Configurable via environment variable

#### **3. Smart File Watching**
- **Performance Optimized**: Excludes node_modules, .git, dist/renderer, logs
- **Debounced Updates**: Prevents excessive reloads on bulk changes
- **Real-time Feedback**: Clear logging of file changes and compilation status

### 🛠️ Development Scripts

```bash
# Full development environment (enhanced)
npm run dev

# Individual processes
npm run dev:main      # Main process with enhanced watch
npm run dev:preload   # Preload script with dependency tracking
npm run dev:renderer  # Renderer with HMR and React Fast Refresh
npm run dev:electron  # Electron with optimized nodemon

# Debug mode with inspector
npm run dev:reload    # Enables Node.js debugging on port 5858
```

### 🎛️ Environment Configuration

Create `.env.development` for custom settings:
```env
NODE_ENV=development
AUTO_OPEN_DEVTOOLS=true     # Auto-open DevTools on start
GENERATE_SOURCEMAP=true     # Enable source maps for debugging
FAST_REFRESH=true           # Enable React Fast Refresh
ELECTRON_DEBUG=true         # Enable Electron debugging
REACT_DEVTOOLS=true         # Enable React DevTools
```

## 🔧 Development Workflow

### Daily Development Cycle
```bash
# Before starting work
npm run check-all

# During development
npm run dev

# Before committing
npm run check-all
```

### Quality Gates
**Every commit must pass:**
- ✅ ESLint (no errors)
- ✅ TypeScript (no type errors)  
- ✅ Prettier (consistent formatting)
- ✅ Build (successful compilation)

### Architecture Principles

**1. Strict Type Safety**
- No `any` types allowed
- Comprehensive interfaces for all data structures
- Type-safe IPC communication

**2. Component Isolation**
- Single responsibility principle
- Custom hooks for complex logic
- Minimal prop drilling

**3. Error Boundaries**
- Graceful error handling
- User-friendly error messages
- Automatic error recovery where possible

## 📁 Project Structure

```
src/
├── main/              # Electron main process
│   ├── index.ts       # App entry point
│   ├── services/      # Business logic services
│   └── utils/         # Main process utilities
├── renderer/          # React renderer process
│   ├── components/    # UI components
│   ├── hooks/         # Custom React hooks
│   ├── services/      # Client-side services
│   └── styles/        # Styling files
├── shared/            # Shared between processes
│   ├── types/         # TypeScript interfaces
│   ├── constants/     # App constants
│   └── utils/         # Shared utilities
├── preload/           # IPC bridge
└── test/              # Test configuration
```

## 🎯 Development Standards

### Code Quality
- **TypeScript**: Strict mode enabled
- **ESLint**: Comprehensive rules for consistency
- **Prettier**: Automated formatting
- **Testing**: Jest + React Testing Library

### Performance Guidelines
- **Image Loading**: Lazy loading with thumbnails
- **Canvas Operations**: Debounced updates
- **Memory Management**: Proper cleanup in useEffect
- **Build Size**: Monitor bundle size

### Security Best Practices
- **Input Validation**: All user inputs sanitized
- **File System**: Secure path handling
- **IPC**: Type-safe communication only
- **Dependencies**: Regular security audits

## 🧪 Testing Strategy

### Unit Tests
```bash
npm run test
npm run test:watch
```

### Integration Tests
- IPC communication
- Component interactions
- File operations

### Manual Testing Checklist
- [ ] Frame selection works
- [ ] Image drag-and-drop functions
- [ ] Export generates correct output
- [ ] All window controls work
- [ ] Error handling is graceful

## 📊 Performance Monitoring

### Key Metrics to Track
- **Startup Time**: < 3 seconds
- **Memory Usage**: < 1GB for typical projects
- **Export Speed**: Within 10% of Python version
- **UI Responsiveness**: < 100ms for user actions

### Performance Tools
```bash
# Bundle analysis
npm run build -- --analyze

# Memory profiling
# Use Chrome DevTools in development
```

## 🐛 Debugging Guide

### Common Issues
1. **TypeScript Errors**: Check type definitions in `src/shared/types/`
2. **Build Failures**: Verify all imports are correct
3. **Canvas Issues**: Check Fabric.js integration
4. **IPC Problems**: Verify preload script setup

### Debug Tools
- **Chrome DevTools**: Built-in with Electron
- **React DevTools**: Available in development
- **VSCode Debugger**: Configured for Electron

## 🔄 Release Process

### Pre-release Checklist
- [ ] All tests passing
- [ ] Documentation updated
- [ ] Version number bumped
- [ ] Changelog updated
- [ ] Performance benchmarks run

### Build Commands
```bash
# Development build
npm run build

# Production build with optimization
npm run build:prod

# Package for distribution
npm run package
```

## 🎨 UI/UX Guidelines

### Design System
- **Colors**: Consistent palette defined in Tailwind config
- **Typography**: Clear hierarchy with proper font weights
- **Spacing**: 4px base unit system
- **Animations**: Subtle transitions (200ms)

### User Experience
- **Loading States**: Always show progress feedback
- **Error Messages**: Clear, actionable messages
- **Keyboard Navigation**: Full keyboard support
- **Accessibility**: ARIA labels and proper focus management

## 📚 Resources

### Documentation
- [Electron Documentation](https://www.electronjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Fabric.js Documentation](http://fabricjs.com/docs)

### Tools
- **Code Editor**: VSCode with TypeScript support
- **Version Control**: Git with conventional commits
- **Package Manager**: npm (lockfile committed)

---

*This development guide ensures consistent, high-quality code across the project.*