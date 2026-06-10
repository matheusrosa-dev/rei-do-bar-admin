# shared/services/ — AGENTS.md

Scope rules for the API / data-access layer. Read together with the root
`AGENTS.md`.

## What belongs here

- All HTTP communication with the backend.
- Request argument shapes and response types for each endpoint.
- Stable query-key strings for reads.
- The single typed Axios instance and its auth + error-handling interceptor.

## What does NOT belong here

- React Query hooks (`useQuery`/`useMutation`) → those live in routes. This layer
  exposes plain async functions (and keys), not query subscriptions.
- UI, toasts triggered per-call, or navigation. (Global API-error toasts are the
  one exception, handled once in the shared instance interceptor.)
- Domain entity definitions → the shared models. Services **import** entities.

## Internal structure

- **One folder per backend domain.** Each domain folder holds:
  - an `index.ts` exposing a single `use<Domain>Service` hook, and
  - a `types.ts` declaring the function type of every operation plus the hook's
    return type.
- The layer root holds the shared typed Axios instance and its Axios type
  augmentation.
- The directory barrel re-exports the per-domain service hooks.

## Code patterns

### Service hook shape
A `use<Domain>Service` is a plain factory hook returning an object of operations.
Define a local `baseUrl` for the domain, then one async function per endpoint:

```ts
export const useThingService: UseThingService = () => {
  const baseUrl = "/things";

  const getThing: GetThing = async (id) => {
    const response = await api.get<Thing>(`${baseUrl}/${id}`);
    return response.data.data;
  };
  // …
};
```

### Reads vs. writes in the return value
- **Reads that feed a query key** are returned as `{ fn, key }`, where `key` is a
  stable `kebab-case` string. Routes spread `key` into their query key and call
  `fn` in the query function.
- **Writes** (create/update/activate/remove/…) are returned as **bare async
  functions**, consumed directly by `useMutation`.

### Typed Axios + response unwrapping
- Use the shared typed instance. Every response is wrapped by the backend as
  `{ data: T }`, so operations return `response.data.data`.
- Pass the payload type as the method generic (`api.get<T>`, `api.post<T>`).
- **Do not** add per-call `try/catch` or error toasts — the shared interceptor
  reports API errors globally. Let errors reject so callers can react.

### Operation types
- Each operation has a named function type in `types.ts` (e.g. one per action).
- Build request bodies from entity types with `Pick<IEntity, …>` rather than
  re-declaring fields.
- Type paginated responses through the generic pagination interface.
- Constrain enum-like query params (sort keys, directions) with string-literal
  unions / shared enums, not loose `string`.

### REST conventions
- Group endpoints under the domain `baseUrl`.
- Method semantics: `GET` read, `POST` create, `PUT` full update, `PATCH`
  partial update / domain action (action expressed as a path suffix), `DELETE`
  remove.

## Conventions

| Rule | Detail |
| --- | --- |
| One file per domain | `index.ts` (hook) + `types.ts` (operation types). |
| Hook | `use<Domain>Service` factory returning the operations object. |
| Reads | `{ fn, key }`, stable `kebab-case` key for query keys. |
| Writes | Bare async functions for `useMutation`. |
| HTTP client | Shared typed Axios instance; return `response.data.data`. |
| Errors | Handled globally by the interceptor; no per-call `try/catch`/toast. |
| Bodies | `Pick<IEntity, …>`; paginated reads via the pagination generic. |
| Params | Literal-union / enum types for sort keys and directions. |
| No hooks here | No `useQuery`/`useMutation`; this layer stays React-Query-free. |
