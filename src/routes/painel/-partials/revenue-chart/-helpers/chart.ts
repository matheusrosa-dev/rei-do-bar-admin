import { formatPrice } from "@shared/helpers/number";
import type { RevenuePoint } from "@shared/services/dashboard/types";

export const CHART_COLORS = {
  revenue: "var(--color-amber-500)",
  couponDiscount: "var(--color-green-400)",
  deliveredOrdersCount: "var(--color-zinc-300)",
  axis: "var(--color-zinc-400)",
  grid: "color-mix(in oklab, var(--color-white) 10%, transparent)",
  cursor: "color-mix(in oklab, var(--color-white) 5%, transparent)",
};

export const CHART_HEIGHT = 260;

const COUNT_KEY: keyof RevenuePoint = "deliveredOrdersCount";

export const formatSeriesValue = (value: number, dataKey: string) =>
  dataKey === COUNT_KEY ? String(value) : formatPrice(value);
