# AGENTS.md

System-wide overview of this repository. Read this before touching any code.
For scope-specific rules, also read the `AGENTS.md` inside the directory you are
working in (see [Folder Structure](#folder-structure)).

## Project Overview

Administrative dashboard ("admin") for the Rei do Bar product. It is a
single-page web application used internally to manage products, categories,
customers and their orders against a REST backend.

- **Platform**: Browser SPA (desktop-first, responsive down to mobile).
- **Paradigm**: File-based routing with feature-oriented route folders. UI is
  composed of a generic, reusable component layer plus per-feature route code.
- **Typing**: TypeScript in strict-null mode, bundler module resolution,
  `verbatimModuleSyntax` enabled (type-only imports are mandatory).
- **State model**: Server state lives in TanStack Query; UI/filter state lives
  in the URL (typed search params) and local component state. There is no global
  client store.

## Technology Stack

One line per library describing how it is used **here**, not its generic
definition.

### Core
| Library | Role here |
| --- | --- |
| React 19 | UI runtime. Function components only. |
| React Compiler | Enabled via Babel preset in the Vite build; do not hand-write `useMemo`/`useCallback` for things the compiler already optimizes. |
| TypeScript | Strict typing; `import type` enforced by `verbatimModuleSyntax`. |

### Routing
| Library | Role here |
| --- | --- |
| TanStack Router | File-based routes under the routes directory, with automatic code-splitting. The route tree is generated — never edit the generated tree file. |

### Data & Server State
| Library | Role here |
| --- | --- |
| TanStack Query | All server reads (`useQuery`) and writes (`useMutation`); cache invalidation after mutations. |
| Axios | Single typed instance for HTTP. Wraps every response as `{ data: T }` and centralizes auth + error toasts via interceptor. |
| TanStack Table | Headless table model behind the generic table component. |

### Forms & Validation
| Library | Role here |
| --- | --- |
| React Hook Form | Form state and submission for create/edit screens. |
| Yup + @hookform/resolvers | Schema validation; schema + inferred type + resolver live together in a per-feature form module. |

### UI & Styling
| Library | Role here |
| --- | --- |
| Tailwind CSS v4 | Utility-first styling, configured CSS-first (no `tailwind.config`); imported through the Vite plugin. Dark theme only. |
| tailwind-merge | Merges incoming `className` overrides with base classes in reusable components. |
| Radix UI | Accessible primitives (dialog, select, switch, tooltip) wrapped by local components. |
| Motion (`motion/react`) | Enter/exit animations for overlays, modals and error messages. |
| React Icons | Icon set across navigation, buttons and fields. |
| Sonner | Toast notifications for success and API error feedback. |

### Tooling
| Tool | Role here |
| --- | --- |
| Vite | Dev server and build (`tsc -b` typecheck + bundle). |
| Biome | Linter + formatter (2-space indent, double quotes). The single source of style truth. |
| Husky | Git hooks. |

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
