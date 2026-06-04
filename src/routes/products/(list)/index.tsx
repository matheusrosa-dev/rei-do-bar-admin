import { useProductsService, useCategoriesService } from "@services";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Filters, Table } from "./-partials";
import { Button, PageWrapper } from "@components";
import { validateSearch } from "./-helpers";

export const Route = createFileRoute("/products/(list)/")({
  validateSearch,
  component: Index,
});

const LIMIT = 10;

function Index() {
  const {
    page = 1,
    categoryId,
    isActive,
    sortDirection,
    sortKey,
  } = Route.useSearch();

  const { getProducts } = useProductsService();
  const { getCategories } = useCategoriesService();

  const productsQuery = useQuery({
    queryKey: [
      getProducts.key,
      page,
      categoryId,
      isActive,
      sortDirection,
      sortKey,
    ],
    queryFn: () =>
      getProducts.fn({
        page,
        limit: LIMIT,
        categoryId,
        isActive,
        sortDirection,
        sortKey,
      }),
    retry: false,
  });

  const categoriesQuery = useQuery({
    queryKey: [getCategories.key],
    queryFn: getCategories.fn,
    retry: false,
  });

  return (
    <PageWrapper
      title="Produtos"
      headerContent={() => (
        <Link to="/products/create">
          <Button>Criar produto</Button>
        </Link>
      )}
    >
      <div className="mb-4">
        <Filters
          categories={categoriesQuery.data ?? []}
          onRefetch={productsQuery.refetch}
          isRefetching={productsQuery.isRefetching}
        />
      </div>

      <Table
        data={productsQuery.data?.items ?? []}
        meta={productsQuery.data?.meta}
        limit={LIMIT}
        isLoading={productsQuery.isLoading}
        isError={productsQuery.isError}
      />
    </PageWrapper>
  );
}
