import type { ICategory } from "@shared/models";

export type GetCategoriesResponse = Array<
  ICategory & {
    productsCount: number;
  }
>;

export type GetCategories = (query?: {
  isActive?: boolean;
}) => Promise<GetCategoriesResponse>;

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
  removeCategory: RemoveCategory;
  createCategory: CreateCategory;
  updateCategory: UpdateCategory;
  activateCategory: ActivateCategory;
  deactivateCategory: DeactivateCategory;
};
