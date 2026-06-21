import { useCategoriesService } from "@services";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Table } from "./-partials";
import { Button, PageWrapper, RefetchButton } from "@components";

export const Route = createFileRoute("/categorias/(list)/")({
  component: Index,
});

function Index() {
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
        <Link to="/categorias/criar">
          <Button>Criar categoria</Button>
        </Link>
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
    </PageWrapper>
  );
}
