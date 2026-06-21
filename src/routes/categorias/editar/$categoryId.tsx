import { PageError, PageLoading, PageWrapper } from "@components";
import { useCategoriesService } from "@services";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Actions, BasicData } from "./-partials";

export const Route = createFileRoute("/categorias/editar/$categoryId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { categoryId } = Route.useParams();
  const { getCategories } = useCategoriesService();

  const { data: categories, ...categoriesQuery } = useQuery({
    queryKey: [getCategories.key],
    queryFn: () => getCategories.fn(),
    retry: false,
    refetchOnWindowFocus: false,
  });

  const category = categories?.find((item) => item.id === categoryId);

  if (categoriesQuery.isLoading) {
    return <PageLoading title="Editar categoria" goBack />;
  }

  if (categoriesQuery.isError || !category) {
    return <PageError title="Editar categoria" goBack />;
  }

  return (
    <PageWrapper title="Editar categoria" goBack>
      <div className="flex flex-col gap-4 max-w-4xl">
        <BasicData category={category} />

        <Actions category={category} />
      </div>
    </PageWrapper>
  );
}
