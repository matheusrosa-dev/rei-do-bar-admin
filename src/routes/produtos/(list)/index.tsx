import { useProductsService } from "@services";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { ProductGroupsList } from "./-partials";
import {
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

  const headerContent = () => (
    <RefetchButton
      onRefetch={productsQuery.refetch}
      isRefetching={productsQuery.isRefetching}
    />
  );

  if (productsQuery.isLoading) {
    return <PageLoading title="Produtos" />;
  }

  if (productsQuery.isError || !groups) {
    return <PageError title="Produtos" headerContent={headerContent} />;
  }

  return (
    <PageWrapper title="Produtos" headerContent={headerContent}>
      <ProductGroupsList groups={groups} />
    </PageWrapper>
  );
}
