import { fromDateTimeParam } from "./date-param";

type RevenueRange = {
  startDate?: Date;
  endDate?: Date;
};

// The API buckets the series by month whenever a bound is missing, so an
// open-ended range is closed at the current instant to get hourly/daily points.
export const toRevenueRange = (
  startDate?: string,
  endDate?: string,
): RevenueRange => {
  const start = fromDateTimeParam(startDate);
  const end = fromDateTimeParam(endDate);

  if (!start) return { startDate: undefined, endDate: end };

  return { startDate: start, endDate: end ?? new Date() };
};
