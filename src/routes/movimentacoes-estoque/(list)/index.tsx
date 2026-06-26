import { useInventoryService } from "@services";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { StockMovementModal, Table } from "./-partials";
import { Button, PageWrapper, RefetchButton } from "@components";
import { validateSearch } from "./-helpers";
import { useState } from "react";

export const Route = createFileRoute("/movimentacoes-estoque/(list)/")({
  validateSearch,
  component: Index,
});

const LIMIT = 10;

function Index() {
  const [isMovementModalOpen, setIsMovementModalOpen] = useState(false);

  const { page = 1 } = Route.useSearch();

  const { getInventoryMovements } = useInventoryService();

  const { data: movements, ...movementsQuery } = useQuery({
    queryKey: [getInventoryMovements.key, page],
    queryFn: () => getInventoryMovements.fn({ page, limit: LIMIT }),
    retry: false,
  });

  return (
    <PageWrapper
      title="Movimentações de estoque"
      headerContent={() => (
        <Button onClick={() => setIsMovementModalOpen(true)}>
          Movimentar estoque
        </Button>
      )}
    >
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

      <StockMovementModal
        isOpen={isMovementModalOpen}
        onClose={() => setIsMovementModalOpen(false)}
      />
    </PageWrapper>
  );
}
