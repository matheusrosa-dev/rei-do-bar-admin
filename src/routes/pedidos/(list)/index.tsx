import { PageWrapper } from "@components";
import { useOrdersService } from "@services";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { validateSearch } from "./-helpers";
import { Filters, Table } from "./-partials";

export const Route = createFileRoute("/pedidos/(list)/")({
  validateSearch,
  component: Index,
});

const LIMIT = 10;

function Index() {
  const {
    page = 1,
    status,
    paymentType,
    sortKey,
    sortDirection,
    searchTerm,
  } = Route.useSearch();

  const { getOrders } = useOrdersService();

  const { data: orders, ...ordersQuery } = useQuery({
    queryKey: [
      getOrders.key,
      page,
      status,
      paymentType,
      sortKey,
      sortDirection,
      searchTerm,
    ],
    queryFn: () =>
      getOrders.fn({
        page,
        limit: LIMIT,
        status,
        paymentType,
        sortKey,
        sortDirection,
        searchTerm,
      }),
    retry: false,
  });

  return (
    <PageWrapper title="Pedidos">
      <div className="mb-4">
        <Filters
          onRefetch={ordersQuery.refetch}
          isRefetching={ordersQuery.isRefetching}
        />
      </div>

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
