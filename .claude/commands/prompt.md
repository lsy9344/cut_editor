---
allowed-tools: all
description: Synthesize a complete prompt by combining next.md with your arguments for Cut Editor
---

## 🎯 PROMPT SYNTHESIZER

You will create a **complete, ready-to-copy prompt** by combining:
1. The next.md command template from /Users/sooyeol/Desktop/Code/cut_editor/commands/next.md
2. The specific task details provided here: $ARGUMENTS

### 📋 YOUR TASK:

1. **READ** the next.md command file at `/Users/sooyeol/Desktop/Code/cut_editor/commands/next.md`
2. **EXTRACT** the core prompt structure and requirements
3. **INTEGRATE** the user's arguments seamlessly into the prompt
4. **OUTPUT** a complete prompt in a code block that can be easily copied

### 🎨 OUTPUT FORMAT:

Present the synthesized prompt in a markdown code block like this:

```
[The complete synthesized prompt that combines next.md instructions with the user's specific task]
```

### ⚡ SYNTHESIS RULES:

1. **Preserve Structure** - Maintain the workflow, checkpoints, and requirements from next.md
2. **Integrate Naturally** - Replace `$ARGUMENTS` placeholder with the actual task details
3. **Context Aware** - If the user's arguments reference specific technologies, emphasize relevant sections
4. **Complete & Standalone** - The output should work perfectly when pasted into a fresh Claude conversation
5. **No Meta-Commentary** - Don't explain what you're doing, just output the synthesized prompt

### 🔧 ENHANCEMENT GUIDELINES:

- If the task mentions **image processing**, emphasize Sharp.js requirements and memory management
- If the task mentions **canvas operations**, highlight Fabric.js typing and interaction optimization
- If the task mentions **UI components**, emphasize React patterns and Tailwind CSS usage
- If the task mentions **export/import**, highlight file handling and format support
- If the task mentions **fonts**, emphasize Korean font support and rendering
- If the task seems complex, ensure the "ultrathink" and "multiple agents" sections are prominent
- If the task involves refactoring, highlight the "delete old code" requirements
- Keep ALL critical requirements (automated checks, linting, testing) regardless of the task

### 📦 EXAMPLE BEHAVIOR:

If user provides: "implement drag and drop functionality for image import"

You would:
1. Read next.md from the Cut Editor commands
2. Replace $ARGUMENTS with the user's task
3. Emphasize relevant sections (file handling, image processing, UI interactions)
4. Output the complete, integrated prompt

**CUT EDITOR SPECIFIC CONTEXTUAL ENHANCEMENTS:**

- **Image Processing Tasks**: Highlight Sharp.js integration, memory management, format support
- **Canvas Tasks**: Emphasize Fabric.js typing, performance optimization, high-DPI support
- **UI/UX Tasks**: Focus on React patterns, Tailwind CSS, responsive design
- **Export Tasks**: Highlight quality preservation, progress feedback, format options
- **Performance Tasks**: Emphasize benchmarking, memory optimization, smooth interactions
- **Architecture Tasks**: Focus on main/renderer separation, IPC typing, security

**BEGIN SYNTHESIS NOW** - Read next.md and create the perfect prompt!