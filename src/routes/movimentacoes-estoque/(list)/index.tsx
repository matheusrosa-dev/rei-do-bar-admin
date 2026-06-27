import { useInventoryService, useProductsService } from "@services";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Filters, StockMovementModal, Table } from "./-partials";
import { Button, PageWrapper } from "@components";
import { validateSearch } from "./-helpers";
import { useState } from "react";

export const Route = createFileRoute("/movimentacoes-estoque/(list)/")({
  validateSearch,
  component: Index,
});

const LIMIT = 10;

function Index() {
  const [isMovementModalOpen, setIsMovementModalOpen] = useState(false);

  const { page = 1, origin, productIds } = Route.useSearch();

  const { getInventoryMovements } = useInventoryService();
  const { getProductsSimple } = useProductsService();

  const { data: movements, ...movementsQuery } = useQuery({
    queryKey: [getInventoryMovements.key, page, origin, productIds],
    queryFn: () =>
      getInventoryMovements.fn({ page, limit: LIMIT, origin, productIds }),
    retry: false,
  });

  const { data: products } = useQuery({
    queryKey: [getProductsSimple.key],
    queryFn: getProductsSimple.fn,
    retry: false,
    refetchOnWindowFocus: false,
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
      <div className="mb-4">
        <Filters
          products={products ?? []}
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
