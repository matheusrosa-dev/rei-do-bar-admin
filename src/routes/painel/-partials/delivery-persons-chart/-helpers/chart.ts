import { formatPrice } from "@shared/helpers/number";
import type { DeliveryPersonPerformance } from "@shared/services/dashboard/types";
import type { TooltipFooter } from "../../chart-tooltip";

export const CHART_COLORS = {
  delivered: "var(--color-amber-500)",
  cancelled: "var(--color-red-500)",
  axis: "var(--color-zinc-400)",
  grid: "color-mix(in oklab, var(--color-white) 10%, transparent)",
  cursor: "color-mix(in oklab, var(--color-white) 5%, transparent)",
};

const ROW_HEIGHT = 64;
const MIN_HEIGHT = 180;

export const getChartHeight = (count: number) =>
  Math.max(count * ROW_HEIGHT, MIN_HEIGHT);

const MAX_NAME_LENGTH = 18;

export const formatName = (name: string) =>
  name.length > MAX_NAME_LENGTH ? `${name.slice(0, MAX_NAME_LENGTH)}…` : name;

export const getDeliveryFeeFooter = (
  datum: DeliveryPersonPerformance | undefined,
): TooltipFooter | null => {
  if (!datum) return null;

  return {
    label: "Taxa de entrega",
    value: formatPrice(datum.deliveryFeeTotal),
  };
};
