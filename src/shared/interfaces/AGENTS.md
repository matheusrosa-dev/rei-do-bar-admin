# Interfaces Directory

This directory contains **cross-cutting structural types** — generic, domain-agnostic shapes that describe how the API frames data, independent of any specific entity.

---

## What Belongs Here vs. Models

- **Here:** generic envelopes and shared enums reused across resources — e.g. the pagination wrapper (parameterized over the entity it contains) and the sort-direction enum.
- **`models/`:** concrete domain entities (the actual resources).

The test: if a type is **parameterized over an entity** (`Thing<T>`) or applies to **every resource**, it belongs here; if it describes one entity's fields, it belongs in `models/`.

---

## Conventions

| Rule | Detail |
|---|---|
| File naming | One file per concern, **kebab-case** |
| Generic types | Entity-agnostic — parameterize over `T` rather than referencing a model |
| Enums | `PascalCase`, exported as **values** |
| Exports | **Named exports** only |
| Barrel | `index.ts` re-exports each file with `export *` |
| Imports | `import type` for type-only imports |
