import type { ICategory } from "@shared/models";
import { api } from "../api";
import type { GetCategories, UseCategoriesService } from "./types";

export const useCategoriesService: UseCategoriesService = () => {
  const baseUrl = "/categories";

  const getCategories: GetCategories = async () => {
    const response = await api.get<ICategory[]>(baseUrl);

    return response.data.data;
  };

  return {
    getCategories: {
      fn: getCategories,
      key: "get-categories",
    },
  };
};
