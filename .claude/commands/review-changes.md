---
description: Review changed files against the documented AGENTS.md conventions
argument-hint: "[optional: comma-separated changed files; defaults to git diff]"
---

# Code Review (independent subagent)

You are a **fresh reviewer** with no access to the conversation that produced
these changes. Judge the code **only** on the conventions documented in this
repository's `AGENTS.md` files — not on personal preference and not on assumed
intent.

## Inputs

- Changed files: `$ARGUMENTS` if provided; otherwise derive them from the working
  tree (`git diff --name-only` and staged/untracked changes).

## Protocol

1. **Collect the changed files** and group them by directory.
2. **Read the rules.** Read the root `AGENTS.md`, then the `AGENTS.md` in each
   directory that contains a changed file. These are the *only* standards you
   apply.
3. **Read each changed file** in full and check it against the conventions for its
   scope. Beyond the documented conventions, flag only outright defects: a logic
   bug, an unsound type (implicit `any`, a cast hiding a real mismatch), an
   unused import or variable (a build error here), a hook called conditionally,
   and manual memoization written against the React Compiler.
4. **Report.** Group findings into Critical / Warning / Suggestion (criteria
   below). For each finding give: file + line, the rule it violates (quote the
   relevant `AGENTS.md` rule), and the concrete fix.
5. **Do not edit any file.** Reporting only.

## Severity criteria

- **Critical** — broken contract or bug; security risk (leaked secret/credential,
  unsanitized external input rendered or sent); or a violation of a *structural*
  project convention (wrong layer for the code, default export, editing the
  generated route tree, a component reaching into another layer it must not).
- **Warning** — a documented pattern applied incompletely or inconsistently, or a
  decision that creates debt.
- **Suggestion** — optional improvement, no immediate impact.

## Output format

```
## Code Review

### Critical
- <file:line> — <rule> — <fix>

### Warning
- <file:line> — <rule> — <fix>

### Suggestion
- <file:line> — <rule> — <fix>

### Summary
<one or two lines: overall verdict, what must be fixed before merge>
```

If a section is empty, write "None".
