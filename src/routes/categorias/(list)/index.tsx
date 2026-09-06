import { useCategoryGroupsService } from "@services";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { CategoryGroupsList } from "./-partials";
import {
  Button,
  PageError,
  PageLoading,
  PageWrapper,
  RefetchButton,
} from "@components";

export const Route = createFileRoute("/categorias/(list)/")({
  component: Index,
});

function Index() {
  const { getCategoryGroups } = useCategoryGroupsService();

  const { data: categoryGroups, ...categoryGroupsQuery } = useQuery({
    queryKey: [getCategoryGroups.key],
    queryFn: () => getCategoryGroups.fn(),
    retry: false,
  });

  const headerContent = () => (
    <RefetchButton
      onRefetch={categoryGroupsQuery.refetch}
      isRefetching={categoryGroupsQuery.isRefetching}
    />
  );

  const errorHeaderContent = () => (
    <div className="flex items-center gap-3">
      {headerContent()}

      <Link to="/categorias/criar">
        <Button>Criar categoria</Button>
      </Link>
    </div>
  );

  if (categoryGroupsQuery.isLoading) {
    return <PageLoading title="Categorias" />;
  }

  if (categoryGroupsQuery.isError || !categoryGroups) {
    return <PageError title="Categorias" headerContent={errorHeaderContent} />;
  }

  return (
    <PageWrapper title="Categorias" headerContent={headerContent}>
      <CategoryGroupsList groups={categoryGroups} />
    </PageWrapper>
  );
}
