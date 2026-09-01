# shared/services/ — AGENTS.md

Scope rules for the API / data-access layer. Read together with the root
`AGENTS.md`.

## Scope

All HTTP communication with the backend: request argument shapes and response
types per endpoint, stable query-key strings for reads, and the single typed
Axios instance with its auth + error interceptor. The layer stays
React-Query-free — it exposes plain async functions and keys, while
`useQuery`/`useMutation` live in routes. No UI, navigation, or per-call toasts
(global API-error toasts happen once, in the interceptor). Entity definitions are
imported from the shared models, never declared here.

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
- Build request bodies from entity types with `Pick`/`Omit` when the body is a
  subset of the entity. Declare the shape literally when it is not — write-only
  fields (never present on the entity) or a payload nested differently from it.
- Type paginated responses through the generic pagination interface.
- Constrain enum-like query params (sort keys, directions) with string-literal
  unions / shared enums, not loose `string`.
- A response field the API can leave without a value is an explicit `| null`
  union mirroring the payload, never an optional `?` property — a metric that has
  no value for the requested period arrives as `null`, not absent, and `null` is
  distinct from a zero the backend actually measured.

### Simplified list reads
- A domain that feeds a select/multi-select field exposes a `get<Domain>Simple`
  read alongside its paginated `get<Domain>s`: hits `` `${baseUrl}?simple=true` ``
  and returns a bare entity array (no pagination envelope) — either `IEntity[]` or
  a trimmed `Omit<IEntity, …>[]` projection — for callers that just need the full
  option list.

### REST conventions
- Group endpoints under the domain `baseUrl`.
- Method semantics: `GET` read, `POST` create, `PUT` full update, `PATCH`
  partial update, `DELETE` remove.
- Domain actions are expressed as a **path suffix**, either on a single resource
  (`:id/activate`, `:id/password`) or on the collection, when the action hits
  every record at once (`/revoke-access`). They keep the verb the backend defines
  for them: `PATCH` for a state flip, `PUT` when the action fully replaces a
  field, `POST` when it carries no body. A `204` action returns nothing — `await`
  the call without unwrapping `response.data.data`.
- A suffix on the collection also names a **read** — an alternate projection of
  the list, or a derived answer about it as a whole (a flag the UI needs before
  offering a collection-wide action). It stays a `GET`, takes no path params, and
  is returned as `{ fn, key }` like any other read.
