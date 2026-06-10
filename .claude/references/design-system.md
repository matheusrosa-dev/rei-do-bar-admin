# Design System Reference — Rei do Bar Admin

The single source of truth for visual decisions in the admin dashboard. This system is **convention-based**: there are **no custom design tokens** and **no `tailwind.config.js`**. Everything is the **default Tailwind v4 palette applied on a dark theme**, so each value below is a **role** mapped to the utility classes the codebase consistently uses. Use the role, not a raw hex.

> The only hard-coded colors live in `index.css` (global page background and scrollbar). Component code must use the palette utility classes below — never inline hex.

---

## Color Roles

| Role | Utility classes | Used for |
|---|---|---|
| **Accent / primary** | `bg-amber-500` (hover `not-disabled:hover:bg-amber-400`), text on accent `text-black` | Primary buttons, checked toggle, spinner head |
| **Accent (text/border)** | `text-amber-400`, `border-amber-500`, `ring-amber-500`, `bg-amber-500/10` | Active labels, focus ring/border, active/selected control |
| **Surface — page** | `bg-black` (global), panels `bg-white/3`, raised `bg-white/5` | App background, headers, sidebar (desktop), wrappers, table |
| **Surface — control** | `bg-zinc-800` | Inputs, select trigger, select content |
| **Surface — overlay/raised** | `bg-zinc-900` (modal), `bg-neutral-950` (mobile sidebar) | Modal card, mobile drawer |
| **Scrim / overlay** | `bg-black/60`, `bg-black/50` | Modal backdrop, mobile sidebar backdrop |
| **Border / divider** | `border-white/10` (primary), `divide-white/5`, control `border-zinc-700` | Panel/header borders, table rows, input borders |
| **Text — primary** | `text-white` | Headings, primary values, button labels on dark |
| **Text — body** | `text-gray-200` | Table cell content |
| **Text — muted** | `text-gray-400` | Labels, counts, nav items, secondary icons |
| **Text — form label / secondary** | `text-zinc-300` | Field labels, secondary button, select item text |
| **Text — placeholder / faint** | `text-zinc-400`, `placeholder-zinc-500`, `text-zinc-500` | Placeholders, chevrons, faint icons |
| **Danger — action** | `bg-red-600` (hover `not-disabled:hover:bg-red-500`) `text-white` | Destructive buttons |
| **Danger — field error** | `border-red-500`, `bg-red-500/5`, `focus:ring-red-500`, message `text-red-500` | Invalid inputs/selects, error text |

### Status badge roles

| Variant | Classes |
|---|---|
| Active / success | `bg-green-500/15 text-green-400` |
| Inactive / negative | `bg-red-500/15 text-red-400` |
| Alert / warning | `bg-orange-500/15 text-orange-400` |

---

## Typography

- **Font:** Roboto (body, via `index.css`); Roboto Mono is also loaded and available for numeric/monospace contexts.
- **Weight is expressed via font-weight utilities** (`font-medium`, `font-semibold`, `font-bold`).

| Pattern | Classes | Context |
|---|---|---|
| Page / section / modal title | `text-lg font-bold` (+ `tracking-tight` on page titles) | Page header title, form section `h2`, modal title |
| Body / control text | `text-sm` | Inputs, buttons, select, nav items, descriptions |
| Field / nav label | `text-sm font-medium` | Form labels, secondary text |
| Table header | `text-xs font-semibold uppercase tracking-wider text-gray-400` | Column headers |
| Badge / meta / error | `text-xs` | Status badges, helper counts, field error messages |

---

## Shape & Border Radius

| Token | Used for |
|---|---|
| `rounded-lg` | Buttons, inputs, select trigger/content, sidebar links |
| `rounded-md` | Items inside menus (e.g. select options) |
| `rounded-xl` | Wrappers/panels, table container, modal card |
| `rounded-full` | Status badges, pills, toggle track/thumb, spinner, icon-only actions |

---

## Spacing Conventions

| Context | Classes |
|---|---|
| Page body padding | `p-5` |
| Header height / padding | `h-18 px-5` |
| Form vertical gap | `gap-4` |
| Field internal gap (label → control) | `gap-1.5` |
| Button padding | `py-2.5 px-4` |
| Input padding | `py-2.5 px-4` (`pl-9` when a left icon is present) |
| Table cell padding | `px-5 py-3.5` |
| Modal padding | `p-6` |
| Wrapper / panel padding | `p-5` |
| Sidebar nav item padding | `px-3 py-2.5` |
| Two-column form fields | `grid md:grid-cols-2 gap-4` |

---

## Elevation

- **Modals and floating menus** (select content) use `shadow-xl` plus a border on a darker surface (`bg-zinc-900` / `bg-zinc-800` + `border-white/10` or `border-zinc-700`).
- **Panels, headers, tables** are flat — separated by a subtle surface overlay (`bg-white/3` / `bg-white/5`) and a `border-white/10`, **not** by shadow.

---

## Interaction Patterns

| Pattern | Classes |
|---|---|
| Transition | `transition` / `transition-colors` with `duration-150` (controls) or `duration-200` (toggle) |
| Disabled | `disabled:opacity-50 disabled:cursor-not-allowed` |
| Actionable cursor | `cursor-pointer` / `not-disabled:cursor-pointer` |
| Hover on accent button | `not-disabled:hover:bg-amber-400` (danger: `not-disabled:hover:bg-red-500`) |
| Hover on muted element | `hover:text-white` / `hover:bg-white/5` |
| Input focus | `focus:ring-1 focus:border-amber-500 focus:ring-amber-500` (error state swaps to `red-500`) |
| Toggle focus | `focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900` |
| Non-selectable chrome | `select-none` on labels, badges, headers |

