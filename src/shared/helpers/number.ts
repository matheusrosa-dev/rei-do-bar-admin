export const formatPrice = (value: number) => {
  const valueInCents = value / 100;

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(valueInCents);
};
