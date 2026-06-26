import { useInventoryService } from "@services";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Table } from "./-partials";
import { PageWrapper, RefetchButton } from "@components";
import { validateSearch } from "./-helpers";

export const Route = createFileRoute("/movimentacoes-estoque/(list)/")({
  validateSearch,
  component: Index,
});

const LIMIT = 10;

function Index() {
  const { page = 1 } = Route.useSearch();

  const { getInventoryMovements } = useInventoryService();

  const { data: movements, ...movementsQuery } = useQuery({
    queryKey: [getInventoryMovements.key, page],
    queryFn: () => getInventoryMovements.fn({ page, limit: LIMIT }),
    retry: false,
  });

  return (
    <PageWrapper title="Movimentações de estoque">
      <div className="flex mb-4 justify-end">
        <RefetchButton
          onRefetch={movementsQuery.refetch}
          isRefetching={movementsQuery.isRefetching}
        />
      </div>

      <Table
        data={movements?.items ?? []}
        meta={movements?.meta}
        limit={LIMIT}
        isLoading={movementsQuery.isLoading}
        isError={movementsQuery.isError}
      />
    </PageWrapper>
  );
}
