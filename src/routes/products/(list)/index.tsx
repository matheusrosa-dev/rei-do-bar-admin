import { useProductsService } from "@services/products";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Table } from "./-partials";

export const Route = createFileRoute("/products/(list)/")({
  validateSearch: (search: Record<string, unknown>) => ({
    page: Number(search.page) > 1 ? Number(search.page) : undefined,
  }),
  component: Index,
});

const LIMIT = 8;

function Index() {
  const { page = 1 } = Route.useSearch();

  const { getProducts } = useProductsService();

  const { data, isLoading, isError } = useQuery({
    queryKey: [getProducts.key, page],
    queryFn: () => getProducts.fn({ page, limit: LIMIT }),
    retry: false,
  });

  return (
    <div className="p-6">
      <h3 className="text-xl font-semibold text-white mb-5">Produtos</h3>

      <Table
        data={data?.items ?? []}
        meta={data?.meta}
        limit={LIMIT}
        isLoading={isLoading}
        isError={isError}
      />
    </div>
  );
}
