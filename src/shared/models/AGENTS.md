# Models Directory

This directory contains **shared domain interfaces** — TypeScript types that describe the API entities used across the service layer and the feature layer.

---

## What Belongs Here

- Interfaces for API response entities
- Enums for fixed API value sets (e.g. a status or payment type)
- Types referenced by **both** the services layer and the routes/components layer

Types scoped to a single feature live in that feature's own `-types.ts`, not here.

---

## Conventions

| Rule | Detail |
|---|---|
| File naming | One file per domain area, **kebab-case**; closely related entities may share a file |
| Interface naming | `PascalCase` prefixed with `I` (e.g. entity interfaces) |
| Enum naming | `PascalCase`, no prefix; exported as **values** through the barrel |
| Extension interfaces | A "with relation" entity extends its base in the **same file** (e.g. `IXWithY extends IX`) |
| Exports | **Named exports** only |
| Barrel | `index.ts` re-exports each file with `export *` |
| Imports | `import type` at usage sites for interfaces |

---

## Example

```ts
// entity-name.ts
export interface IEntity {
  id: string;
  name: string;
}

export enum EntityStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

// An entity returned with a joined relation extends the base in the same file
export interface IEntityWithRelation extends IEntity {
  relation: IRelation;
}
```
