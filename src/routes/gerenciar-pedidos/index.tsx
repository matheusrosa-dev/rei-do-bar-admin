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
import { useEffect } from "react";

export const Route = createFileRoute("/gerenciar-pedidos/")({
  component: Index,
});

const EDITABLE_TAGS = ["INPUT", "TEXTAREA", "SELECT"];

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

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key.toLowerCase() !== "r") return;
      if (event.ctrlKey || event.metaKey || event.altKey) return;

      const target = event.target as HTMLElement | null;

      if (target?.isContentEditable) return;
      if (target && EDITABLE_TAGS.includes(target.tagName)) return;

      refetch();
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [refetch]);

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
