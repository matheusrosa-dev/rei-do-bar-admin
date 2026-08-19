import { Button, PageWrapper, Tooltip } from "@components";
import { useDeliveryPersonsService } from "@services";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { LuLogOut } from "react-icons/lu";
import { toast } from "sonner";
import { validateSearch } from "./-helpers";
import {
  DeliveryPersonModal,
  Filters,
  RevokeAllAccessModal,
  Table,
} from "./-partials";

export const Route = createFileRoute("/entregadores/(list)/")({
  validateSearch,
  component: Index,
});

const LIMIT = 20;

type ModalOpen = { mode: "create" } | { mode: "revoke-all-access" };

function Index() {
  const [modalOpen, setModalOpen] = useState<ModalOpen | null>(null);

  const { page = 1, searchTerm, isActive } = Route.useSearch();

  const queryClient = useQueryClient();

  const {
    getDeliveryPersons,
    getDeliveryPersonsHasAccess,
    revokeAllDeliveryPersonsAccess,
  } = useDeliveryPersonsService();

  const revokeAllAccessMutation = useMutation({
    mutationFn: revokeAllDeliveryPersonsAccess,
    onSuccess: () => {
      toast.success("Acesso de todos os entregadores removido com sucesso!");
      queryClient.invalidateQueries({ queryKey: [getDeliveryPersons.key] });
      queryClient.invalidateQueries({
        queryKey: [getDeliveryPersonsHasAccess.key],
      });
      setModalOpen(null);
    },
  });

  const hasAccessQuery = useQuery({
    queryKey: [getDeliveryPersonsHasAccess.key],
    queryFn: getDeliveryPersonsHasAccess.fn,
    retry: false,
  });

  const hasAccess =
    hasAccessQuery.isError || (hasAccessQuery.data?.hasAccess ?? false);

  const { data: deliveryPersons, ...deliveryPersonsQuery } = useQuery({
    queryKey: [getDeliveryPersons.key, page, searchTerm, isActive],
    queryFn: () =>
      getDeliveryPersons.fn({
        page,
        limit: LIMIT,
        isActive,
        searchTerm,
      }),
    retry: false,
  });

  return (
    <PageWrapper
      title="Entregadores"
      headerContent={() => (
        <div className="flex items-center gap-3">
          <Tooltip
            side="bottom"
            disabled={hasAccess || hasAccessQuery.isPending}
            content="Nenhum entregador tem acesso ao app no momento."
          >
            <span>
              <Button
                variant="secondary"
                onClick={() => setModalOpen({ mode: "revoke-all-access" })}
                disabled={revokeAllAccessMutation.isPending || !hasAccess}
              >
                <LuLogOut size={16} />
                Remover acesso de todos
              </Button>
            </span>
          </Tooltip>

          <Button onClick={() => setModalOpen({ mode: "create" })}>
            Criar entregador
          </Button>
        </div>
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
        isOpen={modalOpen?.mode === "create"}
        onClose={() => setModalOpen(null)}
      />

      <RevokeAllAccessModal
        isOpen={modalOpen?.mode === "revoke-all-access"}
        canClose={!revokeAllAccessMutation.isPending}
        onClose={() => setModalOpen(null)}
        onConfirm={() => revokeAllAccessMutation.mutate()}
      />
    </PageWrapper>
  );
}
