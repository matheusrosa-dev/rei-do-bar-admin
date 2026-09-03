import { EMPTY_VALUE } from "@shared/helpers/number";
import type { Series } from "../../chart-legend";
import type { FormatValue } from "../../chart-tooltip";

export const CHART_COLORS = {
  newCustomersCount: "var(--color-sky-400)",
  newAnonymousCustomersCount: "var(--color-zinc-300)",
  axis: "var(--color-zinc-400)",
  grid: "color-mix(in oklab, var(--color-white) 10%, transparent)",
  cursor: "color-mix(in oklab, var(--color-white) 5%, transparent)",
};

export const CHART_HEIGHT = 320;

export type SeriesKey = "newCustomersCount" | "newAnonymousCustomersCount";

export const SERIES: Series<SeriesKey>[] = [
  {
    key: "newCustomersCount",
    label: "Clientes cadastrados",
    dotClassName: "bg-sky-400",
  },
  {
    key: "newAnonymousCustomersCount",
    label: "Clientes anônimos",
    dotClassName: "bg-zinc-300",
  },
];

export const formatSeriesValue: FormatValue = (value) =>
  value === null ? EMPTY_VALUE : String(value);
