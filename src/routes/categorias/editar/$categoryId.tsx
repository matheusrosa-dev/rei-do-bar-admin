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
  const { getCategoryById } = useCategoriesService();

  const { data: category, ...categoryQuery } = useQuery({
    queryKey: [getCategoryById.key, categoryId],
    queryFn: () => getCategoryById.fn(categoryId),
    retry: false,
    refetchOnWindowFocus: false,
  });

  if (categoryQuery.isLoading) {
    return <PageLoading title="Editar categoria" goBack />;
  }

  if (categoryQuery.isError || !category) {
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
