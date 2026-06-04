import { useProductsService, useCategoriesService } from "@services";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Filters, Table } from "./-partials";
import { Button, PageWrapper } from "@components";
import { validateSearch } from "./-helpers";

export const Route = createFileRoute("/produtos/(list)/")({
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

  const { data: products, ...productsQuery } = useQuery({
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

  const { data: categories, ...categoriesQuery } = useQuery({
    queryKey: [getCategories.key],
    queryFn: getCategories.fn,
    retry: false,
  });

  return (
    <PageWrapper
      title="Produtos"
      headerContent={() => (
        <Link to="/produtos/criar">
          <Button>Criar produto</Button>
        </Link>
      )}
    >
      <div className="mb-4">
        <Filters
          categories={categories ?? []}
          onRefetch={productsQuery.refetch}
          isRefetching={productsQuery.isRefetching}
        />
      </div>

      <Table
        data={products?.items ?? []}
        meta={products?.meta}
        limit={LIMIT}
        isLoading={productsQuery.isLoading || categoriesQuery.isLoading}
        isError={productsQuery.isError || categoriesQuery.isError}
      />
    </PageWrapper>
  );
}
