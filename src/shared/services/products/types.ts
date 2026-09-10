import type {
  ICategoryGroupWithProducts,
  IProduct,
  IProductWithCategory,
} from "@shared/models";

export type GetProdutsResponse = ICategoryGroupWithProducts[];

export type GetProducts = () => Promise<GetProdutsResponse>;

export type GetProductsSimple = () => Promise<IProduct[]>;

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

export type RemoveProduct = (productId: string) => Promise<void>;

export type UpdateProductsOrderBody = {
  categoryGroups: Array<{
    categoryGroupId: string;
    products: Array<{ productId: string }>;
  }>;
};

export type UpdateProductsOrderResponse = ICategoryGroupWithProducts[];

export type UpdateProductsOrder = (
  body: UpdateProductsOrderBody,
) => Promise<UpdateProductsOrderResponse>;

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
  updateProduct: UpdateProduct;
  activateProduct: ActivateProduct;
  deactivateProduct: DeactivateProduct;
  removeProduct: RemoveProduct;
  createProduct: CreateProduct;
  updateProductsOrder: UpdateProductsOrder;
};
