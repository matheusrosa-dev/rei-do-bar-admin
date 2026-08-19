type Search = {
  page?: number;
  searchTerm?: string;
  isActive?: boolean;
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
  };
};
