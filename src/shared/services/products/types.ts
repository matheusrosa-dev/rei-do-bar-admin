import type { IPagination, SortDirection } from "@shared/interfaces";
import type { IProduct, IProductWithCategory } from "@shared/models";

export type GetProdutsResponse = IPagination<IProductWithCategory>;

export type GetProductsSortKey = "stockQuantity";

export type GetProducts = (queries?: {
  page?: number;
  limit?: number;
  categoryId?: string;
  isActive?: boolean;
  searchTerm?: string;
  sortKey?: GetProductsSortKey;
  sortDirection?: SortDirection;
}) => Promise<GetProdutsResponse>;

export type GetProductsSimple = () => Promise<IProduct[]>;

export type GetProductsToSortOrderResponse = Array<IProduct>;

export type GetProductsToSortOrder =
  () => Promise<GetProductsToSortOrderResponse>;

export type UpdateProductsOrderResponse = Array<IProduct>;

export type UpdateProductsOrder = (body: {
  orderedIds: string[];
}) => Promise<UpdateProductsOrderResponse>;

export type GetProductById = (
  productId: string,
) => Promise<IProductWithCategory>;

export type UpdateProduct = (props: {
  productId: string;
  body: Pick<
    IProduct,
    | "name"
    | "description"
    | "imageUrl"
    | "price"
    | "categoryId"
    | "compareAtPrice"
  >;
}) => Promise<IProductWithCategory>;

export type CreateProduct = (
  body: Pick<
    IProduct,
    | "name"
    | "description"
    | "imageUrl"
    | "price"
    | "categoryId"
    | "compareAtPrice"
  >,
) => Promise<IProductWithCategory>;

export type ActivateProduct = (
  productId: string,
) => Promise<IProductWithCategory>;

export type DeactivateProduct = (
  productId: string,
) => Promise<IProductWithCategory>;

export type IncrementStock = (props: {
  productId: string;
  body: { amount: number };
}) => Promise<IProductWithCategory>;

export type DecrementStock = (props: {
  productId: string;
  body: { amount: number };
}) => Promise<IProductWithCategory>;

export type RemoveProduct = (productId: string) => Promise<void>;

export type UseProductsService = () => {
  getProducts: {
    fn: GetProducts;
    key: string;
  };
  getProductsSimple: {
    fn: GetProductsSimple;
    key: string;
  };
  getProductById: {
    fn: GetProductById;
    key: string;
  };
  getProductsToSortOrder: {
    fn: GetProductsToSortOrder;
    key: string;
  };
  updateProduct: UpdateProduct;
  updateProductsOrder: UpdateProductsOrder;
  activateProduct: ActivateProduct;
  deactivateProduct: DeactivateProduct;
  incrementStock: IncrementStock;
  decrementStock: DecrementStock;
  removeProduct: RemoveProduct;
  createProduct: CreateProduct;
};
