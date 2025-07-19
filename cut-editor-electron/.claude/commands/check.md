---
allowed-tools: all
description: Verify code quality, run tests, and ensure production readiness for Cut Editor
---

# 🚨🚨🚨 CRITICAL REQUIREMENT: FIX ALL ERRORS! 🚨🚨🚨

**THIS IS NOT A REPORTING TASK - THIS IS A FIXING TASK!**

When you run `/check`, you are REQUIRED to:

1. **IDENTIFY** all errors, warnings, and issues
2. **FIX EVERY SINGLE ONE** - not just report them!
3. **USE MULTIPLE AGENTS** to fix issues in parallel:
   - Spawn one agent to fix linting issues
   - Spawn another to fix test failures
   - Spawn more agents for different files/modules
   - Say: "I'll spawn multiple agents to fix all these issues in parallel"
4. **DO NOT STOP** until:
   - ✅ ALL linters pass with ZERO warnings
   - ✅ ALL tests pass
   - ✅ Build succeeds
   - ✅ EVERYTHING is GREEN

**FORBIDDEN BEHAVIORS:**
- ❌ "Here are the issues I found" → NO! FIX THEM!
- ❌ "The linter reports these problems" → NO! RESOLVE THEM!
- ❌ "Tests are failing because..." → NO! MAKE THEM PASS!
- ❌ Stopping after listing issues → NO! KEEP WORKING!

**MANDATORY WORKFLOW:**
```
1. Run checks → Find issues
2. IMMEDIATELY spawn agents to fix ALL issues
3. Re-run checks → Find remaining issues
4. Fix those too
5. REPEAT until EVERYTHING passes
```

**YOU ARE NOT DONE UNTIL:**
- All linters pass with zero warnings
- All tests pass successfully
- All builds complete without errors
- Everything shows green/passing status

---

🛑 **MANDATORY PRE-FLIGHT CHECK** 🛑
1. Re-read /Users/sooyeol/Desktop/Code/cut_editor/CLAUDE.md RIGHT NOW
2. Check current /Users/sooyeol/Desktop/Code/cut_editor/cut-editor-electron/TODO.md status
3. Verify you're not declaring "done" prematurely

Execute comprehensive quality checks with ZERO tolerance for excuses.

**FORBIDDEN EXCUSE PATTERNS:**
- "This is just stylistic" → NO, it's a requirement
- "Most remaining issues are minor" → NO, ALL issues must be fixed
- "This can be addressed later" → NO, fix it now
- "It's good enough" → NO, it must be perfect
- "The linter is being pedantic" → NO, the linter is right

Let me ultrathink about validating this codebase against our exceptional standards.

**Cut Editor Specific Quality Verification Protocol:**

**Step 0: Pre-Check Analysis**
- Change to Cut Editor directory: `cd /Users/sooyeol/Desktop/Code/cut_editor/cut-editor-electron`
- Review recent changes to understand scope
- Identify which tests should be affected
- Check for any outstanding TODOs or temporary code

**Step 1: Electron + React + TypeScript Linting**
Run ALL quality checks:
- `npm run typecheck` - TypeScript compilation with zero errors
- `npm run lint:check` - ESLint with zero warnings/errors
- `npm run format:check` - Prettier formatting verification
- `npm test` - Jest tests (with --passWithNoTests for now)
- `npm run build` - Production build verification

**Universal Requirements:**
- ZERO TypeScript compilation errors
- ZERO ESLint warnings across ALL files
- ZERO Prettier formatting issues
- ALL tests pass (when implemented)
- Production build succeeds without warnings

**Cut Editor Specific Requirements:**
- No `any` types - proper TypeScript interfaces only
- Functional React components with hooks
- Type-safe IPC communication between main/renderer
- Proper Fabric.js type definitions
- Sharp.js integration properly typed
- Memory management for large images
- Error boundaries implemented
- Proper cleanup in useEffect hooks

**Step 2: Code Quality Checklist**
- [ ] No `any` types - use proper interfaces
- [ ] No inline styles - Tailwind CSS classes only
- [ ] No unhandled promises - proper async/await
- [ ] No console.log in production code
- [ ] No direct DOM manipulation - React patterns
- [ ] No memory leaks - proper useEffect cleanup
- [ ] Meaningful variable names (`imageCanvas` not `canvas`)
- [ ] Early returns to reduce nesting
- [ ] Proper error handling with try-catch
- [ ] Type-safe IPC with defined interfaces

**Step 3: Electron Specific Verification**
- [ ] Context isolation enabled in preload scripts
- [ ] No eval() or dangerous functions
- [ ] Proper main/renderer process separation
- [ ] IPC channels properly typed
- [ ] Security best practices followed
- [ ] No secrets or keys in code

**Step 4: Image Processing Quality**
- [ ] Sharp.js properly configured for high-quality processing
- [ ] Memory management for large images implemented
- [ ] Thumbnail generation for UI performance
- [ ] Support for PNG, JPEG, WebP formats
- [ ] High-DPI display handling
- [ ] Proper alpha channel handling

**Step 5: Canvas Operations Quality**
- [ ] Fabric.js properly typed (no `any` types)
- [ ] Interactive canvas manipulation working
- [ ] Proper scaling and positioning
- [ ] Smooth interactions optimized
- [ ] Export system maintains pixel-perfect quality
- [ ] High-resolution outputs (1200 DPI) supported

**Failure Response Protocol:**
When issues are found:
1. **IMMEDIATELY SPAWN AGENTS** to fix issues in parallel:
   ```
   "I found 15 linting issues and 3 test failures. I'll spawn agents to fix these:
   - Agent 1: Fix TypeScript errors in ImageCanvas.tsx
   - Agent 2: Fix ESLint issues in components/
   - Agent 3: Fix failing tests and Jest configuration
   Let me tackle all of these in parallel..."
   ```
2. **FIX EVERYTHING** - Address EVERY issue, no matter how "minor"
3. **VERIFY** - Re-run all checks after fixes
4. **REPEAT** - If new issues found, spawn more agents and fix those too
5. **NO STOPPING** - Keep working until ALL checks show ✅ GREEN
6. **NO EXCUSES** - Common invalid excuses:
   - "It's just formatting" → Auto-format it NOW
   - "It's a false positive" → Prove it or fix it NOW
   - "It works fine" → Working isn't enough, fix it NOW
   - "Other code does this" → Fix that too NOW
7. **ESCALATE** - Only ask for help if truly blocked after attempting fixes

**Final Verification:**
The code is ready when:
✓ npm run typecheck: PASSES with zero errors
✓ npm run lint:check: PASSES with zero warnings
✓ npm run format:check: PASSES with proper formatting
✓ npm test: PASSES all tests (or exits with code 0 for no tests)
✓ npm run build: PASSES production build
✓ All checklist items verified
✓ Feature works end-to-end in realistic scenarios
✓ Error paths tested and handle gracefully

**Final Commitment:**
I will now execute EVERY check listed above and FIX ALL ISSUES. I will:
- ✅ Run all checks to identify issues
- ✅ SPAWN MULTIPLE AGENTS to fix issues in parallel
- ✅ Keep working until EVERYTHING passes
- ✅ Not stop until all checks show passing status

I will NOT:
- ❌ Just report issues without fixing them
- ❌ Skip any checks
- ❌ Rationalize away issues
- ❌ Declare "good enough"
- ❌ Stop at "mostly passing"
- ❌ Stop working while ANY issues remain

**REMEMBER: This is a FIXING task, not a reporting task!**

The code is ready ONLY when every single check shows ✅ GREEN.

**Executing comprehensive validation and FIXING ALL ISSUES NOW...**