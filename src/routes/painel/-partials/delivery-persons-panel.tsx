import { useDashboardService } from "@services";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useSearch } from "@tanstack/react-router";
import { twMerge } from "tailwind-merge";
import { fromDateTimeParam } from "../-helpers";
import { DeliveryPersonsChart } from "./delivery-persons-chart";
import { SectionError } from "./section-error";
import { SectionLoading } from "./section-loading";

export const DeliveryPersonsPanel = () => {
  const { startDate, endDate } = useSearch({ from: "/painel/" });

  const { getDeliveryPersonsPerformance } = useDashboardService();

  const { data, isLoading, isError, isPlaceholderData } = useQuery({
    queryKey: [getDeliveryPersonsPerformance.key, startDate, endDate],
    queryFn: () =>
      getDeliveryPersonsPerformance.fn({
        startDate: fromDateTimeParam(startDate),
        endDate: fromDateTimeParam(endDate),
      }),
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
      <DeliveryPersonsChart data={data.deliveryPersons} />
    </div>
  );
};
