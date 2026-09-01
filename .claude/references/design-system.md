# Design System

Stable visual reference for the admin UI. Tailwind v4 is CSS-first — there is
**no** `tailwind.config`, so the **Tailwind utility class is the canonical
token**.

The app is **dark-theme only**, rendered over a black body background.

## Color tokens

### Brand / accent — amber
| Semantic | Token | Used for |
| --- | --- | --- |
| Accent | `amber-500` | Primary button bg, focus ring/border, active toggle, active-filter border. |
| Accent hover/active | `amber-400` | Primary button hover, active label text, checked item text. |
| Accent wash | `amber-500/10`, `amber-500/5` | Subtle background of an active control. |

### Neutrals — surfaces, borders, text
| Semantic | Token | Used for |
| --- | --- | --- |
| App background | `black` (body) | Page backdrop (set in global CSS). |
| Raised surface | `white/5` | Cards, table, hover rows. |
| Header / faint surface | `white/3` | Page header, desktop sidebar. |
| Solid panel | `zinc-900` | Modal surface. |
| Input surface | `zinc-800` | Inputs, select trigger, dropdown menu. |
| Sidebar (mobile) | `neutral-950` | Off-canvas sidebar. |
| Primary border | `white/10` | Dividers, card/table/modal borders. |
| Control border | `zinc-700` | Input/select borders, unchecked toggle. |
| Text primary | `white` | Headings, primary text. |
| Text label | `zinc-300` | Field labels. |
| Text body/table | `gray-200` / `gray-300` | Table cells, body copy. |
| Text muted | `zinc-400` / `gray-400` | Secondary/meta text, icons. |
| Text faint/placeholder | `zinc-500` / `gray-500` | Placeholders, disabled. |

### Chart series
| Semantic | Token | Used for |
| --- | --- | --- |
| Revenue / delivered | `amber-500` | "Faturamento" line, "Entregues" bars. |
| Average order value | `violet-400` | "Ticket médio" line; also the icon of the "Ticket médio" and "Maior pedido" KPI cards. |
| Discount | `green-400` | "Desconto em cupons" line; "Pedidos com cupom" line (order-volume chart). |
| Count | `zinc-300` | "Pedidos entregues" line (order-volume chart); "Clientes anônimos" line (accounts chart). |
| Cancelled | `red-500` | "Cancelados" bars. |
| Acquisition | `sky-400` | "Primeiros pedidos" line (order-volume chart); "Clientes cadastrados" line (accounts chart); icon of the acquisition KPI cards ("Clientes cadastrados", "Primeiros pedidos"). |

> Series colors reach the chart primitives as props from a chart-local constant
> of theme variables — never a raw hex. Naming a color only as `var(--color-*)`
> in that constant is not enough for Tailwind to emit it: the same shade must
> also appear as a real utility class in the scanned source, which the legend's
> `dotClassName` covers — keep the two in sync.

> **`violet` is the order-value hue** — average and highest order value, in both
> the chart line and the KPI cards. It is not a status color and must not leak
> into buttons, badges, borders or feedback states.

> Two neutral families (`zinc` and `gray`) coexist. Match the family already used
> by neighboring elements; do not introduce a third.

### Semantic — feedback
| Semantic | Token | Used for |
| --- | --- | --- |
| Danger | `red-600` | Danger button bg. |
| Error | `red-500` | Error border, ring, message text. |
| Error wash | `red-500/5`, `red-500/15` | Error field bg, inactive badge bg. |
| Status: active | `green-500/15` + `green-400` | "Active" badge. |
| Status: inactive | `red-500/15` + `red-400` | "Inactive" badge. |
| Status: alert | `orange-500/15` + `orange-400` | "Alert" badge (e.g. out of stock). |
| Status: neutral | `white/10` + `gray-300` | Neutral badge for a non-status token (e.g. the coupon code on an order). |
| Discount | `green-400` | A deducted amount, always rendered with a `-` prefix (order summaries, orders table); also the icon of the coupon KPI cards ("Desconto em cupons", "Pedidos com cupom"). |

## Typography

