import type { ICategoryGroup } from "@shared/models";
import { api } from "../api";
import type {
  ActivateCategoryGroup,
  CreateCategoryGroup,
  DeactivateCategoryGroup,
  GetCategoryGroups,
  GetCategoryGroupsResponse,
  RemoveCategoryGroup,
  UpdateCategoryGroup,
  UseCategoryGroupsService,
} from "./types";

export const useCategoryGroupsService: UseCategoryGroupsService = () => {
  const baseUrl = "/category-groups";

  const getCategoryGroups: GetCategoryGroups = async () => {
    const response = await api.get<GetCategoryGroupsResponse>(baseUrl);
    return response.data.data;
  };

  const createCategoryGroup: CreateCategoryGroup = async (body) => {
    const response = await api.post<ICategoryGroup>(baseUrl, body);
    return response.data.data;
  };

  const updateCategoryGroup: UpdateCategoryGroup = async ({
    categoryGroupId,
    body,
  }) => {
    const response = await api.put<ICategoryGroup>(
      `${baseUrl}/${categoryGroupId}`,
      body,
    );

    return response.data.data;
  };

  const activateCategoryGroup: ActivateCategoryGroup = async (
    categoryGroupId,
  ) => {
    const response = await api.patch<ICategoryGroup>(
      `${baseUrl}/${categoryGroupId}/activate`,
    );

    return response.data.data;
  };

  const deactivateCategoryGroup: DeactivateCategoryGroup = async (
    categoryGroupId,
  ) => {
    const response = await api.patch<ICategoryGroup>(
      `${baseUrl}/${categoryGroupId}/deactivate`,
    );

    return response.data.data;
  };

  const removeCategoryGroup: RemoveCategoryGroup = async (categoryGroupId) => {
    await api.delete(`${baseUrl}/${categoryGroupId}`);
  };

  return {
    getCategoryGroups: {
      fn: getCategoryGroups,
      key: "get-category-groups",
    },
    createCategoryGroup,
    updateCategoryGroup,
    activateCategoryGroup,
    deactivateCategoryGroup,
    removeCategoryGroup,
  };
};
