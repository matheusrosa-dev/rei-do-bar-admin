import { useProductsService } from "@services";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useProductsReorder } from "./-helpers";
import { ProductGroupsList } from "./-partials";
import {
  Button,
  PageError,
  PageLoading,
  PageWrapper,
  RefetchButton,
} from "@components";

export const Route = createFileRoute("/produtos/(list)/")({
  component: Index,
});

function Index() {
  const { getProducts } = useProductsService();

  const { data: groups, ...productsQuery } = useQuery({
    queryKey: [getProducts.key],
    queryFn: () => getProducts.fn(),
    retry: false,
    refetchOnWindowFocus: false,
  });

  const reorder = useProductsReorder(groups ?? []);

  const canReorder = (groups ?? []).some((group) => group.products.length > 1);

  const refetchButton = (
    <RefetchButton
      onRefetch={productsQuery.refetch}
      isRefetching={productsQuery.isRefetching}
    />
  );

  const headerContent = () => {
    if (reorder.isReordering) {
      return (
        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="secondary"
            disabled={reorder.isSaving}
            onClick={reorder.cancel}
          >
            Cancelar
          </Button>

          <Button
            disabled={!reorder.isDirty || reorder.isSaving}
            onClick={reorder.save}
          >
            Salvar ordenação
          </Button>
        </div>
      );
    }

    return (
      <div className="flex flex-wrap items-center gap-3">
        {refetchButton}

        {canReorder && (
          <Button variant="secondary" onClick={reorder.start}>
            Reordenar
          </Button>
        )}
      </div>
    );
  };

  const errorHeaderContent = () => refetchButton;

  if (productsQuery.isLoading) {
    return <PageLoading title="Produtos" />;
  }

  if (productsQuery.isError || !groups) {
    return <PageError title="Produtos" headerContent={errorHeaderContent} />;
  }

  return (
    <PageWrapper title="Produtos" headerContent={headerContent}>
      <ProductGroupsList
        groups={reorder.groups}
        isReordering={reorder.isReordering}
        dirtyGroupIds={reorder.dirtyGroupIds}
        activeProductId={reorder.activeProductId}
        onResetGroupOrder={reorder.resetGroup}
        onDragStart={reorder.onDragStart}
        onDragEnd={reorder.onDragEnd}
        onDragCancel={reorder.onDragCancel}
      />
    </PageWrapper>
  );
}
