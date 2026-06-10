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
   scope.
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

## Checklist (frontend SPA)

Apply the items relevant to each changed file's scope.

### Correctness & types
- [ ] Types are sound; no implicit `any`, no unsafe casts hiding real mismatches.
- [ ] `import type` used for type-only imports.
- [ ] No unused imports/variables (these are build errors here).
- [ ] Logic matches intent; no obviously dead or contradictory branches.

### React & hooks
- [ ] Hooks called unconditionally at the top level.
- [ ] `useQuery` keys include **every** dependency the request uses.
- [ ] Mutations follow the success protocol: toast + invalidate affected keys +
      close modal (+ seed cache when navigating to a detail view).
- [ ] No manual memoization added to fight the React Compiler.

### Structure & boundaries
- [ ] Code lives in the correct layer (components vs. routes vs. services vs.
      shared) per the root `AGENTS.md` folder map.
- [ ] Reusable UI is feature-agnostic; route-local code stays under `-partials`/
      `-helpers`/`-shared`.
- [ ] Services expose `{ fn, key }` reads / bare-function writes and stay
      React-Query-free; they return `response.data.data` and add no per-call
      `try/catch`.
- [ ] Models are `I`-prefixed entities; helpers are pure.

### Styling
- [ ] Only design-system tokens (see `.claude/references/design-system.md`); no
      stray hex/spacing values.
- [ ] External `className` merged via `twMerge`; variants via `Record<Variant,
      string>`.
- [ ] No nested ternaries (including in `className` strings).

### Naming & exports
- [ ] `kebab-case` files, `PascalCase` components, named exports only.
- [ ] Cross-directory imports go through the alias/barrel, not deep relative paths.

### Language
- [ ] Code/identifiers in English; UI-facing strings in pt-BR.

> Not applicable here: public-API contract/versioning, server transactions,
> idempotency — this app consumes a backend, it does not author one. Skip those.

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
