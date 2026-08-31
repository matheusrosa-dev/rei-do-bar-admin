import { fromDateTimeParam } from "./date-param";

type SeriesRange = {
  startDate?: Date;
  endDate?: Date;
};

// The API buckets the series by month whenever a bound is missing, so an
// open-ended range is closed at the current instant to get hourly/daily points.
export const toSeriesRange = (
  startDate?: string,
  endDate?: string,
): SeriesRange => {
  const start = fromDateTimeParam(startDate);
  const end = fromDateTimeParam(endDate);

  if (!start) return { startDate: undefined, endDate: end };

  return { startDate: start, endDate: end ?? new Date() };
};
