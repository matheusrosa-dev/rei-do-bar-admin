type Search = {
  page?: number;
  searchTerm?: string;
};

export const validateSearch = (search: Record<string, unknown>): Search => {
  const page = Number(search.page) > 1 ? Number(search.page) : undefined;

  const searchTerm =
    typeof search.searchTerm === "string" ? search.searchTerm : undefined;

  return {
    page,
    searchTerm,
  };
};
