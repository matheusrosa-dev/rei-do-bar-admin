---
description: "Procedure to audit AGENTS.md files against the actual codebase. Orchestrated by CLAUDE.md (Post-Implementation); also invokable manually with /review-agents-docs."
disable-model-invocation: true
---

# Review AGENTS.md Documentation

## Scope

Only review `AGENTS.md` files that are **directly relevant to the provided files**. For each provided file, check its parent directory for a `AGENTS.md`. Do not search for, infer, or expand to other directories. Skip directories that do not contain a `AGENTS.md` file.

---

## Purpose

Audit the `AGENTS.md` files of the provided directories against the actual codebase state. Detect:

1. **Stale content** — things documented that no longer exist, are no longer used, or have changed
2. **Missing content** — new patterns, libraries, conventions, or structural decisions not yet documented

---

## Procedure

### Step 1 — Derive directories from provided files

For each provided file, extract its parent directory. Deduplicate the resulting list. For each unique directory, check whether a `AGENTS.md` file exists. Skip directories that do not have one and inform the user which were skipped.

> Note: route directories nest documentation. The nearest `AGENTS.md` for a file under `routes/` is the one at `src/routes/`, since feature folders (`-partials/`, `-helpers/`, etc.) do not carry their own.

### Step 2 — For each AGENTS.md, explore its scope

Identify the directory the file covers (its parent folder). Use a read-only subagent (Explore) to thoroughly examine the **actual current state** of that directory:

- All files present and their roles
- Libraries and imports in use
- Naming conventions observed in the actual code
- TypeScript patterns actually in use (`Props` typing, named exports, `as const`, `import type`, enums, etc.)
- Styling patterns (Tailwind utility usage, `twMerge`, palette/role usage, conditional classes)
- Export patterns (barrel files, named exports, no default exports)
- Any patterns that differ from what the AGENTS.md describes

Also check root config files (`package.json`, `tsconfig.app.json`, `biome.json`, `vite.config.ts`, `index.css`) when reviewing the root AGENTS.md.

### Step 3 — Read each AGENTS.md

Read the full content of each AGENTS.md file being reviewed.

### Step 4 — Cross-reference: identify discrepancies

Compare the AGENTS.md content against the actual codebase findings:

**Stale content to flag:**
- Libraries or tools documented that are no longer in `package.json`
- Patterns described that no files actually follow
- Folder structures or naming conventions documented that differ from reality
- Rules that were superseded by new decisions

**Missing content to flag:**
- New libraries added to `package.json` that aren't documented
- New patterns consistently used in code but not described
- New directories or structural additions not reflected
- New conventions observed in multiple files that have no documentation

### Step 5 — Report findings

For each AGENTS.md reviewed, produce a clear report:

```
## [directory]/AGENTS.md

### Stale (document says X, but reality is Y)
- ...

### Missing (observed in code, not documented)
- ...

### Up to date
- [confirm if everything checks out]
```

### Step 6 — Apply updates

After showing the report, ask the user if they want to apply the suggested changes. If confirmed:

- Edit the AGENTS.md files to remove stale content and add the missing documentation
- Follow the same writing style already in each file (same language, same level of detail, no file/path references that could become stale)
- Do not add documentation for things that only appear in one file and may be incidental — only document stable patterns

---

## Key Rules for AGENTS.md Writing Style

When updating or extending AGENTS.md files, follow these rules (consistent with the project's established style):

- Write in **English**
- Do **not** reference specific file names, specific import paths, or concrete values — describe patterns, not instances
- Do **not** document incidental code choices — only document stable, intentional conventions
- Keep descriptions concise and actionable; use tables for convention summaries
- Preserve the heading/section structure already in the file unless reorganization is clearly needed

---

## Constraints
- DO NOT search for or include AGENTS.md files outside the directories derived from the provided files
- DO NOT review a directory not derived from the provided file list, even if it contains a AGENTS.md
- DO NOT apply updates without explicit user confirmation after the report
