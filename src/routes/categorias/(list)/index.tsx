import { useCategoriesService } from "@services";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { CreateModal, Table } from "./-partials";
import { Button, PageWrapper, RefetchButton } from "@components";
import { useState } from "react";

export const Route = createFileRoute("/categorias/(list)/")({
  component: Index,
});

function Index() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const { getCategories } = useCategoriesService();

  const { data: categories, ...categoriesQuery } = useQuery({
    queryKey: [getCategories.key],
    queryFn: () => getCategories.fn(),
    retry: false,
  });

  return (
    <PageWrapper
      title="Categorias"
      headerContent={() => (
        <Button onClick={() => setIsCreateModalOpen(true)}>
          Criar categoria
        </Button>
      )}
    >
      <div className="flex mb-4 justify-end">
        <RefetchButton
          onRefetch={categoriesQuery.refetch}
          isRefetching={categoriesQuery.isRefetching}
        />
      </div>

      <Table
        data={categories ?? []}
        isLoading={categoriesQuery.isLoading}
        isError={categoriesQuery.isError}
      />

      <CreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </PageWrapper>
  );
}
