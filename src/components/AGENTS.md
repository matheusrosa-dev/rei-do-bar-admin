# components/ — AGENTS.md

Scope rules for the shared component layer. Read together with the root
`AGENTS.md`.

## What belongs here

Generic, **presentational, reusable-across-features** UI: form field
primitives, layout/page shells, overlays, and the generic data table. A
component belongs here only if it could be dropped into any feature without
modification.

## What does NOT belong here

- Components tied to a single route or feature → they live in that route's
  route-local folder.
- Data fetching, mutations, or query keys → that is the route/service layer's job.
- Knowledge of a specific domain entity (a component must not reference a concrete
  business model by name; it receives generic, typed props).
- Business rules or validation logic.

## Internal structure

- Components are grouped into sub-folders by concern (form fields, overlays, page
  shells, table). Loose top-level components are allowed for one-off widgets.
- One component per file; the file is named after the component in `kebab-case`.
- Composite components keep their sub-pieces in a local `partials/` sub-folder
  with its own barrel.
- The directory barrel re-exports the public component surface. Consumers import
  from the alias, never by deep relative path.

## Code patterns

- **Props**: declare a local `type Props`. For components that wrap a native
  element, extend its HTML attributes and add the extra props:

  ```tsx
  type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: Variant;
  };
  ```

- **className override**: any component that accepts external `className` merges
  it last with `twMerge`, so callers can override base styles.

- **Variants**: model visual variants as a string-literal union plus a
  `Record<Variant, string>` class map — never branch styling with nested
  ternaries.

  ```tsx
  type Variant = "default" | "secondary" | "danger";
  const variantClasses: Record<Variant, string> = { /* … */ };
  ```

- **Radix wrappers**: components built on Radix expose a minimal, controlled API
  (`value`/`onChange`, `checked`/`onCheckedChange`, `isOpen`/`onClose`) and hide
  Radix internals from consumers.

- **Form fields** follow a consistent shape: a label, the control, and an
  animated error slot. The error message animates in/out with `AnimatePresence`
  (height + opacity) and is suppressed while the field is disabled.

- **Controlled vs. native**: native-backed fields spread `{...props}` so they
  work with React Hook Form's `register`; richer fields (currency, select)
  expose explicit `value`/`onChange` for use with `Controller`.

- **Compound components**: related sub-components are attached as static
  properties (e.g. a table exposing its pagination as a namespaced member)
  rather than exported separately.

- **Stateless by default**: keep components presentational. Local UI state (open
  flags, transient input) is fine; server state and navigation are not.

## Conventions

| Rule | Detail |
| --- | --- |
| Reusability | Only feature-agnostic UI; no domain entity references. |
| Export | Named export, one component per file. |
| Props type | Local `type Props`; extend native HTML attrs when wrapping an element. |
| className | Merge external `className` last via `twMerge`. |
| Variants | Literal union + `Record<Variant, string>` map; no nested ternaries. |
| Radix | Wrap primitives behind a minimal controlled API. |
| Error display | Label + control + `AnimatePresence` error slot; hidden when disabled. |
| Styling source | Tailwind tokens only — see the design-system reference. |
| Data/Logic | No fetching, mutations, routing, or business rules. |
| UI strings | Portuguese (pt-BR); code in English. |
