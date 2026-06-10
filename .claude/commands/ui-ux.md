---
description: "Procedure to produce a Visual Spec before implementing a UI change in the Rei do Bar Admin dashboard. Orchestrated by CLAUDE.md (Pre-Implementation); also invokable manually with /ui-ux."
disable-model-invocation: true
---

# UI/UX Design

This command runs **before any code is written**. It produces a **Visual Spec** — a component-by-component description of exactly how the UI will look — that becomes the visual contract for the implementation.

When it runs is decided by the **Pre-Implementation** section of the root `CLAUDE.md`; this file is only the procedure.

## Procedure

### 1. Read the design system reference
Load [`.claude/references/design-system.md`](.claude/references/design-system.md). This is mandatory. Do not produce a spec without it. The system is **convention-based** (the default Tailwind palette on a dark theme) — there are no custom tokens, so every value must map to a documented **palette role** and utility class.

### 2. Understand the task context
Identify from the task description:
- Which page / feature / component is being built or changed
- What it needs to show (data, actions, states: loading, error, empty)
- Whether it follows an existing archetype (page wrapper, filters bar, data table, form, modal, badge, etc.)

### 3. Identify applicable archetypes and roles
From the design system reference, determine:
- Which **layout archetype** fits (app shell, page, filters bar, data table, form, modal)
- Which **palette roles** apply (accent, surface, border, muted text, danger, status)
- Which **typography** applies (weight + size utilities)
- Which **shape** applies (`rounded-lg` / `rounded-xl` / `rounded-full`)
- Which **interaction** patterns apply (hover, focus ring, disabled, motion enter/exit)

### 4. Produce the Visual Spec

Output a single `## Visual Spec` block. Describe **every component and sub-component individually**, from outermost container to innermost element. For each, specify:

- **Layout**: flex/grid direction, alignment, padding, margin, gap
- **Shape**: border-radius utility
- **Background**: palette role + utility class (e.g. surface → `bg-white/5`)
- **Border**: utility (e.g. `border border-white/10`)
- **Typography**: weight + size + color utility (one line per text node)
- **Icons**: `react-icons` set + name + size + color utility
- **States**: loading / error / empty / disabled / active, and the exact classes for each
- **Interaction**: hover, focus ring, `disabled:` classes, and any `motion/react` enter/exit
- **Tailwind classes**: the exact `className` string for the element

## Output Format

The spec must follow this structure. Replace brackets with actual values.

```
## Visual Spec

### [ComponentName]

**Outer container**
- Layout: `h-full flex flex-col` | role: page background
- No border

**[Sub-section] (e.g. Header, Card, Row, Field)**
- Container: `flex items-center justify-between px-5 h-18 border-b border-white/10 bg-white/3`
- Title: `text-white font-bold text-lg tracking-tight`
- Muted label: `text-gray-400 text-sm`

**[Interactive element] (e.g. Button)**
- Base: `bg-amber-500 not-disabled:hover:bg-amber-400 text-black rounded-lg py-2.5 px-4 text-sm font-semibold`
- Disabled: `disabled:opacity-50 disabled:cursor-not-allowed`

**States**
- Loading: amber spinner on `border-zinc-700` track, centered
- Error: `PageError` (detail screens) or the table's error body (lists)
- Empty: the table's empty body
- Danger action: `bg-red-600 not-disabled:hover:bg-red-500 text-white`
```

## Rules

- Output the Visual Spec **before** any implementation starts. Do not write code in this step.
- Every element must reference a **palette role and utility class** from the design system — no raw hex values, no invented colors.
- Prefer reusing an existing shared component from `@components` over re-describing one from scratch; only spec new markup for genuinely new UI.
- If the task requires a pattern not covered by the design system, flag it explicitly as "**New pattern needed**" and propose the closest existing role/utility as the basis.
- The spec is the single source of truth for the visual implementation. Deviations require a spec update first.
