# Cut Editor - Claude Code Integration

############Please use Korean for all replies to me.

## Development Partnership

We're building a production-quality Electron application together. Your role is to create maintainable, efficient solutions while catching potential issues early.

When you seem stuck or overly complex, I'll redirect you - my guidance helps you stay on track.

## 🚨 AUTOMATED CHECKS ARE MANDATORY
**ALL checks must be ✅ GREEN before continuing!**  
No errors. No formatting issues. No linting problems. Zero tolerance.  
These are not suggestions. Fix ALL issues before proceeding.

## CRITICAL WORKFLOW - ALWAYS FOLLOW THIS!

### Research → Plan → Implement
**NEVER JUMP STRAIGHT TO CODING!** Always follow this sequence:
1. **Research**: Explore the codebase, understand existing patterns
2. **Plan**: Create a detailed implementation plan and verify it with me  
3. **Implement**: Execute the plan with validation checkpoints

When asked to implement any feature, you'll first say: "Let me research the codebase and create a plan before implementing."

For complex architectural decisions or challenging problems, use **"ultrathink"** to engage maximum reasoning capacity. Say: "Let me ultrathink about this architecture before proposing a solution."

### USE MULTIPLE AGENTS!
*Leverage subagents aggressively* for better results:

* Spawn agents to explore different parts of the codebase in parallel
* Use one agent to write tests while another implements features
* Delegate research tasks: "I'll have an agent investigate the React patterns while I analyze the Electron architecture"
* For complex refactors: One agent identifies changes, another implements them

Say: "I'll spawn agents to tackle different aspects of this problem" whenever a task has multiple independent parts.

### Reality Checkpoints
**Stop and validate** at these moments:
- After implementing a complete feature
- Before starting a new major component  
- When something feels wrong
- Before declaring "done"
- **WHEN LINTING/FORMATTING FAILS** ❌

Run: `npm run lint && npm run format && npm run test`

> Why: You can lose track of what's actually working. These checkpoints prevent cascading failures.

### 🚨 CRITICAL: Code Quality Issues Are BLOCKING
**When linting/formatting reports ANY issues, you MUST:**
1. **STOP IMMEDIATELY** - Do not continue with other tasks
2. **FIX ALL ISSUES** - Address every ❌ issue until everything is ✅ GREEN
3. **VERIFY THE FIX** - Re-run the failed command to confirm it's fixed
4. **CONTINUE ORIGINAL TASK** - Return to what you were doing before the interrupt
5. **NEVER IGNORE** - There are NO warnings, only requirements

This includes:
- TypeScript errors
- ESLint violations  
- Prettier formatting issues
- Test failures
- Build errors

Your code must be 100% clean. No exceptions.

## Working Memory Management

### When context gets long:
- Re-read this CLAUDE.md file
- Summarize progress in a PROGRESS.md file
- Document current state before major changes

### Maintain TODO.md:
```
## Current Task
- [ ] What we're doing RIGHT NOW

## Completed  
- [x] What's actually done and tested

## Next Steps
- [ ] What comes next
```

## Electron + React + TypeScript Rules

### REQUIRED PATTERNS:
- **Strict TypeScript** - No `any` types, proper interfaces
- **Functional Components** - Use React hooks, no class components
- **Proper IPC** - Type-safe communication between main and renderer
- **Component Composition** - Small, focused components
- **Custom Hooks** - Extract complex logic into reusable hooks
- **Error Boundaries** - Proper error handling at component level

### FORBIDDEN - NEVER DO THESE:
- **NO `any` types** - Use proper TypeScript interfaces
- **NO inline styles** - Use Tailwind CSS classes
- **NO unhandled promises** - Always handle async operations
- **NO console.log in production** - Use proper logging
- **NO direct DOM manipulation** - Use React patterns
- **NO memory leaks** - Proper cleanup in useEffect

### Required Standards:
- **Meaningful names**: `imageCanvas` not `canvas`
- **Early returns** to reduce nesting
- **Proper error handling** with try-catch and error boundaries
- **Type-safe IPC** with defined interfaces
- **Async/await** over promises
- **Proper cleanup** in useEffect hooks

## Implementation Standards

### Our code is complete when:
- ✅ All TypeScript errors resolved
- ✅ All ESLint rules pass
- ✅ Prettier formatting applied
- ✅ All tests pass  
- ✅ Feature works end-to-end
- ✅ Proper error handling implemented

### Testing Strategy
- Complex business logic → Write tests first
- React components → Test user interactions
- IPC communication → Test with mocks
- Skip tests for simple utility functions

### Project Structure
```
src/
├── main/           # Electron main process
├── renderer/       # React renderer process
├── shared/         # Shared types and utilities
└── assets/         # Static assets
```

## Problem-Solving Together

When you're stuck or confused:
1. **Stop** - Don't spiral into complex solutions
2. **Delegate** - Consider spawning agents for parallel investigation
3. **Ultrathink** - For complex problems, say "I need to ultrathink through this challenge"
4. **Step back** - Re-read the requirements
5. **Simplify** - The simple solution is usually correct
6. **Ask** - "I see two approaches: [A] vs [B]. Which do you prefer?"

My insights on better approaches are valued - please ask for them!

## Performance & Security

### **Measure First**:
- No premature optimization
- Profile before claiming performance issues
- Use React DevTools and Electron DevTools

### **Security Always**:
- Validate all user inputs
- Sanitize file paths
- Use contextIsolation in Electron
- No eval() or dangerous functions

## Communication Protocol

### Progress Updates:
```
✓ Implemented image canvas (tests passing)
✓ Added drag-and-drop functionality  
✗ Found issue with export quality - investigating
```

### Suggesting Improvements:
"The current approach works, but I notice [observation].
Would you like me to [specific improvement]?"

## Cut Editor Specific Guidelines

### Image Processing:
- Use Sharp.js for high-quality image processing
- Implement proper memory management for large images
- Create thumbnails for UI performance
- Handle various image formats (PNG, JPEG, WebP)

### Canvas Operations:
- Use Fabric.js for interactive canvas manipulation
- Implement proper scaling and positioning
- Handle high-DPI displays correctly
- Optimize for smooth interactions

### Export System:
- Maintain pixel-perfect quality
- Support high-resolution outputs (1200 DPI)
- Proper alpha channel handling
- Progress feedback for long operations

### Font Handling:
- Load Korean fonts properly
- Handle font fallbacks gracefully
- Implement proper text rendering
- Support italic and styling transforms

## Working Together

- This is a migration project - maintain feature parity with Python version
- When in doubt, we choose clarity over cleverness
- **REMINDER**: If this file hasn't been referenced in 30+ minutes, RE-READ IT!
- Pro subscription usage - be efficient but thorough

Avoid complex abstractions or "clever" code. The simple, obvious solution is probably better, and my guidance helps you stay focused on what matters most for the cut editor migration.