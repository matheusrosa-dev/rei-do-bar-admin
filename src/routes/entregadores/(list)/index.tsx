import { Button, PageWrapper } from "@components";
import { useDeliveryPersonsService } from "@services";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { validateSearch } from "./-helpers";
import { DeliveryPersonModal, Filters, Table } from "./-partials";

export const Route = createFileRoute("/entregadores/(list)/")({
  validateSearch,
  component: Index,
});

const LIMIT = 20;

function Index() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const {
    page = 1,
    searchTerm,
    isActive,
    sortKey,
    sortDirection,
  } = Route.useSearch();

  const { getDeliveryPersons } = useDeliveryPersonsService();

  const { data: deliveryPersons, ...deliveryPersonsQuery } = useQuery({
    queryKey: [
      getDeliveryPersons.key,
      page,
      searchTerm,
      isActive,
      sortKey,
      sortDirection,
    ],
    queryFn: () =>
      getDeliveryPersons.fn({
        page,
        limit: LIMIT,
        isActive,
        searchTerm,
        sortKey,
        sortDirection,
      }),
    retry: false,
  });

  return (
    <PageWrapper
      title="Entregadores"
      headerContent={() => (
        <Button onClick={() => setIsCreateModalOpen(true)}>
          Criar entregador
        </Button>
      )}
    >
      <div className="mb-4">
        <Filters
          onRefetch={deliveryPersonsQuery.refetch}
          isRefetching={deliveryPersonsQuery.isRefetching}
        />
      </div>

      <Table
        data={deliveryPersons?.items ?? []}
        meta={deliveryPersons?.meta}
        limit={LIMIT}
        isLoading={deliveryPersonsQuery.isLoading}
        isError={deliveryPersonsQuery.isError}
      />

      <DeliveryPersonModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </PageWrapper>
  );
}
