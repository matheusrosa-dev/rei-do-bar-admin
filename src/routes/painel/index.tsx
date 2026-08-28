import { PageWrapper } from "@components";
import { useIsFetching, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { findDatePreset, toDateTimeParam, validateSearch } from "./-helpers";
import { DeliveryPersonsPanel, Filters, RevenuePanel } from "./-partials";

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
  const queryClient = useQueryClient();

  // Every active query on this screen belongs to a panel, so a new panel joins
  // the refresh without extra wiring here.
  const isRefetching = useIsFetching() > 0;

  const onRefetch = () => {
    queryClient.refetchQueries({ type: "active" });
  };

  return (
    <PageWrapper title="Painel">
      <div className="mb-4">
        <Filters onRefetch={onRefetch} isRefetching={isRefetching} />
      </div>

      <div className="flex flex-col gap-4">
        <RevenuePanel />
        <DeliveryPersonsPanel />
      </div>
    </PageWrapper>
  );
}
