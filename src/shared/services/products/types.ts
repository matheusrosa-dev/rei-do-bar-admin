import type { IPagination, SortDirection } from "@shared/interfaces";
import type { IProduct, IProductWithCategory } from "@shared/models";

export type GetProdutsResponse = IPagination<IProductWithCategory>;

export type GetProductsSortKey = "sortOrder" | "stock";

export type GetProducts = (queries?: {
  page?: number;
  limit?: number;
  categoryId?: string;
  isActive?: boolean;
  searchTerm?: string;
  sortKey?: GetProductsSortKey;
  sortDirection?: SortDirection;
}) => Promise<GetProdutsResponse>;

export type GetProductById = (
  productId: string,
) => Promise<IProductWithCategory>;

export type UpdateProduct = (props: {
  productId: string;
  body: Pick<
    IProduct,
    "name" | "description" | "imageUrl" | "price" | "categoryId"
  >;
}) => Promise<IProductWithCategory>;

export type CreateProduct = (
  body: Pick<
    IProduct,
    "name" | "description" | "imageUrl" | "price" | "categoryId"
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
  getProductById: {
    fn: GetProductById;
    key: string;
  };
  updateProduct: UpdateProduct;
  activateProduct: ActivateProduct;
  deactivateProduct: DeactivateProduct;
  incrementStock: IncrementStock;
  decrementStock: DecrementStock;
  removeProduct: RemoveProduct;
  createProduct: CreateProduct;
};
