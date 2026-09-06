---
description: Audit AGENTS.md files against the real code and apply the fixes
argument-hint: "[optional: comma-separated changed files; defaults to git diff]"
model: claude-haiku-4-5-20251001
---

# AGENTS.md Documentation Audit

You verify that the `AGENTS.md` files still match reality for the directories
touched by a change. You **read, compare and fix**: apply the corrections
yourself, without asking for approval first.

## Inputs

- Changed files: `$ARGUMENTS` if provided; otherwise derive them from the working
  tree (`git diff --name-only` and staged/untracked changes).

## Protocol

1. **Determine the affected directories** from the changed files. Include the root
   for global-convention impact.
2. For each affected directory that has an `AGENTS.md`, **compare the documented
   conventions against the actual code** currently in that directory (not only the
   diff — the whole directory's real state).
3. **Classify every discrepancy** into exactly one bucket:
   - **Stale** — documented, but no longer present/practiced in the code.
   - **Missing** — consistently practiced in the code, but not documented.
   - **Imprecise** — documented differently from what the code actually does.
4. **Apply the fixes yourself** with your own edit tools, directly to the
   `AGENTS.md` files — no approval step, no handing the edits back to the caller
   as a list for someone else to apply. Fix only the discrepancies you actually
   confirmed against the code, nothing beyond them. Keep the documentation style:
   patterns not instances, no concrete file names/import paths/values that can go
   stale, convention tables where they fit.
5. **Report what you changed.** Anything you deliberately left alone (see "Needs
   confirmation") goes in the report instead of into the files.

## What counts as a real convention

Only document patterns that are **stable and intentional** — observed across
multiple files or clearly deliberate. Ignore one-off or incidental choices that
appear in a single file. When unsure whether something is a convention, list it
under the report's "Needs confirmation" note rather than asserting it.

## Output format

```
## AGENTS.md Audit

### <directory>/AGENTS.md
- Stale: <rule that no longer holds> → removed/edited
- Missing: <undocumented but consistent pattern> → added
- Imprecise: <doc says X, code does Y> → corrected

### Needs confirmation
- <ambiguous pattern that may or may not be a real convention — left untouched>

### Summary
<one line: how aligned the docs were; which files you edited>
```

If a directory's docs are fully aligned, write "Aligned — no changes".
