import type { ICategoryGroup } from "@shared/models";
import { api } from "../api";
import type {
  ActivateCategoryGroup,
  CreateCategoryGroup,
  DeactivateCategoryGroup,
  GetCategoryGroupById,
  GetCategoryGroupByIdResponse,
  GetCategoryGroups,
  GetCategoryGroupsResponse,
  RemoveCategoryGroup,
  UpdateCategoryGroup,
  UpdateCategoryGroupsOrder,
  UpdateCategoryGroupsOrderResponse,
  UseCategoryGroupsService,
} from "./types";

export const useCategoryGroupsService: UseCategoryGroupsService = () => {
  const baseUrl = "/category-groups";

  const getCategoryGroups: GetCategoryGroups = async () => {
    const response = await api.get<GetCategoryGroupsResponse>(baseUrl);
    return response.data.data;
  };

  const getCategoryGroupById: GetCategoryGroupById = async (
    categoryGroupId,
  ) => {
    const response = await api.get<GetCategoryGroupByIdResponse>(
      `${baseUrl}/${categoryGroupId}`,
    );

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

  const updateCategoryGroupsOrder: UpdateCategoryGroupsOrder = async (body) => {
    const response = await api.put<UpdateCategoryGroupsOrderResponse>(
      `${baseUrl}/sort-order`,
      body,
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
    getCategoryGroupById: {
      fn: getCategoryGroupById,
      key: "get-category-group-by-id",
    },
    createCategoryGroup,
    updateCategoryGroup,
    activateCategoryGroup,
    deactivateCategoryGroup,
    updateCategoryGroupsOrder,
    removeCategoryGroup,
  };
};
