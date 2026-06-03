import type { IPagination } from "@shared/interfaces";
import type { IProduct } from "@shared/models";

export type GetProdutsResponse = IPagination<IProduct>;

export type GetProducts = (queries?: {
  page?: number;
  limit?: number;
  categoryId?: string;
  isActive?: boolean;
  stockOrder?: "asc" | "desc";
}) => Promise<GetProdutsResponse>;

export type UseProductsService = () => {
  getProducts: {
    fn: GetProducts;
    key: string;
  };
};
