@AGENTS.md

## Rule Zero — Read the AGENTS.md files

Before accessing, creating, or modifying any file inside a directory, you **must** read the `AGENTS.md` file in that directory, if one exists. Also read the root `AGENTS.md` before any task.

The AGENTS.md files are the source of truth for conventions in their respective scopes and take precedence over any inferred pattern. Never assume a convention — always consult the corresponding AGENTS.md first.

---

## Pre-Implementation — UI/UX Design

**This step is mandatory whenever the task involves any visual change.** This includes — but is not limited to — creating or modifying pages, partials, or shared components; changing layout, spacing, typography, colors, or iconography; adding buttons, cards, tables, inputs, headers, modals, or filters; and any other change that affects what the user sees.

Before writing any code:
1. Read `.claude/commands/ui-ux.md` and follow its instructions to produce the Visual Spec.
2. The Visual Spec describes every component and sub-component individually (layout, Tailwind classes, palette roles, typography, states, interactions).
3. **Do not edit any file until the Visual Spec is complete.** The spec is the visual contract for the entire implementation.

---

## Hard Constraints

- **NEVER alter the directory structure or create new scaffolding folders/files without first asking the user and receiving explicit confirmation.**
- **NEVER install, remove, or update dependencies without first asking the user and receiving explicit confirmation.** Present the package and the justification, then wait for approval.
- Do not over-engineer. Only implement what was requested.
- Do not add comments, docstrings, or type annotations to code you did not change.
- Do not nest ternary operators inside other ternary operators.
- Do not add comments unless they are genuinely necessary to explain non-obvious logic.

---

## Post-Implementation — Code Review

After finishing **all** edits in a task:
1. Run `npm run lint` in the terminal. If any errors are reported, fix them. Then run `npx tsc -b` to confirm there are no type errors.
2. Launch a subagent (general-purpose) for an **independent** review: tell it to read `.claude/commands/review-changes.md` and follow it, passing the list of every file changed and a short description of what was implemented. The subagent returns the structured review and does not edit any files.
3. Fix **all Critical and Warning issues** reported by the code review. Then re-run `npm run lint` and `npx tsc -b` to confirm no new issues were introduced.
4. After all issues are resolved, read `.claude/commands/review-agents-docs.md` and follow its instructions, passing the same list of files changed.
