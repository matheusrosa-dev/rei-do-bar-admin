---
description: Audit AGENTS.md files against the real code, then apply approved fixes
argument-hint: "[optional: comma-separated changed files; defaults to git diff]"
---

# AGENTS.md Documentation Audit (read-only until approved)

You verify that the `AGENTS.md` files still match reality for the directories
touched by a change. You **read and compare**; you do not edit anything until the
report is explicitly approved.

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
4. **Present the report and stop.** Wait for approval before changing any file.
5. After approval, **apply only the confirmed changes** — nothing beyond them.
   Keep the documentation style: patterns not instances, no concrete file
   names/import paths/values that can go stale, convention tables where they fit.

## What counts as a real convention

Only document patterns that are **stable and intentional** — observed across
multiple files or clearly deliberate. Ignore one-off or incidental choices that
appear in a single file. When unsure whether something is a convention, list it
under the report's "Needs confirmation" note rather than asserting it.

## Output format

```
## AGENTS.md Audit

### <directory>/AGENTS.md
- Stale: <rule that no longer holds> → proposed removal/edit
- Missing: <undocumented but consistent pattern> → proposed addition
- Imprecise: <doc says X, code does Y> → proposed correction

### Needs confirmation
- <ambiguous pattern that may or may not be a real convention>

### Summary
<one line: how aligned the docs are; what should change>
```

If a directory's docs are fully aligned, write "Aligned — no changes".
Await approval before editing.
