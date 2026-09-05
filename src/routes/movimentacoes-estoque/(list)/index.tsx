import {
  useInventoryService,
  useProductsService,
  useSettingsService,
} from "@services";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import {
  Filters,
  PauseStoreWarningModal,
  StockMovementModal,
  Table,
} from "./-partials";
import { Button, PageWrapper } from "@components";
import { isStorePaused } from "@shared/helpers/setting";
import { validateSearch } from "./-helpers";
import { useState } from "react";

export const Route = createFileRoute("/movimentacoes-estoque/(list)/")({
  validateSearch,
  component: Index,
});

const LIMIT = 50;

type ModalOpen = "pause-warning" | "movement";

function Index() {
  const [modalOpen, setModalOpen] = useState<ModalOpen | null>(null);

  const { page = 1, origin, productIds } = Route.useSearch();

  const { getInventoryMovements } = useInventoryService();
  const { getProductsSimple } = useProductsService();
  const { getSettings } = useSettingsService();

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

  const { data: settings } = useQuery({
    queryKey: [getSettings.key],
    queryFn: () => getSettings.fn(),
    retry: false,
  });

  return (
    <PageWrapper
      title="Movimentações de estoque"
      headerContent={() => (
        <Button
          onClick={() =>
            setModalOpen(isStorePaused(settings) ? "movement" : "pause-warning")
          }
        >
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

      <PauseStoreWarningModal
        isOpen={modalOpen === "pause-warning"}
        onClose={() => setModalOpen(null)}
        onConfirm={() => setModalOpen("movement")}
      />

      <StockMovementModal
        isOpen={modalOpen === "movement"}
        onClose={() => setModalOpen(null)}
      />
    </PageWrapper>
  );
}
