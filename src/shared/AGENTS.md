# shared/ — AGENTS.md

Scope rules for the non-UI shared layer: **models**, **interfaces**, and
**helpers**. (The `services/` sub-folder is its own data-access layer with a
dedicated `AGENTS.md` — do not apply these rules there.) Read together with the
root `AGENTS.md`.

## Scope

| Sub-folder | Holds | Barrel |
| --- | --- | --- |
| `models/` | Concrete domain **entity** types (the nouns the app manages). | Wildcard re-export barrel. |
| `interfaces/` | **Generic, cross-domain** structural types not tied to one entity. | Wildcard re-export barrel. |
| `helpers/` | **Pure** utility/formatting functions. | No barrel — imported by direct sub-path. |

Types and pure functions only: no HTTP calls or query keys (those are the
services layer), no React components, hooks, JSX or DOM side effects, and no
business workflows or stateful logic.

## models/ vs. interfaces/

- A **model** describes a specific business entity and is `I`-prefixed. Models
  compose by `extends` (a richer view extends the base entity) rather than
  duplicating fields.
- A richer view is named after **what it adds** — `I<Entity>With<X>` — not after
  the endpoint that returns it. A paginated list whose items carry more than the
  base entity is typed with such a view, not with the base entity.
- An **interface** is reusable across domains and structural (e.g. a generic
  pagination envelope, a sort direction). If a type is parameterized by `T` or
  applies to any entity, it is an interface, not a model.

### Modeling rules
- Optional/absent values are explicit unions with `null` (matching the API),
  not optional `?` properties, unless the field is genuinely optional in the
  payload.
- Timestamps and ids arrive as `string` (ISO / opaque id), not `Date`/`number`.
- Enumerable directions/states use a shared enum or literal union, declared once
  in interfaces and reused.

## helpers/ rules

- **Pure and stateless**: same input → same output, no mutation of arguments, no
  I/O, no React.
- Named exports grouped by subject into a single file per subject area, matching
  the declaration style already in that file (`function` declaration or `const`
  arrow). A subject file may also export constant lookup maps beside its
  functions.
- Locale-aware formatting uses the platform `Intl` / locale APIs with the app
  locale (pt-BR) and returns display strings. Formatting helpers never throw on
  unexpected input — they degrade to the original/empty value.
- Imported by direct sub-path (no barrel), since each subject file is consumed
  independently.
