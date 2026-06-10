# Services Directory

This directory contains the **data-fetching layer** — hooks that communicate with the API and expose query keys, fetch functions, and mutation functions for use with `@tanstack/react-query`.

---

## Structure

```
services/
  api.ts        Typed axios instance shared by all services
  types.ts      Shared service-layer types (response envelope, typed instance, error)
  index.ts      Barrel — re-exports all service hooks
  <resource>/
    index.ts    The service hook
    types.ts    Operation signatures + the Use<Resource>Service type alias
```

---

## Service Hook Pattern

Each resource exposes a **`use<Resource>Service`** hook that returns an object of operations. There are two operation shapes:

- **Query operations** are an object `{ fn, key }` — `fn` performs the request and `key` is the React Query key. Decoupling the key from the function lets both be passed to `useQuery` independently.
- **Mutation operations** are returned as plain async functions, passed directly as `mutationFn` to `useMutation`.

```ts
const { getProducts, createProduct } = useProductsService();

const { data } = useQuery({
  queryKey: [getProducts.key, page],
  queryFn: () => getProducts.fn({ page }),
});

const mutation = useMutation({ mutationFn: createProduct });
```

Each operation's signature is declared as a named type in the resource's `types.ts`, and the hook itself is typed with a `Use<Resource>Service` alias (`export const useResourceService: UseResourceService = () => {}`).

---

## API Instance (`api.ts`)

A single shared `api` instance is created from `axios` and cast to `TypedAxiosInstance`, which re-types `get`/`post`/`put`/`delete`/`patch`/`request` so every response is wrapped in `IApiResponse<T>`. Operations **unwrap `response.data.data`** inside `fn` and return the entity directly, so callers never handle the envelope.

- **Auth** is configured on the instance from `import.meta.env` (base URL plus credentials).
- A **response interceptor** surfaces API errors as `sonner` toasts (message + code) and then re-rejects, so callers still receive the rejected promise.

---

## Shared Types (`types.ts`)

- `IApiResponse<T>` — the response envelope (`{ data: T }`)
- `TypedAxiosInstance` — the generic-aware axios surface applied to the shared instance
- `IApiError` — an `AxiosError` carrying the typed error body (`{ code, message }`); use it when catching service errors

---

## Conventions

| Rule | Detail |
|---|---|
| File naming | **kebab-case** directories and files |
| Hook naming | `use<Resource>Service` |
| Service type | Each resource's `types.ts` defines a `Use<Resource>Service` alias that types the hook |
| Query operations | `{ fn, key }` shape |
| Mutation operations | Plain async function (used directly as `mutationFn`) |
| HTTP client | The shared `api` from `./api`; unwrap `response.data.data` inside `fn` |
| Barrel | Root `index.ts` re-exports all service hooks |
| Imports | `import type` for all type-only imports |
