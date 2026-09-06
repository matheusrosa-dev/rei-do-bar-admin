type Search = {
  grupo?: string;
};

export const validateSearch = (search: Record<string, unknown>): Search => {
  const grupo =
    typeof search.grupo === "string" && search.grupo.length > 0
      ? search.grupo
      : undefined;

  return {
    grupo,
  };
};
