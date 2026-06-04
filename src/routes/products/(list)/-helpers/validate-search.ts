import type { SortDirection } from "@shared/interfaces";
import type { GetProductsSortKey } from "@shared/services/products/types";

type Search = {
  sortKey?: GetProductsSortKey;
  sortDirection?: SortDirection;
  isActive?: boolean;
  page?: number;
  categoryId?: string;
};

export const validateSearch = (search: Record<string, unknown>): Search => {
  const isActive = search.isActive as boolean | undefined;

  const page = Number(search.page) > 1 ? Number(search.page) : undefined;

  const categoryId =
    typeof search.categoryId === "string" ? search.categoryId : undefined;

  return {
    isActive,
    page,
    categoryId,

    ...formatSort(search),
  };
};

const formatSort = (search: Record<string, unknown>) => {
  const sortKey =
    typeof search.sortKey === "string"
      ? (search.sortKey as GetProductsSortKey)
      : undefined;

  let sortDirection: SortDirection | undefined;

  if (sortKey) {
    sortDirection = search.sortDirection as SortDirection;
  }

  return {
    sortKey,
    sortDirection,
  };
};
