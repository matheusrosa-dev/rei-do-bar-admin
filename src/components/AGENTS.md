# Components Directory

This directory contains **shared, reusable UI components** that are **domain-agnostic** — controlled entirely through props, with no knowledge of any feature or business logic. A component belongs here when it is (or could be) used by more than one route/feature. A component specific to a single feature belongs in that feature's `-partials/` instead.

---

## Organization

Components are grouped into category subfolders by role:

- `form/` — form controls (text input, currency/number input, select, toggle, textarea, button, ...)
- `modal/` — modal primitives built on Radix Dialog
- `page/` — page-level state components (wrapper, loading, error)
- `table/` — the headless data-table compound component and its `partials/`

Simple components are a **single `.tsx` file** at the root of this directory. A component that grows (like the table) becomes a **folder** with an `index.tsx` entry and, when needed, a local `partials/` barrel.

---

## Exports & Barrel

- All components are **named exports**.
- The root `index.ts` barrel re-exports every public component, so consumers always import from `@components` — never a deep path. **Keep the barrel in sync** as components are added or removed.

```ts
import { Button, Input, Table } from "@components";
```

---

## Component Patterns

### Props
Local `type Props` per file, **not exported**. A component that wraps a native element extends that element's HTML attributes so all native props pass through:

```ts
type Props = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant };
```

### Variants
Variant styling is a **`Record<Variant, string>` class map** indexed by a `variant` prop — never nested ternaries:

```ts
const variantClasses: Record<Variant, string> = {
  default: "bg-amber-500 text-black",
  danger: "bg-red-600 text-white",
};
```

### Compound components
A component with sub-parts exposes them as **static properties** on the root (e.g. `Table.Pagination = Pagination`), so consumers use `<Table>` and `<Table.Pagination>` from one import.

### Controlled wrappers
Wrappers around Radix primitives are fully controlled — they take `value`/`checked` and an `onChange`/`onCheckedChange` callback, plus optional `label`, `error`, and `disabled`, and expose nothing about the underlying primitive.

---

## Styling

- Tailwind utility classes via `className`; dark-theme **default palette**, no custom tokens (see `.claude/references/design-system.md`).
- Use **`twMerge`** whenever the component accepts an external `className`, so base and caller classes merge without conflicting utilities stacking.
- Conditional / state classes via template literals.
- Animations via **`motion/react`** (`motion.*`, `AnimatePresence`) — e.g. animated error reveal, modal enter/exit.
- Radix primitives (`@radix-ui/react-*`) are wrapped here, never consumed directly by features.

---

## Conventions

| Rule | Detail |
|---|---|
| Naming | kebab-case filename, `PascalCase` component name |
| Exports | Named export + re-export through the root barrel |
| Props | Local `type Props`, not exported; extend HTML attribute types when wrapping native elements |
| Variants | `Record<Variant, string>` class map — no nested ternaries |
| Styling | Tailwind `className`; `twMerge` for override-safe merging; no custom color tokens |
| Compound | Static property on the root component for sub-parts |
| Imports | `import type` for type-only imports |
