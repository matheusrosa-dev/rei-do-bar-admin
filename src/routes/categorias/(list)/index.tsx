import { useCategoryGroupsService } from "@services";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useCategoriesReorder } from "./-helpers";
import { CategoryGroupsList } from "./-partials";
import {
  Button,
  PageError,
  PageLoading,
  PageWrapper,
  RefetchButton,
} from "@components";

export const Route = createFileRoute("/categorias/(list)/")({
  component: Index,
});

function Index() {
  const { getCategoryGroups } = useCategoryGroupsService();

  const { data: categoryGroups, ...categoryGroupsQuery } = useQuery({
    queryKey: [getCategoryGroups.key],
    queryFn: () => getCategoryGroups.fn(),
    retry: false,
    refetchOnWindowFocus: false,
  });

  const reorder = useCategoriesReorder(categoryGroups ?? []);

  const canReorder =
    reorder.groups.length > 1 ||
    reorder.groups.some((group) => group.categories.length > 1);

  const refetchButton = (
    <RefetchButton
      onRefetch={categoryGroupsQuery.refetch}
      isRefetching={categoryGroupsQuery.isRefetching}
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
            variant="secondary"
            disabled={!reorder.isDirty || reorder.isSaving}
            onClick={reorder.resetAll}
          >
            Resetar tudo
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

  if (categoryGroupsQuery.isLoading) {
    return <PageLoading title="Categorias" />;
  }

  if (categoryGroupsQuery.isError || !categoryGroups) {
    return <PageError title="Categorias" headerContent={errorHeaderContent} />;
  }

  return (
    <PageWrapper title="Categorias" headerContent={headerContent}>
      <CategoryGroupsList
        groups={reorder.groups}
        isReordering={reorder.isReordering}
        categoryOrigins={reorder.categoryOrigins}
        activeCategoryId={reorder.activeCategoryId}
        onDragStart={reorder.onDragStart}
        onDragEnd={reorder.onDragEnd}
        onDragCancel={reorder.onDragCancel}
      />
    </PageWrapper>
  );
}
