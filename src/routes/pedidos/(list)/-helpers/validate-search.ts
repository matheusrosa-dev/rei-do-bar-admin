type Search = {
  page?: number;
};

export const validateSearch = (search: Record<string, unknown>): Search => {
  const page = Number(search.page) > 1 ? Number(search.page) : undefined;

  return {
    page,
  };
};
