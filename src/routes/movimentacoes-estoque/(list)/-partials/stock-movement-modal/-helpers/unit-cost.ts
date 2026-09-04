export const getUnitCost = (totalCost?: number, quantity?: number) => {
  const unitCost = (totalCost ?? 0) / (quantity ?? 0);

  return Number.isFinite(unitCost) && unitCost > 0 ? unitCost : null;
};
