# components/ — AGENTS.md

Scope rules for the shared component layer. Read together with the root
`AGENTS.md`.

## Scope

Generic, **presentational** UI — form field primitives, layout/page shells,
overlays, the generic data table. A component belongs here only if it could be
dropped into any feature without modification: no data fetching, mutations or
query keys, no business rules or validation, and no reference to a concrete
domain entity by name (props are generic and typed). Anything tied to a single
route lives in that route's route-local folder.

## Internal structure

- Components are grouped into sub-folders by concern (form fields, overlays, page
  shells, table). Loose top-level components are allowed for one-off widgets.
- One component per file, named after the component.
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
