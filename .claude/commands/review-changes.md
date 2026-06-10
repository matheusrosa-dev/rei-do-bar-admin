---
description: "Procedure for an independent review of changed files in the Rei do Bar Admin dashboard. Orchestrated by CLAUDE.md (Post-Implementation), run in a subagent; also invokable manually with /review-changes."
disable-model-invocation: true
---

# Code Review

Run this in a **fresh subagent context** — not the agent that wrote the code — so the review is independent and does not consume the implementation conversation's context. When it runs is decided by the **Post-Implementation** section of the root `CLAUDE.md`; this file is only the procedure.

## Scope
Only review files or directories that are **explicitly provided**. Do not infer, expand, or include additional files beyond what was passed.

## What to Review

For each changed file, analyze:
1. **TypeScript correctness** — no implicit `any`; `import type` for all type-only imports (`verbatimModuleSyntax`); local `type Props = {}` per file; `enum` for fixed API value sets; `as const` on fixed literals; no unused locals/parameters (Biome errors on these)
2. **React best practices** — correct hook usage, no state mutations, complete effect dependencies. The **React Compiler is enabled**, so flag *redundant* manual memoization (`useMemo`/`useCallback`/`memo`) rather than its absence
3. **Logic correctness** — edge cases covered, no off-by-one errors
4. **Data layer** — `useQuery` centralized in the route component; query keys include **every** dependency (params/filters) so caching is correct; mutations invalidate the right query keys and show a `sonner` toast on success; `response.data.data` unwrapped in the service `fn`
5. **Routing** — file-based conventions respected: named `Route` export, `(group)` / `$param` / `-` prefixes; list state stored in URL search params and validated in `-helpers/`; navigation through the router (not `window.location`, except intentional history-back)
6. **Forms** — schema/resolver/`Form`/`defaultValues` in a `*-form.ts`; `register` for native inputs and `Controller` for custom controls; errors surfaced via the `error` prop
7. **Component structure** — consistent with the relevant `AGENTS.md`; props extend native attribute types when wrapping native elements; variants use a `Record<Variant, string>` map (no nested ternaries)
8. **Styling** — Tailwind utility classes only; dark-theme default palette (no raw hex, no custom tokens); `twMerge` when a component merges an external `className`; conditional classes via template literals
9. **Naming & exports** — kebab-case files/dirs; named exports only (no default exports); barrels updated where applicable (`components`, `-partials`, `-helpers`, `services`, `models`, `interfaces`); helpers imported by full path (no barrel)
10. **Path aliases** — `@components` / `@services` / `@shared/*` used for cross-boundary imports instead of long relative paths
11. **Dead code** — unused imports, variables, or unreachable branches

## Procedure

### 1. Read directory conventions
Before reviewing files in any directory, read the `AGENTS.md` in that directory if one exists. Always read the root `AGENTS.md` first.

### 2. Read every provided file
Read the full content of each file or directory explicitly passed. If a directory is provided, read all source files (`.ts`, `.tsx`) within it.

### 3. Read related files for context
Load relevant interfaces, models, service types, or sibling components when needed to understand the code — but do NOT add them to the "Files reviewed" list.

### 4. Identify issues by severity
Group findings as **Critical**, **Warning**, or **Suggestion**.

### 5. Return the structured review

```
## Code Review

### Files reviewed
- path/to/file.tsx

### Critical (must fix)
- [file:line] Description of the issue and why it's a problem

### Warning (should fix)
- [file:line] Description of the issue

### Suggestion (optional improvement)
- [file:line] Description of the suggestion

### Summary
Overall assessment in 1-2 sentences.
```

If no issues are found, explicitly confirm the code looks good.

## Constraints
- DO NOT edit any files
- DO NOT implement fixes — only describe them
- DO NOT approve changes without reading the actual file contents
- DO NOT review files that were not explicitly provided
