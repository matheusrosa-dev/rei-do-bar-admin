const CENTS_IN_UNIT = 100;
const PERCENT_SCALE = 100;

export const formatPrice = (value: number) => {
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
