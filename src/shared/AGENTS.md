# shared/ — AGENTS.md

Scope rules for the non-UI shared layer: **models**, **interfaces**, and
**helpers**. (The `services/` sub-folder is its own data-access layer with a
dedicated `AGENTS.md` — do not apply these rules there.) Read together with the
root `AGENTS.md`.

## What belongs here

| Sub-folder | Holds | Barrel |
| --- | --- | --- |
| `models/` | Concrete domain **entity** types (the nouns the app manages). | Wildcard re-export barrel. |
| `interfaces/` | **Generic, cross-domain** structural types not tied to one entity. | Wildcard re-export barrel. |
| `helpers/` | **Pure** utility/formatting functions. | No barrel — imported by direct sub-path. |

## What does NOT belong here

- HTTP calls, query keys, request/response types → the services layer.
- React components, hooks, JSX, or any browser/DOM side effects.
- Business workflows or stateful logic. These are types and pure functions only.

## models/ vs. interfaces/

- A **model** describes a specific business entity and is `I`-prefixed. Models
  compose by `extends` (a richer view extends the base entity) rather than
  duplicating fields.
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
- Exported as named `function` declarations, grouped by subject into a single
  file per subject area.
- Locale-aware formatting uses the platform `Intl` / locale APIs with the app
  locale (pt-BR) and returns display strings. Formatting helpers never throw on
  unexpected input — they degrade to the original/empty value.
- Imported by direct sub-path (no barrel), since each subject file is consumed
  independently.

## Conventions

| Rule | Detail |
| --- | --- |
| models | `I`-prefixed entity types; compose via `extends`; barreled. |
| interfaces | Generic/structural types (`T`-parameterized or cross-domain); barreled. |
| Nullability | Explicit `\| null` to mirror the API payload. |
| Primitives | Ids/timestamps as `string`; enumerable values as enum/union. |
| helpers | Pure, named `function` exports; locale = pt-BR; no barrel. |
| Boundaries | No HTTP, no React, no side effects, no business workflows. |
