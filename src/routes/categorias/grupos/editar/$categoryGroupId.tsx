import {
  Button,
  ImagePreview,
  Input,
  PageError,
  PageLoading,
  PageWrapper,
  StatusBadge,
  Wrapper,
} from "@components";
import { useCategoryGroupsService } from "@services";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { type Form, resolver } from "../../-shared/category-group-form";

export const Route = createFileRoute(
  "/categorias/grupos/editar/$categoryGroupId",
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { categoryGroupId } = Route.useParams();
  const { updateCategoryGroup, getCategoryGroupById, getCategoryGroups } =
    useCategoryGroupsService();

  const queryClient = useQueryClient();
  const navigate = Route.useNavigate();

  const { data: categoryGroup, ...categoryGroupQuery } = useQuery({
    queryKey: [getCategoryGroupById.key, categoryGroupId],
    queryFn: () => getCategoryGroupById.fn(categoryGroupId),
    retry: false,
    refetchOnWindowFocus: false,
  });

  const updateCategoryGroupMutation = useMutation({
    mutationFn: updateCategoryGroup,
    onSuccess: () => {
      toast.success("Grupo atualizado com sucesso!");
      queryClient.invalidateQueries({
        queryKey: [getCategoryGroupById.key, categoryGroupId],
      });
      queryClient.invalidateQueries({ queryKey: [getCategoryGroups.key] });

      navigate({ to: "/categorias" });
    },
  });

  const form = useForm<Form>({
    values: {
      name: categoryGroup?.name ?? "",
      allProductsImageUrl: categoryGroup?.allProductsImageUrl ?? "",
      promotionsImageUrl: categoryGroup?.promotionsImageUrl ?? "",
    },
    resolver,
  });

  const onSubmit = (formData: Form) => {
    updateCategoryGroupMutation.mutate({
      categoryGroupId,
      body: {
        name: formData.name,
        allProductsImageUrl: formData.allProductsImageUrl,
        promotionsImageUrl: formData.promotionsImageUrl,
      },
    });
  };

  if (categoryGroupQuery.isLoading) {
    return <PageLoading title="Editar grupo de categorias" goBack />;
  }

  if (categoryGroupQuery.isError || !categoryGroup) {
    return <PageError title="Editar grupo de categorias" goBack />;
  }

  return (
    <PageWrapper title="Editar grupo de categorias" goBack>
      <Wrapper className="max-w-4xl">
        <form
          className="flex flex-col gap-4"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <h2 className="text-white text-lg font-bold">Dados básicos</h2>

          <hr className="border-white/10" />

          <div className="flex flex-col gap-2">
            <h2 className="text-amber-500 text-lg font-bold">
              {categoryGroup.name}
            </h2>

            <StatusBadge
              variant={categoryGroup.isActive ? "active" : "inactive"}
            >
              {categoryGroup.isActive ? "Ativo" : "Inativo"}
            </StatusBadge>
          </div>

          <Input
            label="Nome"
            placeholder="Insira o nome"
            {...form.register("name")}
            error={form.formState.errors.name?.message}
            disabled={updateCategoryGroupMutation.isPending}
          />

          <div className="flex items-center gap-4">
            <ImagePreview
              src={categoryGroup.allProductsImageUrl}
              className="size-24"
            />

            <Input
              label="Imagem de todos os produtos"
              placeholder="Insira a URL da imagem"
              {...form.register("allProductsImageUrl")}
              error={form.formState.errors.allProductsImageUrl?.message}
              disabled={updateCategoryGroupMutation.isPending}
            />
          </div>

          <div className="flex items-center gap-4">
            <ImagePreview
              src={categoryGroup.promotionsImageUrl}
              className="size-24"
            />

            <Input
              label="Imagem de promoções"
              placeholder="Insira a URL da imagem"
              {...form.register("promotionsImageUrl")}
              error={form.formState.errors.promotionsImageUrl?.message}
              disabled={updateCategoryGroupMutation.isPending}
            />
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={
                updateCategoryGroupMutation.isPending || !form.formState.isDirty
              }
            >
              Salvar alterações
            </Button>
          </div>
        </form>
      </Wrapper>
    </PageWrapper>
  );
}
