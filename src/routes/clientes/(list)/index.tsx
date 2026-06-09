import { useCustomersService } from "@services";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Filters, Table } from "./-partials";
import { PageWrapper } from "@components";
import { validateSearch } from "./-helpers";

export const Route = createFileRoute("/clientes/(list)/")({
  validateSearch,
  component: Index,
});

const LIMIT = 10;

function Index() {
  const {
    page = 1,
    isActive,
    searchTerm,
    sortDirection,
    sortKey,
  } = Route.useSearch();

  const { getCustomers } = useCustomersService();

  const { data: customers, ...customersQuery } = useQuery({
    queryKey: [
      getCustomers.key,
      page,
      isActive,
      searchTerm,
      sortDirection,
      sortKey,
    ],
    queryFn: () =>
      getCustomers.fn({
        page,
        limit: LIMIT,
        isActive,
        searchTerm,
        sortDirection,
        sortKey,
      }),
    retry: false,
  });

  return (
    <PageWrapper title="Clientes">
      <div className="mb-4">
        <Filters
          onRefetch={customersQuery.refetch}
          isRefetching={customersQuery.isRefetching}
        />
      </div>

      <Table
        data={customers?.items ?? []}
        meta={customers?.meta}
        limit={LIMIT}
        isLoading={customersQuery.isLoading}
        isError={customersQuery.isError}
      />
    </PageWrapper>
  );
}
