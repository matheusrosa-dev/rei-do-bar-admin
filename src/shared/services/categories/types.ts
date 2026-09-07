import type {
  ICategory,
  ICategoryWithGroup,
  ICategoryWithProductsCount,
} from "@shared/models";

export type GetCategoriesResponse = Array<ICategoryWithProductsCount>;

export type GetCategories = () => Promise<GetCategoriesResponse>;

export type UpdateCategoriesOrderResponse = Array<ICategory>;

export type UpdateCategoriesOrder = (body: {
  categoryGroupId: string;
  orderedIds: string[];
}) => Promise<UpdateCategoriesOrderResponse>;

export type GetCategoryById = (
  categoryId: string,
) => Promise<ICategoryWithGroup>;

export type RemoveCategory = (categoryId: string) => Promise<void>;

export type CreateCategoryBody = Pick<
  ICategory,
  "name" | "pluralName" | "imageUrl" | "categoryGroupId"
>;

export type CreateCategory = (body: CreateCategoryBody) => Promise<ICategory>;

export type ActivateCategory = (categoryId: string) => Promise<ICategory>;

export type DeactivateCategory = (categoryId: string) => Promise<ICategory>;

export type UpdateCategoryBody = Pick<
  ICategory,
  "name" | "pluralName" | "imageUrl"
>;

export type UpdateCategory = (params: {
  categoryId: string;
  body: UpdateCategoryBody;
}) => Promise<ICategory>;

export type UseCategoriesService = () => {
  getCategories: {
    fn: GetCategories;
    key: string;
  };
  getCategoryById: {
    fn: GetCategoryById;
    key: string;
  };
  updateCategoriesOrder: UpdateCategoriesOrder;
  removeCategory: RemoveCategory;
  createCategory: CreateCategory;
  updateCategory: UpdateCategory;
  activateCategory: ActivateCategory;
  deactivateCategory: DeactivateCategory;
};
