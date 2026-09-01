import { EMPTY_VALUE } from "@shared/helpers/number";
import type { Series } from "../../chart-legend";
import type { FormatValue } from "../../chart-tooltip";

export const CHART_COLORS = {
  deliveredOrdersCount: "var(--color-zinc-300)",
  firstDeliveredOrdersCount: "var(--color-sky-400)",
  redeemedCouponOrdersCount: "var(--color-green-400)",
  axis: "var(--color-zinc-400)",
  grid: "color-mix(in oklab, var(--color-white) 10%, transparent)",
  cursor: "color-mix(in oklab, var(--color-white) 5%, transparent)",
};

export const CHART_HEIGHT = 260;

export type SeriesKey =
  | "deliveredOrdersCount"
  | "firstDeliveredOrdersCount"
  | "redeemedCouponOrdersCount";

export const SERIES: Series<SeriesKey>[] = [
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
  {
    key: "redeemedCouponOrdersCount",
    label: "Pedidos com cupom",
    dotClassName: "bg-green-400",
  },
];

export const formatSeriesValue: FormatValue = (value) =>
  value === null ? EMPTY_VALUE : String(value);
