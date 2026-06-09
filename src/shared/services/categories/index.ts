import type { ICategory } from "@shared/models";
import { api } from "../api";
import type {
  ActivateCategory,
  CreateCategory,
  DeactivateCategory,
  GetCategories,
  GetCategoriesResponse,
  RemoveCategory,
  UpdateCategory,
  UseCategoriesService,
} from "./types";

export const useCategoriesService: UseCategoriesService = () => {
  const baseUrl = "/categories";

  const getCategories: GetCategories = async (query) => {
    const response = await api.get<GetCategoriesResponse>(baseUrl, {
      params: query,
    });

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
    removeCategory,
    createCategory,
    updateCategory,
    activateCategory,
    deactivateCategory,
  };
};
