import {
  PageError,
  PageLoading,
  PageWrapper,
  RefetchButton,
} from "@components";
import { useDashboardService } from "@services";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { DeliveryPersonsChart, SummaryCards } from "./-partials";

export const Route = createFileRoute("/painel/")({
  component: Index,
});

function Index() {
  const { getDeliveryPersonsPerformance } = useDashboardService();

  const { data: performance, ...performanceQuery } = useQuery({
    queryKey: [getDeliveryPersonsPerformance.key],
    queryFn: getDeliveryPersonsPerformance.fn,
    retry: false,
  });

  if (performanceQuery.isLoading) {
    return <PageLoading title="Painel" />;
  }

  if (performanceQuery.isError || !performance) {
    return <PageError title="Painel" />;
  }

  return (
    <PageWrapper
      title="Painel"
      headerContent={() => (
        <RefetchButton
          onRefetch={performanceQuery.refetch}
          isRefetching={performanceQuery.isRefetching}
        />
      )}
    >
      <div className="flex flex-col gap-4">
        <SummaryCards totals={performance.totals} />
        <DeliveryPersonsChart data={performance.deliveryPersons} />
      </div>
    </PageWrapper>
  );
}
