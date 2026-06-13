import { PageWrapper, RefetchButton } from "@components";
import { useOrdersService } from "@services";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { validateSearch } from "./-helpers";
import { Table } from "./-partials";

export const Route = createFileRoute("/pedidos/(list)/")({
  validateSearch,
  component: Index,
});

const LIMIT = 10;

function Index() {
  const { page = 1 } = Route.useSearch();

  const { getOrders } = useOrdersService();

  const { data: orders, ...ordersQuery } = useQuery({
    queryKey: [getOrders.key, page],
    queryFn: () => getOrders.fn({ page, limit: LIMIT }),
    retry: false,
  });

  return (
    <PageWrapper
      title="Pedidos"
      headerContent={() => (
        <RefetchButton
          onRefetch={ordersQuery.refetch}
          isRefetching={ordersQuery.isRefetching}
        />
      )}
    >
      <Table
        data={orders?.items ?? []}
        meta={orders?.meta}
        limit={LIMIT}
        isLoading={ordersQuery.isLoading}
        isError={ordersQuery.isError}
      />
    </PageWrapper>
  );
}
