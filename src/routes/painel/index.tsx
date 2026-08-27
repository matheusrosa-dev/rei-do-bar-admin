import { PageError, PageLoading, PageWrapper } from "@components";
import { useDashboardService } from "@services";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { twMerge } from "tailwind-merge";
import {
  findDatePreset,
  fromDateTimeParam,
  toDateTimeParam,
  validateSearch,
} from "./-helpers";
import { DeliveryPersonsChart, Filters, SummaryCards } from "./-partials";

export const Route = createFileRoute("/painel/")({
  validateSearch,
  beforeLoad: ({ search }) => {
    if (!search.preset || search.startDate) return;

    const range = findDatePreset(search.preset).toRange(new Date());

    throw redirect({
      to: "/painel",
      search: {
        startDate: toDateTimeParam(range.startDate),
        endDate: range.endDate ? toDateTimeParam(range.endDate) : undefined,
        preset: search.preset,
      },
      replace: true,
    });
  },
  component: Index,
});

function Index() {
  const { startDate, endDate } = Route.useSearch();

  const { getDeliveryPersonsPerformance } = useDashboardService();

  const { data: performance, ...performanceQuery } = useQuery({
    queryKey: [getDeliveryPersonsPerformance.key, startDate, endDate],
    queryFn: () =>
      getDeliveryPersonsPerformance.fn({
        startDate: fromDateTimeParam(startDate),
        endDate: fromDateTimeParam(endDate),
      }),
    placeholderData: keepPreviousData,
    retry: false,
  });

  if (performanceQuery.isLoading) {
    return <PageLoading title="Painel" />;
  }

  if (performanceQuery.isError || !performance) {
    return <PageError title="Painel" />;
  }

  return (
    <PageWrapper title="Painel">
      <div className="mb-4">
        <Filters
          onRefetch={performanceQuery.refetch}
          isRefetching={performanceQuery.isRefetching}
        />
      </div>

      <div
        className={twMerge(
          "flex flex-col gap-4 transition-opacity duration-200",
          performanceQuery.isPlaceholderData && "opacity-60",
        )}
      >
        <SummaryCards totals={performance.totals} />
        <DeliveryPersonsChart data={performance.deliveryPersons} />
      </div>
    </PageWrapper>
  );
}
