import { InventoryMovementOrigin } from "@shared/models";

type Search = {
  page?: number;
  origin?: InventoryMovementOrigin[];
  productIds?: string[];
};

export const validateSearch = (search: Record<string, unknown>): Search => {
  const page = Number(search.page) > 1 ? Number(search.page) : undefined;

  const origin = formatOrigin(search.origin);

  const productIds = formatProductIds(search.productIds);

  return {
    page,
    origin,
    productIds,
  };
};

const formatOrigin = (
  value: unknown,
): InventoryMovementOrigin[] | undefined => {
  if (!Array.isArray(value)) return undefined;

  const origins = value.filter(
    (item): item is InventoryMovementOrigin =>
      typeof item === "string" &&
      Object.values(InventoryMovementOrigin).includes(
        item as InventoryMovementOrigin,
      ),
  );

  return origins.length > 0 ? origins : undefined;
};

const formatProductIds = (value: unknown): string[] | undefined => {
  if (!Array.isArray(value)) return undefined;

  const productIds = value.filter(
    (item): item is string => typeof item === "string",
  );

  return productIds.length > 0 ? productIds : undefined;
};
