@AGENTS.md

# Orchestrator

This file defines **when and how to act**. All code conventions live in the
`AGENTS.md` files — this file does not duplicate them.

## Rule Zero — before any task

1. Read the root `AGENTS.md`.
2. For every file you will touch, read the `AGENTS.md` in that file's directory
   (if one exists).
3. The `AGENTS.md` files are the source of truth and take precedence over any
   pattern you infer from a single file.

## Pre-Implementation — before writing any UI

This project has a visual interface. Before writing or changing any UI:

1. Run `.claude/commands/design-spec.md`.
2. Produce the visual spec and get it approved before writing component code.

## Hard Constraints

- Never change the directory structure or create scaffolding without explicit
  confirmation.
- Never install, remove, or upgrade a dependency without first presenting the
  package + justification and getting approval.
- No over-engineering — implement exactly what was asked, nothing more.
- Do not add comments, docstrings, or type annotations to code you did not change.
- Do not nest ternaries.
- Comment only when genuinely necessary — if a name needs a comment to be
  understood, rename it instead.

## Post-Implementation — before closing any task

1. Run the verification command:
   - `npm run lint` (Biome lint + format check)
   - `npm run typecheck` (TypeScript build-mode type check, no bundle)
2. Launch an **independent subagent** with `.claude/commands/review-changes.md`
   and wait for its full report.
3. Fix **every** Critical and Warning finding, then re-run the verification
   command.
4. Run `.claude/commands/review-agents-docs.md` to audit the documentation for the
   directories you touched.

### Review severity

- **Critical** — broken contract, bug, security risk, or a violation of a
  structural project convention. Must fix.
- **Warning** — style inconsistency, a pattern applied incompletely, or a
  decision that creates debt. Must fix.
- **Suggestion** — optional improvement with no immediate impact.
