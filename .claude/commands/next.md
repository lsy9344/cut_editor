---
allowed-tools: all
description: Execute production-quality implementation with strict standards for Cut Editor
---

🚨 **CRITICAL WORKFLOW - NO SHORTCUTS!** 🚨

You are tasked with implementing: $ARGUMENTS

**MANDATORY SEQUENCE:**
1. 🔍 **RESEARCH FIRST** - "Let me research the codebase and create a plan before implementing"
2. 📋 **PLAN** - Present a detailed plan and verify approach
3. ✅ **IMPLEMENT** - Execute with validation checkpoints

**YOU MUST SAY:** "Let me research the codebase and create a plan before implementing."

For complex tasks, say: "Let me ultrathink about this architecture before proposing a solution."

**USE MULTIPLE AGENTS** when the task has independent parts:
"I'll spawn agents to tackle different aspects of this problem"

Consult /Users/sooyeol/Desktop/Code/cut_editor/CLAUDE.md IMMEDIATELY and follow it EXACTLY.

**Critical Requirements:**

🛑 **AUTOMATED CHECKS ARE MANDATORY** 🛑
ALL checks must be ✅ GREEN before continuing!
- npm run lint && npm run typecheck && npm run format && npm run test && npm run build
- No errors. No formatting issues. No linting problems. Zero tolerance.

**Completion Standards (NOT NEGOTIABLE):**
- The task is NOT complete until ALL linters pass with zero warnings
- ALL tests must pass with meaningful coverage of business logic
- The feature must be fully implemented and working end-to-end
- No placeholder comments, TODOs, or "good enough" compromises

**Reality Checkpoints (MANDATORY):**
- After EVERY 3 file edits: Run linters (`npm run lint && npm run typecheck`)
- After implementing each component: Validate it works
- Before saying "done": Run FULL test suite (`npm run test`)
- Before declaring complete: Run production build (`npm run build`)

**Code Evolution Rules:**
- This is a feature branch - implement the NEW solution directly
- DELETE old code when replacing it - no keeping both versions
- NO migration functions, compatibility layers, or deprecated methods
- NO versioned function names (e.g., processDataV2, processDataNew)
- When refactoring, replace the existing implementation entirely
- If changing an API, change it everywhere - no gradual transitions

**Cut Editor Specific Quality Requirements:**

**Electron + React + TypeScript Rules:**
- **Strict TypeScript** - No `any` types, proper interfaces everywhere
- **Functional Components** - Use React hooks, no class components
- **Proper IPC** - Type-safe communication between main and renderer processes
- **Component Composition** - Small, focused components with single responsibility
- **Custom Hooks** - Extract complex logic into reusable hooks
- **Error Boundaries** - Proper error handling at component level
- **Memory Management** - Proper cleanup in useEffect hooks

**FORBIDDEN - NEVER DO THESE:**
- **NO `any` types** - Use proper TypeScript interfaces
- **NO inline styles** - Use Tailwind CSS classes only
- **NO unhandled promises** - Always handle async operations properly
- **NO console.log in production** - Use proper logging mechanisms
- **NO direct DOM manipulation** - Use React patterns exclusively
- **NO memory leaks** - Proper cleanup in useEffect hooks

**Required Standards:**
- **Meaningful names**: `imageCanvas` not `canvas`, `frameTemplates` not `templates`
- **Early returns** to reduce nesting and improve readability
- **Proper error handling** with try-catch and error boundaries
- **Type-safe IPC** with defined interfaces between main/renderer
- **Async/await** over raw promises for better readability
- **Proper cleanup** in useEffect hooks to prevent memory leaks

**Cut Editor Specific Implementation Standards:**

**Image Processing Requirements:**
- Use Sharp.js for high-quality image processing operations
- Implement proper memory management for large image files
- Create thumbnails for UI performance optimization
- Handle various image formats (PNG, JPEG, WebP) properly
- Support high-DPI displays with proper scaling
- Maintain pixel-perfect quality in all operations

**Canvas Operations Requirements:**
- Use Fabric.js for interactive canvas manipulation with proper typing
- Implement proper scaling and positioning algorithms
- Handle high-DPI displays correctly with device pixel ratio
- Optimize for smooth interactions and responsive UI
- Support undo/redo functionality for user actions
- Proper event handling for mouse and touch interactions

**Export System Requirements:**
- Maintain pixel-perfect quality in all export operations
- Support high-resolution outputs (up to 1200 DPI)
- Proper alpha channel handling for transparency
- Progress feedback for long-running export operations
- Multiple format support with quality options
- Background processing to maintain UI responsiveness

**Font Handling Requirements:**
- Load Korean fonts properly with fallback mechanisms
- Handle font fallbacks gracefully for missing characters
- Implement proper text rendering with correct metrics
- Support italic and styling transforms accurately
- Font embedding for consistent output across systems

**Implementation Approach:**
- Start by outlining the complete solution architecture
- When modifying existing code, replace it entirely - don't create parallel implementations
- Run linters after EVERY file creation/modification
- If a linter fails, fix it immediately before proceeding
- Write meaningful tests for business logic, skip trivial tests for main() or simple wiring
- Benchmark critical paths for performance verification

**Procrastination Patterns (FORBIDDEN):**
- "I'll fix the linter warnings at the end" → NO, fix immediately
- "Let me get it working first" → NO, write clean code from the start
- "This is good enough for now" → NO, do it right the first time
- "The tests can come later" → NO, test as you go
- "I'll refactor in a follow-up" → NO, implement the final design now

**Specific Antipatterns to Avoid:**
- Do NOT create elaborate error type hierarchies - keep error handling simple
- Do NOT use any reflection or eval() - explicit typing only
- Do NOT keep old implementations alongside new ones
- Do NOT create "transition" or "compatibility" code
- Do NOT stop at "mostly working" - the code must be production-ready
- Do NOT accept any linter warnings as "acceptable" - fix them all
- Do NOT use setTimeout() for coordination - use proper state management

**Completion Checklist (ALL must be ✅):**
- [ ] Research phase completed with codebase understanding
- [ ] Plan reviewed and approach validated  
- [ ] ALL linters pass with ZERO warnings (`npm run lint:check`)
- [ ] TypeScript compilation passes (`npm run typecheck`)
- [ ] Prettier formatting applied (`npm run format:check`)
- [ ] ALL tests pass (`npm test`)
- [ ] Production build succeeds (`npm run build`)
- [ ] Feature works end-to-end in realistic scenarios
- [ ] Old/replaced code is DELETED
- [ ] Documentation/comments are complete
- [ ] Reality checkpoints were performed regularly
- [ ] NO TODOs, FIXMEs, or "temporary" code remains

**STARTING NOW** with research phase to understand the codebase...

Working directory: `/Users/sooyeol/Desktop/Code/cut_editor/cut-editor-electron`

(Remember: The automated checks will verify everything. No excuses. No shortcuts.)