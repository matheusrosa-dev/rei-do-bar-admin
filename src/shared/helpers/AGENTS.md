# Helpers Directory

This directory contains **pure utility functions** — stateless, framework-agnostic helpers (formatting and transforms) shared across features.

---

## What Belongs Here

- Pure value transforms and formatters (e.g. currency, phone, date, document masks)
- No React, no state, no side effects

Logic specific to a single feature belongs in that feature's own `-helpers/`, not here.

---

## Imports — No Barrel

Unlike the other shared folders, `helpers/` has **no barrel `index.ts`**. Import each helper by its full path so the module boundary stays explicit:

```ts
import { formatPrice } from "@shared/helpers/number";
```

---

## Conventions

| Rule | Detail |
|---|---|
| File naming | One file per concern, **kebab-case** (e.g. `number`, `string`) |
| Exports | **Named exports** only |
| Purity | No side effects, no React, no global state |
| Typing | Parameters are explicitly typed |
| No barrel | Import by full path; do **not** add an `index.ts` |

---

## Example

```ts
// number.ts
export const formatPrice = (value: number) => {
  const valueInCents = value / 100;

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(valueInCents);
};
```
