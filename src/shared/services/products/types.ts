import type { IPagination, SortDirection } from "@shared/interfaces";
import type { IProduct } from "@shared/models";

export type GetProdutsResponse = IPagination<IProduct>;

export type GetProductsSortKey = "sortOrder" | "stock";

export type GetProducts = (queries?: {
  page?: number;
  limit?: number;
  categoryId?: string;
  isActive?: boolean;
  sortKey?: GetProductsSortKey;
  sortDirection?: SortDirection;
}) => Promise<GetProdutsResponse>;

export type GetProductById = (productId: string) => Promise<IProduct>;

export type UseProductsService = () => {
  getProducts: {
    fn: GetProducts;
    key: string;
  };
  getProductById: {
    fn: GetProductById;
    key: string;
  };
};
