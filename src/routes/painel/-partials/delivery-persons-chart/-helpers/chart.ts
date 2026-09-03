import { formatPrice } from "@shared/helpers/number";
import type { DeliveryPersonPerformance } from "@shared/services/dashboard/types";
import type { Series } from "../../chart-legend";
import type { TooltipFooterGroup } from "../../chart-tooltip";

export const CHART_COLORS = {
  delivered: "var(--color-amber-500)",
  volunteered: "var(--color-green-400)",
  cancelled: "var(--color-red-500)",
  axis: "var(--color-zinc-400)",
  grid: "color-mix(in oklab, var(--color-white) 10%, transparent)",
  cursor: "color-mix(in oklab, var(--color-white) 5%, transparent)",
};

export type SeriesKey =
  | "deliveredOrdersCount"
  | "volunteeredDeliveriesCount"
  | "cancelledOrdersCount";

export const SERIES: Series<SeriesKey>[] = [
  {
    key: "deliveredOrdersCount",
    label: "Entregues",
    dotClassName: "bg-amber-500",
  },
  {
    key: "volunteeredDeliveriesCount",
    label: "Voluntárias",
    dotClassName: "bg-green-400",
  },
  {
    key: "cancelledOrdersCount",
    label: "Falhas na entrega",
    dotClassName: "bg-red-500",
  },
];

const EMPTY_CHART_LABEL = "Nenhuma série exibida";

export const formatDeliveryPersonChartLabel = (hiddenSeries: SeriesKey[]) => {
  const visibleLabels = SERIES.filter(
    ({ key }) => !hiddenSeries.includes(key),
  ).map(({ label }) => label);

  if (visibleLabels.length === 0) return EMPTY_CHART_LABEL;

  return `${visibleLabels.join(", ")} por entregador`;
};

const ROW_HEIGHT = 100;
const MIN_HEIGHT = 220;

export const getChartHeight = (count: number) =>
  Math.max(count * ROW_HEIGHT, MIN_HEIGHT);

const MAX_NAME_LENGTH = 18;

export const formatName = (name: string) =>
  name.length > MAX_NAME_LENGTH ? `${name.slice(0, MAX_NAME_LENGTH)}…` : name;

export const getDeliveryPersonFooterGroups = (
  datum: DeliveryPersonPerformance | undefined,
): TooltipFooterGroup[] | null => {
  if (!datum) return null;

  return [
    [
      {
        label: "Economia voluntária",
        value: formatPrice(datum.volunteeredSavingsTotal),
        valueClassName:
          "rounded-full bg-green-500/15 px-2 py-0.5 text-green-400",
      },
    ],
    [
      {
        label: "Taxa de entrega",
        value: formatPrice(datum.deliveryFeeTotal),
      },
      {
        label: "Bônus",
        value: formatPrice(datum.deliveryPersonBonusTotal),
      },
      {
        label: "Total a pagar",
        value: formatPrice(datum.payoutTotal),
      },
    ],
  ];
};
