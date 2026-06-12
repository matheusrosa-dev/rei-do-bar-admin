import { createFileRoute } from "@tanstack/react-router";
import { Board } from "./-partials";
import { PageError, PageLoading, PageWrapper } from "@components";
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
    <PageWrapper title="Gerenciar pedidos">
      <Board orders={orders} />
    </PageWrapper>
  );
}
