const CENTS_IN_UNIT = 100;
const PERCENT_SCALE = 100;
export const EMPTY_VALUE = "-";

export const formatPrice = (value: number | null) => {
  if (value === null || !Number.isFinite(value)) return EMPTY_VALUE;

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value / CENTS_IN_UNIT);
};

export const formatCompactPrice = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value / CENTS_IN_UNIT);
};

export const formatPercentage = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "percent",
    maximumFractionDigits: 2,
  }).format(value / PERCENT_SCALE);
};
