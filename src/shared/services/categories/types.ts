import type { ICategory } from "@shared/models";

export type GetCategoriesResponse = Array<
  ICategory & {
    productsCount: number;
  }
>;

export type GetCategories = (query?: {
  isActive?: boolean;
}) => Promise<GetCategoriesResponse>;

export type GetCategoriesResponseToSortOrderResponse = Array<ICategory>;

export type GetCategoriesToSortOrder =
  () => Promise<GetCategoriesResponseToSortOrderResponse>;

export type UpdateCategoriesOrderResponse = Array<ICategory>;

export type UpdateCategoriesOrder = (body: {
  orderedIds: string[];
}) => Promise<UpdateCategoriesOrderResponse>;

export type RemoveCategory = (categoryId: string) => Promise<void>;

export type CreateCategoryBody = {
  name: string;
  pluralName: string;
};

export type CreateCategory = (body: CreateCategoryBody) => Promise<ICategory>;

export type ActivateCategory = (categoryId: string) => Promise<ICategory>;

export type DeactivateCategory = (categoryId: string) => Promise<ICategory>;

export type UpdateCategoryBody = {
  name: string;
  pluralName: string;
};

export type UpdateCategory = (params: {
  categoryId: string;
  body: UpdateCategoryBody;
}) => Promise<ICategory>;

export type UseCategoriesService = () => {
  getCategories: {
    fn: GetCategories;
    key: string;
  };
  getCategoriesToSortOrder: {
    fn: GetCategoriesToSortOrder;
    key: string;
  };
  updateCategoriesOrder: UpdateCategoriesOrder;
  removeCategory: RemoveCategory;
  createCategory: CreateCategory;
  updateCategory: UpdateCategory;
  activateCategory: ActivateCategory;
  deactivateCategory: DeactivateCategory;
};
