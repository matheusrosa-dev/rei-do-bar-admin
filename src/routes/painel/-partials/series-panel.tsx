import { useDashboardService } from "@services";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useSearch } from "@tanstack/react-router";
import { twMerge } from "tailwind-merge";
import { toSeriesRange } from "../-helpers";
import { SectionError } from "./section-error";
import { SectionLoading } from "./section-loading";
import { SeriesChart } from "./series-chart";

export const SeriesPanel = () => {
  const { startDate, endDate } = useSearch({ from: "/painel/" });

  const { getSeries } = useDashboardService();

  const { data, isLoading, isError, isPlaceholderData } = useQuery({
    queryKey: [getSeries.key, startDate, endDate],
    queryFn: () => getSeries.fn(toSeriesRange(startDate, endDate)),
    placeholderData: keepPreviousData,
    retry: false,
  });

  if (isLoading) return <SectionLoading />;

  if (isError || !data) return <SectionError />;

  return (
    <div
      className={twMerge(
        "transition-opacity duration-200",
        isPlaceholderData && "opacity-60",
      )}
    >
      <SeriesChart data={data.series} />
    </div>
  );
};
