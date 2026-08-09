import type { SortDirection } from "@shared/interfaces";
import type { GetDeliveryPersonsSortKey } from "@shared/services/delivery-persons/types";

type Search = {
  page?: number;
  searchTerm?: string;
  isActive?: boolean;
  sortKey?: GetDeliveryPersonsSortKey;
  sortDirection?: SortDirection;
};

export const validateSearch = (search: Record<string, unknown>): Search => {
  const isActive = search.isActive as boolean | undefined;

  const page = Number(search.page) > 1 ? Number(search.page) : undefined;

  const searchTerm =
    typeof search.searchTerm === "string" ? search.searchTerm : undefined;

  return {
    isActive,
    page,
    searchTerm,

    ...formatSort(search),
  };
};

const formatSort = (search: Record<string, unknown>) => {
  const sortKey =
    typeof search.sortKey === "string"
      ? (search.sortKey as GetDeliveryPersonsSortKey)
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
