import type { ICategory } from "@shared/models";

export type CategoryWithProductsCount = ICategory & {
  productsCount: number;
};
