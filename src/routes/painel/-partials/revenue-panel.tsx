import { useDashboardService } from "@services";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useSearch } from "@tanstack/react-router";
import { twMerge } from "tailwind-merge";
import { toRevenueRange } from "../-helpers";
import { RevenueCards } from "./revenue-cards";
import { RevenueChart } from "./revenue-chart";
import { SectionError } from "./section-error";
import { SectionLoading } from "./section-loading";

export const RevenuePanel = () => {
  const { startDate, endDate } = useSearch({ from: "/painel/" });

  const { getRevenue } = useDashboardService();

  const { data, isLoading, isError, isPlaceholderData } = useQuery({
    queryKey: [getRevenue.key, startDate, endDate],
    queryFn: () => getRevenue.fn(toRevenueRange(startDate, endDate)),
    placeholderData: keepPreviousData,
    retry: false,
  });

  if (isLoading) return <SectionLoading />;

  if (isError || !data) return <SectionError />;

  return (
    <div
      className={twMerge(
        "flex flex-col gap-4 transition-opacity duration-200",
        isPlaceholderData && "opacity-60",
      )}
    >
      <RevenueCards totals={data.totals} />
      <RevenueChart data={data.series} />
    </div>
  );
};
