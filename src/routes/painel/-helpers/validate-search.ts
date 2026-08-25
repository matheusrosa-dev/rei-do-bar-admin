import { fromDateTimeParam } from "./date-param";
import { type DatePresetId, isDatePresetId } from "./date-presets";

type Search = {
  startDate?: string;
  endDate?: string;
  preset?: DatePresetId;
};

export const validateSearch = (search: Record<string, unknown>): Search => {
  const startDate = formatDateTimeParam(search.startDate);
  const endDate = formatDateTimeParam(search.endDate);
  const preset = isDatePresetId(search.preset) ? search.preset : undefined;

  const isInverted = !!startDate && !!endDate && endDate < startDate;

  return {
    startDate,
    endDate: isInverted ? undefined : endDate,
    preset: isInverted ? undefined : preset,
  };
};

const formatDateTimeParam = (value: unknown): string | undefined => {
  if (typeof value !== "string") return undefined;

  return fromDateTimeParam(value) ? value : undefined;
};
