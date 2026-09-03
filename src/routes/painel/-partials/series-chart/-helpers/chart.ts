import { EMPTY_VALUE, formatPrice } from "@shared/helpers/number";
import type { Series } from "../../chart-legend";
import type { FormatValue } from "../../chart-tooltip";

export const CHART_COLORS = {
  revenue: "var(--color-amber-500)",
  averageOrderValue: "var(--color-violet-400)",
  couponDiscount: "var(--color-green-400)",
  axis: "var(--color-zinc-400)",
  grid: "color-mix(in oklab, var(--color-white) 10%, transparent)",
  cursor: "color-mix(in oklab, var(--color-white) 5%, transparent)",
};

export const CHART_HEIGHT = 320;

export type SeriesKey = "revenue" | "averageOrderValue" | "couponDiscount";

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
];

export const formatSeriesValue: FormatValue = (value) =>
  value === null ? EMPTY_VALUE : formatPrice(value);