### Motion (`motion/react`)
| Element | Animation |
|---|---|
| Modal overlay | opacity `0 → 1`, `0.2s` |
| Modal card | scale `0.95 → 1` + `y -48% → -50%`, `0.18s` `easeOut` |
| Inline field error | height `0 → auto` + opacity, `0.15s` (wrapped in `AnimatePresence`) |

> Import animation primitives from `motion/react` (`motion`, `AnimatePresence`).

---

## Icons

- Icon library: **react-icons** (sets in use: `md`, `fi`, `bi`, `hi`, `io5`, `lu`, `fa`, `pi`).
- Size via the `size` prop (≈ `16` for nav, `20–24` for chrome) or `size-*` utilities inside controls.
- Color via `text-*` utility — `text-gray-400` by default, `hover:text-white`; never inline hex.

---

## Layout Archetypes

### 1. App Shell (root route)
```
div flex h-dvh w-full
  ├── Sidebar (fixed drawer on mobile, w-60 static column md+)
  └── main flex-1 flex flex-col overflow-hidden
       ├── mobile top bar (md:hidden, h-14, hamburger + brand)
       └── div flex-1 overflow-auto → <Outlet />
```

### 2. Sidebar
```
aside w-60 border-r border-white/10  (bg-white/3 desktop · bg-neutral-950 mobile)
  ├── brand header h-18 px-5 border-b border-white/10
  └── nav px-3 py-4 space-y-1
       └── Link rounded-lg px-3 py-2.5 text-sm text-gray-400 hover:text-white hover:bg-white/5
            activeProps → text-white bg-white/10
```

### 3. Page (`PageWrapper`)
```
div h-full flex flex-col
  ├── header h-18 px-5 border-b border-white/10 bg-white/3  (title + optional headerContent)
  └── div p-5 overflow-auto flex-1 flex flex-col
       ├── optional "Voltar" back button
       └── children
```
Loading and error variants reuse this shell: `PageLoading` (amber spinner on a `border-zinc-700` track, centered) and `PageError`.

### 4. Data Table (`Table`)
```
div overflow-x-auto rounded-xl border border-white/10 bg-white/5
  └── table w-full text-sm text-left
       ├── thead border-b border-white/10 → th px-5 py-3.5 text-xs uppercase tracking-wider text-gray-400
       └── tbody divide-y divide-white/5 → tr hover:bg-white/5 (cursor-pointer when onRowClick)
       └── loading / error / empty bodies swap in by state
Table.Pagination renders below.
```
A muted count line (`text-sm text-gray-400`) typically sits above the table; a filters bar sits above that with `mb-4`.

### 5. Form
```
Wrapper section p-5 rounded-xl border border-white/10 bg-white/5  (often max-w-4xl)
  └── form flex flex-col gap-4
       ├── h2 text-white text-lg font-bold + hr border-white/10
       ├── fields (single column, or grid md:grid-cols-2 gap-4)
       └── footer flex justify-end → primary Button
```

### 6. Form Field
```
label flex flex-col gap-1.5
  ├── span text-zinc-300 text-sm font-medium   (active → text-amber-400)
  ├── control rounded-lg border text-sm px-4 py-2.5
  │     default: border-zinc-700 bg-zinc-800 · focus: border/ring amber-500
  │     error:   border-red-500 bg-red-500/5 · focus ring red-500
  └── animated error span text-red-500 text-xs  (AnimatePresence)
```

### 7. Modal (`Modal` / `ConfirmModal`)
```
overlay fixed inset-0 bg-black/60
card fixed centered w-full max-w-md bg-zinc-900 border border-white/10 rounded-xl p-6 shadow-xl
  ConfirmModal: title (text-white font-bold text-lg)
              + description (text-zinc-400 text-sm)
              + footer flex justify-end gap-3 → Cancel (secondary) · Confirm (default | danger)
```

### 8. Status Badge
```
span select-none w-fit px-2 py-0.5 rounded-full text-xs font-medium
  + variant color pair (active green · inactive red · alert orange)
```

### 9. Toggle (Radix Switch)
```
Switch.Root h-6 w-11 rounded-full  (checked bg-amber-500 · unchecked bg-zinc-700)
  └── Switch.Thumb size-4 rounded-full bg-white shadow (translate on state)
```

---

## Anti-Patterns

| Anti-pattern | Correct approach |
|---|---|
| Raw hex in component code (e.g. `color="#a82319"`) | Use a palette role utility class (hex belongs only in `index.css`) |
| Nested ternaries for style variants | Use a `Record<Variant, string>` class map computed before JSX |
| Inline `style` for static values | Use a `className` utility; reserve `style` for computed transforms (e.g. modal translate) |
| Deep import of a component (e.g. `@components/form/button`) | Import from the `@components` barrel |
| Manual memoization (`useMemo`/`useCallback`/`memo`) | The React Compiler handles it — only memoize with a measured reason |
| Inventing a new color | Reuse an existing role; if truly missing, raise it as a "New pattern needed" in the Visual Spec |
