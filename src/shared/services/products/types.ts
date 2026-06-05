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

export type UpdateProduct = (props: {
  productId: string;
  body: Pick<
    IProduct,
    "name" | "description" | "imageUrl" | "price" | "categoryId"
  >;
}) => Promise<IProduct>;

export type ActivateProduct = (productId: string) => Promise<IProduct>;

export type DeactivateProduct = (productId: string) => Promise<IProduct>;

export type IncrementStock = (props: {
  productId: string;
  body: { amount: number };
}) => Promise<IProduct>;

export type DecrementStock = (props: {
  productId: string;
  body: { amount: number };
}) => Promise<IProduct>;

export type UseProductsService = () => {
  getProducts: {
    fn: GetProducts;
    key: string;
  };
  getProductById: {
    fn: GetProductById;
    key: string;
  };
  updateProduct: UpdateProduct;
  activateProduct: ActivateProduct;
  deactivateProduct: DeactivateProduct;
  incrementStock: IncrementStock;
  decrementStock: DecrementStock;
};
