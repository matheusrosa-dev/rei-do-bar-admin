import type { ICategory, ICategoryWithGroup } from "@shared/models";
import { api } from "../api";
import type {
  ActivateCategory,
  CreateCategory,
  DeactivateCategory,
  GetCategories,
  GetCategoriesResponse,
  GetCategoryById,
  RemoveCategory,
  UpdateCategoriesOrder,
  UpdateCategoriesOrderResponse,
  UpdateCategory,
  UseCategoriesService,
} from "./types";

export const useCategoriesService: UseCategoriesService = () => {
  const baseUrl = "/categories";

  const getCategories: GetCategories = async () => {
    const response = await api.get<GetCategoriesResponse>(baseUrl);

    return response.data.data;
  };

  const getCategoryById: GetCategoryById = async (categoryId) => {
    const response = await api.get<ICategoryWithGroup>(
      `${baseUrl}/${categoryId}`,
    );

    return response.data.data;
  };

  const updateCategoriesOrder: UpdateCategoriesOrder = async (body) => {
    const response = await api.put<UpdateCategoriesOrderResponse>(
      `${baseUrl}/sort-order`,
      body,
    );

    return response.data.data;
  };

  const removeCategory: RemoveCategory = async (categoryId) => {
    await api.delete(`${baseUrl}/${categoryId}`);
  };

  const createCategory: CreateCategory = async (body) => {
    const response = await api.post<ICategory>(baseUrl, body);
    return response.data.data;
  };

  const activateCategory: ActivateCategory = async (categoryId) => {
    const response = await api.patch<ICategory>(
      `${baseUrl}/${categoryId}/activate`,
    );

    return response.data.data;
  };

  const deactivateCategory: DeactivateCategory = async (categoryId) => {
    const response = await api.patch<ICategory>(
      `${baseUrl}/${categoryId}/deactivate`,
    );

    return response.data.data;
  };

  const updateCategory: UpdateCategory = async ({ categoryId, body }) => {
    const response = await api.put<ICategory>(`${baseUrl}/${categoryId}`, body);
    return response.data.data;
  };

  return {
    getCategories: {
      fn: getCategories,
      key: "get-categories",
    },
    getCategoryById: {
      fn: getCategoryById,
      key: "get-category-by-id",
    },
    updateCategoriesOrder,
    removeCategory,
    createCategory,
    updateCategory,
    activateCategory,
    deactivateCategory,
  };
};
