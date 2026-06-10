---
description: Produce an approved visual spec before writing or changing any UI
---

# Design Spec (pre-implementation)

Run this **before writing any UI code** for the task. Goal: a small, approved
visual plan that keeps the implementation inside the existing design system.

## Protocol

1. **Read `.claude/references/design-system.md` first.** Everything below must use
   only the tokens and patterns defined there.
2. **Produce a compact visual spec** covering the items below.
3. **Wait for approval** of the spec before writing component code.
4. During implementation, **do not use any color, spacing, typography, or radius
   value that is not in the design system.** Any exception must be called out and
   approved explicitly.

## Spec contents

- **Components needed** — which existing shared components are reused, and what (if
  anything) genuinely needs to be new. Prefer reuse; flag new components for
  approval.
- **Layout** — which layout archetype it follows (page shell + content, filter bar
  + table, form layout, etc.) and how content is arranged.
- **Tokens** — the specific color / spacing / radius / typography tokens applied,
  by semantic name (not raw values).
- **Responsive behavior** — how it adapts from desktop down to mobile (what
  stacks, what hides, what the sidebar/menu does).
- **Interactive states** — default, hover, focus, disabled, error, and loading for
  each interactive element.
- **Accessibility** — minimum contrast, visible keyboard focus, labels for
  controls, and dialog focus handling for any overlay.

## Output format

```
## Visual Spec — <screen/feature>

Components: <reused> | New (needs approval): <none | …>
Layout: <archetype + arrangement>
Tokens: <semantic tokens used>
Responsive: <desktop → mobile behavior>
States: default / hover / focus / disabled / error / loading
A11y: <contrast, focus, labels>
```

Keep it short. Await approval before implementing.
