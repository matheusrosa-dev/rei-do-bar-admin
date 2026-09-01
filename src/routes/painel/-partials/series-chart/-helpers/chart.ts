import { EMPTY_VALUE, formatPrice } from "@shared/helpers/number";
import type { Series } from "../../chart-legend";
import type { FormatValue } from "../../chart-tooltip";

export const CHART_COLORS = {
  revenue: "var(--color-amber-500)",
  averageOrderValue: "var(--color-violet-400)",
  couponDiscount: "var(--color-green-400)",
  deliveredOrdersCount: "var(--color-zinc-300)",
  firstDeliveredOrdersCount: "var(--color-sky-400)",
  axis: "var(--color-zinc-400)",
  grid: "color-mix(in oklab, var(--color-white) 10%, transparent)",
  cursor: "color-mix(in oklab, var(--color-white) 5%, transparent)",
};

export const CHART_HEIGHT = 260;

export type SeriesKey =
  | "revenue"
  | "averageOrderValue"
  | "couponDiscount"
  | "deliveredOrdersCount"
  | "firstDeliveredOrdersCount";

export const SERIES: Series<SeriesKey>[] = [
  { key: "revenue", label: "Faturamento", dotClassName: "bg-amber-500" },
  {
    key: "averageOrderValue",
    label: "Ticket médio",
    dotClassName: "bg-violet-400",
  },
  {
    key: "couponDiscount",
    label: "Desconto em cupons",
    dotClassName: "bg-green-400",
  },
  {
    key: "deliveredOrdersCount",
    label: "Pedidos entregues",
    dotClassName: "bg-zinc-300",
  },
  {
    key: "firstDeliveredOrdersCount",
    label: "Primeiros pedidos",
    dotClassName: "bg-sky-400",
  },
];

export const MONEY_KEYS: SeriesKey[] = [
  "revenue",
  "averageOrderValue",
  "couponDiscount",
];

export const COUNT_KEYS: SeriesKey[] = [
  "deliveredOrdersCount",
  "firstDeliveredOrdersCount",
];

export const formatSeriesValue: FormatValue = (value, dataKey) => {
  if (value === null) return EMPTY_VALUE;

  return COUNT_KEYS.some((key) => key === dataKey)
    ? String(value)
    : formatPrice(value);
};
