import type { ICategory } from "@shared/models";

export type GetCategories = () => Promise<ICategory[]>;

export type UseCategoriesService = () => {
  getCategories: {
    fn: GetCategories;
    key: string;
  };
};
