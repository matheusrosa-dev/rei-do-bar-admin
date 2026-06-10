# Routes Directory

This directory holds all **routes and their feature-scoped code**, following TanStack Router's **file-based routing**. The folder structure maps directly to the application's URL structure. Each route file is the **orchestrator** of its feature: it owns data fetching and composes feature-scoped partials, while reusable UI comes from `@components`.

---

## Routing Model

- TanStack Router discovers routes from this directory; the Vite router plugin regenerates `routeTree.gen.ts`. **Never edit that generated file by hand.**
- Every routable file exports a `Route` created with `createFileRoute(...)` (the app shell uses `createRootRoute`). The route's `component` is a **local function**, not exported.
- The root route defines the **app shell** (sidebar + `<Outlet />`).
- `(group)` directories are **route groups**: they share structure without adding a URL segment (e.g. a `(list)` group for a resource's index screen).
- `$param` files are **dynamic segments**; read the value with `Route.useParams()`.

---

## Feature-Scoped Folders (the `-` prefix)

TanStack Router ignores files and folders whose name starts with `-`, so they hold a feature's private code without becoming routes:

| Folder / file | Holds |
|---|---|
| `-partials/` | Feature-scoped components, aggregated by a barrel `index.ts` |
| `-helpers/` | Feature-scoped pure functions (e.g. search-param validation), barrel `index.ts` |
| `-shared/` | Code shared between **sibling routes** of the same resource (e.g. a form schema reused by create + edit) |
| `-types.ts` | Feature-scoped types |

A partial that grows beyond a single file becomes a **subfolder** with its own `index.tsx`, and may recursively nest its own `partials/`, `types.ts`, and `form.ts`. Partials are never imported by another feature — if one needs to be reused, promote it to `@components`.

---

## The Route Component

The route component orchestrates its feature:

- **Owns all `useQuery` calls** — data fetching is centralized in the route component and passed to partials as props (`data`, `meta`, `isLoading`, `isError`).
- Reads and writes URL **search params** for list state (page, filters, sort) via `Route.useSearch()` and `navigate({ search })`. Search params are validated by a `validateSearch` function defined in `-helpers/`.
- Composes the screen with `PageWrapper` and shared components from `@components`.

### Page States

Two patterns coexist, by screen type:

- **Detail / form screens** use **early returns** for loading and error with the shared `PageLoading` / `PageError` components, rendering the `PageWrapper` body only on success.
- **List screens** keep the `PageWrapper` mounted and pass `isLoading` / `isError` into the table, which renders its own loading, error, and empty bodies.

### Mutations

`useMutation` lives in the **partial that triggers the action** (e.g. the table that owns a row's delete or status toggle), not necessarily the route component. On success, show a `sonner` toast and invalidate the affected query keys with `queryClient.invalidateQueries`.

---

## Forms

Forms use **react-hook-form**:

- The yup **schema**, the `resolver` (`yupResolver`), the inferred `Form` type, and `defaultValues` live in a dedicated **`*-form.ts`** file — placed in `-shared/` when the same form is used by both create and edit.
- **Native inputs** are wired with `form.register(...)`; **custom controls** (currency input, select, etc.) are wired with `Controller`.
- Field errors come from `form.formState.errors` (register) or `fieldState.error` (Controller) and are passed to the component's `error` prop.

```ts
// -shared/some-form.ts
export type Form = yup.InferType<typeof schema>;
export const defaultValues: Form = { /* ... */ };
export const resolver = yupResolver(schema) as Resolver<Form>;
```

---

## Conventions

| Rule | Detail |
|---|---|
| File naming | kebab-case; `(group)`, `$param`, and the `-` prefix per TanStack Router |
| Route export | Named `Route` from `createFileRoute`; component is a local function — **no default export** |
| Data fetching | `useQuery` in the route component; results passed to partials as props |
| Mutations | `useMutation` in the partial that owns the action; invalidate query keys + toast on success |
| List state | Stored in URL search params, validated in `-helpers/` (`validateSearch`) |
| Feature code | Lives under `-partials/`, `-helpers/`, `-shared/`, `-types.ts`; never imported by another feature |
| Forms | `*-form.ts` holds schema/resolver/`Form`/`defaultValues`; `register` for native, `Controller` for custom controls |
| Shared UI | Import from `@components`; never import another feature's partials |
| Imports | `import type` for type-only imports |
