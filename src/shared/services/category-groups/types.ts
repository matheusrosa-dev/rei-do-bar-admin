import type {
  ICategoryGroup,
  ICategoryGroupWithCategories,
  ICategoryGroupWithCategoryRows,
} from "@shared/models";

export type GetCategoryGroupsResponse = Array<ICategoryGroupWithCategories>;

export type GetCategoryGroups = () => Promise<GetCategoryGroupsResponse>;

export type GetCategoryGroupByIdResponse = ICategoryGroupWithCategoryRows;

export type GetCategoryGroupById = (
  categoryGroupId: string,
) => Promise<GetCategoryGroupByIdResponse>;

export type CreateCategoryGroupBody = Pick<
  ICategoryGroup,
  "name" | "allProductsImageUrl" | "promotionsImageUrl"
>;

export type CreateCategoryGroup = (
  body: CreateCategoryGroupBody,
) => Promise<ICategoryGroup>;

export type UpdateCategoryGroupBody = CreateCategoryGroupBody;

export type UpdateCategoryGroup = (params: {
  categoryGroupId: string;
  body: UpdateCategoryGroupBody;
}) => Promise<ICategoryGroup>;

export type ActivateCategoryGroup = (
  categoryGroupId: string,
) => Promise<ICategoryGroup>;

export type DeactivateCategoryGroup = (
  categoryGroupId: string,
) => Promise<ICategoryGroup>;

export type UpdateCategoryGroupsOrderBody = {
  categoryGroups: Array<{
    categoryGroupId: string;
    categories: Array<{ categoryId: string }>;
  }>;
};

export type UpdateCategoryGroupsOrderResponse =
  Array<ICategoryGroupWithCategories>;

export type UpdateCategoryGroupsOrder = (
  body: UpdateCategoryGroupsOrderBody,
) => Promise<UpdateCategoryGroupsOrderResponse>;

export type RemoveCategoryGroup = (categoryGroupId: string) => Promise<void>;

export type UseCategoryGroupsService = () => {
  getCategoryGroups: {
    fn: GetCategoryGroups;
    key: string;
  };
  getCategoryGroupById: {
    fn: GetCategoryGroupById;
    key: string;
  };
  createCategoryGroup: CreateCategoryGroup;
  updateCategoryGroup: UpdateCategoryGroup;
  activateCategoryGroup: ActivateCategoryGroup;
  deactivateCategoryGroup: DeactivateCategoryGroup;
  updateCategoryGroupsOrder: UpdateCategoryGroupsOrder;
  removeCategoryGroup: RemoveCategoryGroup;
};