| Role | Spec |
| --- | --- |
| Sans family | `Roboto` (global body font). |
| Mono family | `Roboto Mono` (available). |
| Title | `font-bold text-lg tracking-tight` (page titles, modal titles, brand). |
| Label | `text-sm font-medium`. |
| Body / table cell | `text-sm`. |
| Table header | `text-xs font-semibold uppercase tracking-wider`. |
| Stat value | `text-2xl font-bold` (the headline number of a summary/KPI card). |
| Meta / badge / error | `text-xs`. |
| Button | `text-sm font-semibold`. |

**Weights are limited to `medium` / `semibold` / `bold`.** Do not introduce more.

## Spacing & sizing

Use the standard Tailwind spacing scale. Recurring values:

| Use | Tokens |
| --- | --- |
| Gaps | `gap-1.5` (label↔control), `gap-2`–`gap-3` (inline groups), `gap-4` (form rows). |
| Control padding | `px-4 py-2.5` (buttons/inputs/select). |
| Cell padding | `px-5 py-3.5` (table). |
| Container padding | `p-5` (page content, cards), `p-6` (modal). |
| Bar heights | `h-18` (page header / sidebar header), `h-14` (mobile top bar). |
| Sidebar width | `w-60`. |

## Radius

| Token | Use |
| --- | --- |
| `rounded-lg` | Controls: buttons, inputs, select, nav links. |
| `rounded-xl` | Containers: cards, table, modal. |
| `rounded-md` | Dropdown menu items. |
| `rounded-full` | Badges, toggles, scrollbar thumb. |

## Elevation

Elevation is carried mostly by **border + translucent surface**, not shadows.

| Token | Use |
| --- | --- |
| `shadow-xl` | Modal content, dropdown menu. |
| `shadow` | Toggle thumb. |

## Layout archetypes

- **App shell** — fixed/relative sidebar (`w-60`) + main column with the router
  outlet. On mobile the sidebar is off-canvas with a backdrop and a hamburger top
  bar.
- **Page shell** — sticky header (`h-18`, bottom border, title + optional header
  action) over scrollable content (`p-5`); optional "back" affordance.
- **List page** — filter bar (search + selects + sort + clear + refetch) above a
  bordered card table, with a total-count line and pagination.
- **Form page** — a bordered card (`max-w-*`) wrapping a vertical form (`gap-4`),
  with a section title + `hr` divider and a right-aligned submit.
- **Card / surface** — `rounded-xl border border-white/10 bg-white/5 p-5`.

## Interaction patterns

- **Buttons** — variants `default` (amber), `secondary` (outline over zinc),
  `danger` (red); hover only when enabled (`not-disabled:hover:*`); disabled =
  `opacity-50` + `cursor-not-allowed`.
- **Focus** — amber focus ring on inputs/select/toggle
  (`focus:border-amber-500 focus:ring-1 focus:ring-amber-500`). Keep keyboard
  focus visible.
- **Active filter** — control gains amber border + `amber-500/10` background and
  an amber label, signaling a non-default value.
- **Field errors** — message reveals below the control via `AnimatePresence`
  (height + opacity, ~0.15s), `red-500 text-xs`; the control border/ring turns
  red; suppressed while disabled.
- **Global API errors** — surfaced once as a Sonner toast (dark, richColors,
  top-right) with message + code; never per-call inline.
- **Modals** — Radix Dialog + Motion: overlay fades (`bg-black/60`), content
  scales/translates in (~0.18s, easeOut), centered `max-w-md rounded-xl p-6`;
  closing is gated while a mutation is pending.
- **Transitions** — `transition-colors` with `duration-150`/`duration-200` for
  hover/state changes.

## Anti-patterns

- ❌ No light theme — dark only.
- ❌ No raw hex/rgb inside components — use palette tokens (the only raw values
  live in the global stylesheet for body background and scrollbar).
- ❌ No new color families — stay within amber (accent), zinc/neutral/gray +
  white-opacity (neutrals), red/green/orange (semantic), plus `violet` for the
  order-value metric and `sky` for the acquisition KPI cards (see
  [Chart series](#chart-series)).
- ❌ No more than the three type weights (medium/semibold/bold) per the scale.
- ❌ No gradients.
- ❌ No hand-built dialogs/selects/switches — wrap the Radix primitive.
- ❌ No nested ternaries in `className`.
- ❌ Do not re-implement the amber focus ring ad hoc — reuse the established one.
