import { createFileRoute } from "@tanstack/react-router";
import { Board } from "./-partials";
import {
  PageError,
  PageLoading,
  PageWrapper,
  RefetchButton,
} from "@components";
import { useOrdersService } from "@services";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/gerenciar-pedidos/")({
  component: Index,
});

function Index() {
  const { getOrdersManagement } = useOrdersService();

  const {
    data: orders,
    isLoading,
    isError,
    isRefetching,
    refetch,
  } = useQuery({
    queryKey: [getOrdersManagement.key],
    queryFn: getOrdersManagement.fn,
    retry: false,
  });

  if (isLoading) {
    return <PageLoading title="Gerenciar pedidos" />;
  }

  if (isError || !orders) {
    return <PageError title="Gerenciar pedidos" />;
  }

  return (
    <PageWrapper
      title="Gerenciar pedidos"
      headerContent={() => (
        <RefetchButton onRefetch={refetch} isRefetching={isRefetching} />
      )}
    >
      <Board orders={orders} />
    </PageWrapper>
  );
}
