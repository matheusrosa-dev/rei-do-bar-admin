# AGENTS.md

System-wide overview of this repository. Read this before touching any code.
For scope-specific rules, also read the `AGENTS.md` inside the directory you are
working in (see [Folder Structure](#folder-structure)).

## Project Overview

Administrative dashboard ("admin") for the Rei do Bar product: a browser SPA
(desktop-first, responsive down to mobile) used internally to manage products,
categories, customers and their orders against a REST backend. File-based
routing with feature-oriented route folders, over a generic reusable component
layer. TypeScript runs in strict-null mode with `verbatimModuleSyntax`. Server
state lives in TanStack Query and UI/filter state in the URL plus local component
state — there is no global client store.

## Technology Stack

Only what changes a decision; the rest is in `package.json`.

- **React Compiler** runs in the build — do not hand-write `useMemo`/
  `useCallback` for what it already optimizes.
- **TanStack Router**: file-based routes; the route tree file is generated, never
  hand-edited.
- **TanStack Query** owns every server read and write, plus invalidation.
- **Axios**: one typed instance; the backend wraps every response as
  `{ data: T }`; auth and error toasts live in its interceptor.
- **React Hook Form + Yup**: schema, inferred type and resolver together in a
  per-feature form module.
- **Tailwind v4**, CSS-first — no `tailwind.config`, dark theme only; merge
  incoming `className` with `tailwind-merge`.
- **Radix UI** is always behind a local wrapper, never used raw.
- **Recharts** colors arrive as props from a constant of theme color variables,
  never a raw hex.
- **Motion**, **Sonner** and **React Icons** are the animation, toast and icon
  libraries — do not add a second of any.
- **Biome** is the single source of style truth (2-space indent, double quotes).

> **Installed but currently unused:** `zustand` is a dependency but no store
> exists in the codebase. Do not introduce global client state without
> confirmation — prefer URL search params + local state + TanStack Query.

## Folder Structure

Source lives under `src/`. Tree below is commented by responsibility, not by
individual files. Directories marked **[AGENTS.md]** carry their own
scope-specific conventions — read them before working there.

```
src/
├── components/        # Generic, reusable, presentational UI [AGENTS.md]
│   ├── form/          #   Form field primitives (inputs, select, button, toggle…)
│   ├── modal/         #   Base modal + confirmation modal
│   ├── page/          #   Page-level shells (wrapper, loading, error states)
│   └── table/         #   Generic data-table built on TanStack Table
├── routes/            # File-based routes + feature code [AGENTS.md]
│   └── <feature>/     #   One folder per feature; sub-routes + route-local code
├── shared/            # Cross-cutting non-UI code
│   ├── services/      #   API/data-access layer, one folder per domain [AGENTS.md]
│   ├── models/        #   Domain entity types
│   ├── interfaces/    #   Generic cross-domain types
│   └── helpers/       #   Pure formatting/utility functions
│                      #   (models + interfaces + helpers share one [AGENTS.md])
├── main.tsx           # App bootstrap: providers (Query, Router, Toaster)
└── index.css          # Tailwind import + global theme (fonts, scrollbars)
```

## Global Conventions

### Naming
| Subject | Rule |
| --- | --- |
| Files & folders | `kebab-case` for files and folders. |
| Components | `PascalCase` component names. |
| Hooks | `camelCase` starting with `use`. |
| Domain types/interfaces | `PascalCase` prefixed with `I` (e.g. an order entity). |
| Function/behavior types | `PascalCase` named after the action. |
| Constants | Module-level config values in `SCREAMING_SNAKE_CASE`. |

### Exports
- **Named exports only.** Default exports are not used anywhere in the codebase.
- **Barrel files (`index.ts`)** re-export the public surface of a directory.
  Cross-directory imports go through the barrel/alias; deep relative paths into
  another directory's internals are avoided.

### TypeScript
- `import type` is mandatory for type-only imports (`verbatimModuleSyntax`).
- Use `type` for component props and unions; use `interface` for domain entities
  and API response shapes.
- Unused imports/variables are build errors — keep them out.

### Path Aliases
| Alias | Points to |
| --- | --- |
| `@components` | The components barrel. |
| `@services` | The services barrel. |
| `@shared/*` | Anything under the shared directory by sub-path. |

Prefer aliases over long relative climbs (`../../../`).

### Styling
- Tailwind utility classes inline on elements. No CSS modules, no styled
  components, no `tailwind.config`.
- Reusable components that accept a `className` merge it with `twMerge` so callers
  can override.
- Variant-driven styling uses a `Record<Variant, string>` class map.
- Dark theme only; see `.claude/references/design-system.md` for the token set.

### Language
- **Code** (identifiers, types, comments) in **English**.
- **UI-facing strings** (labels, placeholders, toasts, validation messages) in
  **Portuguese (pt-BR)**. Route path segments are also Portuguese.
- AI/docs files (`*.md`, this file) in **English**.
