import { useDashboardService } from "@services";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useSearch } from "@tanstack/react-router";
import { twMerge } from "tailwind-merge";
import { toSeriesRange } from "../-helpers";
import { AccountsChart } from "./accounts-chart";
import { SectionError } from "./section-error";
import { SectionLoading } from "./section-loading";

export const AccountsPanel = () => {
  const { startDate, endDate } = useSearch({ from: "/painel/" });

  const { getAccountsSeries } = useDashboardService();

  const { data, isLoading, isError, isPlaceholderData } = useQuery({
    queryKey: [getAccountsSeries.key, startDate, endDate],
    queryFn: () => getAccountsSeries.fn(toSeriesRange(startDate, endDate)),
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
      <AccountsChart data={data.series} />
    </div>
  );
};
