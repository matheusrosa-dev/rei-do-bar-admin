type Search = {
  isActive?: boolean;
  page?: number;
};

export const validateSearch = (search: Record<string, unknown>): Search => {
  const isActive = search.isActive as boolean | undefined;
  const page = Number(search.page) > 1 ? Number(search.page) : undefined;

  return { isActive, page };
};
