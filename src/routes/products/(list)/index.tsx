import { useProductsService, useCategoriesService } from "@services";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Filters, Table } from "./-partials";

type Search = {
  page?: number;
  categoryId?: string;
  isActive?: boolean;
  stockOrder?: "asc" | "desc";
};

export const Route = createFileRoute("/products/(list)/")({
  validateSearch: (search): Search => ({
    isActive: search.isActive as boolean | undefined,
    page: Number(search.page) > 1 ? Number(search.page) : undefined,
    categoryId:
      typeof search.categoryId === "string" ? search.categoryId : undefined,
    stockOrder:
      search.stockOrder === "asc" || search.stockOrder === "desc"
        ? search.stockOrder
        : undefined,
  }),
  component: Index,
});

const LIMIT = 8;

function Index() {
  const { page = 1, categoryId, isActive, stockOrder } = Route.useSearch();

  const { getProducts } = useProductsService();
  const { getCategories } = useCategoriesService();

  const productsQuery = useQuery({
    queryKey: [getProducts.key, page, categoryId, isActive, stockOrder],
    queryFn: () =>
      getProducts.fn({ page, limit: LIMIT, categoryId, isActive, stockOrder }),
    retry: false,
  });

  const categoriesQuery = useQuery({
    queryKey: [getCategories.key],
    queryFn: getCategories.fn,
    retry: false,
  });

  return (
    <div className="p-6">
      <h3 className="text-xl font-semibold text-white mb-5">Produtos</h3>

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
    </div>
  );
}
