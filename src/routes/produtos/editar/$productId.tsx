import { PageError, PageLoading, PageWrapper } from "@components";
import { useCategoriesService, useProductsService } from "@services";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Actions, BasicData } from "./-partials";

export const Route = createFileRoute("/produtos/editar/$productId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { productId } = Route.useParams();
  const { getProductById } = useProductsService();
  const { getCategories } = useCategoriesService();

  const { data: product, ...productQuery } = useQuery({
    queryKey: [getProductById.key, productId],
    queryFn: () => getProductById.fn(productId),
    retry: false,
    refetchOnWindowFocus: false,
  });

  const { data: categories, ...categoriesQuery } = useQuery({
    queryKey: [getCategories.key, "active"],
    queryFn: () => getCategories.fn({ isActive: true }),
    retry: false,
    refetchOnWindowFocus: false,
  });

  const isLoading =
    productQuery.isLoading ||
    categoriesQuery.isLoading ||
    productQuery.isRefetching;

  const isError = productQuery.isError || categoriesQuery.isError;

  if (isLoading) {
    return <PageLoading title="Editar produto" goBack />;
  }

  if (isError || !categories || !product) {
    return <PageError title="Editar produto" goBack />;
  }

  return (
    <PageWrapper title="Editar produto" goBack>
      <div className="flex flex-col gap-4 max-w-4xl">
        <BasicData product={product} categories={categories} />

        <Actions product={product} />
      </div>
    </PageWrapper>
  );
}
