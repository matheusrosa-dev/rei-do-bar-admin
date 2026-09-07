import {
  Button,
  Input,
  PageError,
  PageLoading,
  PageWrapper,
  Wrapper,
} from "@components";
import { createFileRoute, Navigate, redirect } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { defaultValues, resolver, type Form } from "../-shared/category-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCategoriesService, useCategoryGroupsService } from "@services";
import { toast } from "sonner";
import { validateSearch } from "./-helpers";

export const Route = createFileRoute("/categorias/criar/")({
  component: RouteComponent,
  validateSearch,
  beforeLoad: ({ search }) => {
    if (!search.grupo) {
      throw redirect({ to: "/categorias", replace: true });
    }
  },
});

function RouteComponent() {
  const { createCategory, getCategories } = useCategoriesService();
  const { getCategoryGroups } = useCategoryGroupsService();

  const { grupo } = Route.useSearch();
  const queryClient = useQueryClient();
  const navigate = Route.useNavigate();

  const {
    data: categoryGroups,
    isLoading,
    isError,
  } = useQuery({
    queryKey: [getCategoryGroups.key],
    queryFn: getCategoryGroups.fn,
    retry: false,
    refetchOnWindowFocus: false,
  });

  const createCategoryMutation = useMutation({
    mutationFn: createCategory,
    onSuccess: (createdCategory) => {
      toast.success("Categoria criada com sucesso!");
      queryClient.invalidateQueries({ queryKey: [getCategories.key] });
      queryClient.invalidateQueries({ queryKey: [getCategoryGroups.key] });

      navigate({
        to: "/categorias/editar/$categoryId",
        params: { categoryId: createdCategory.id },
        replace: true,
      });
    },
  });

  const form = useForm<Form>({
    defaultValues,
    resolver,
  });

  const categoryGroup = categoryGroups?.find((item) => item.id === grupo);

  const onSubmit = (formData: Form) => {
    createCategoryMutation.mutate({
      name: formData.name,
      pluralName: formData.pluralName,
      imageUrl: formData.imageUrl,
      categoryGroupId: grupo ?? "",
    });
  };

  if (isLoading) {
    return <PageLoading title="Criar categoria" goBack />;
  }

  if (isError) {
    return <PageError title="Criar categoria" goBack />;
  }

  if (!categoryGroup) {
    return <Navigate to="/categorias" replace />;
  }

  return (
    <PageWrapper title="Criar categoria" goBack>
      <Wrapper className="max-w-4xl">
        <form
          className="flex flex-col gap-4"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <h2 className="text-white text-lg font-bold">Dados básicos</h2>

          <hr className="border-white/10" />

          <div className="flex gap-1.5 items-center">
            <span className="text-zinc-300 text-sm font-medium">Grupo:</span>

            <span className="text-amber-500 font-medium">
              {categoryGroup.name}
            </span>
          </div>

          <Input
            label="Imagem"
            placeholder="Insira a URL da imagem"
            {...form.register("imageUrl")}
            error={form.formState.errors.imageUrl?.message}
            disabled={createCategoryMutation.isPending}
          />

          <Input
            label="Nome"
            placeholder="Insira o nome"
            {...form.register("name")}
            error={form.formState.errors.name?.message}
            disabled={createCategoryMutation.isPending}
          />

          <Input
            label="Nome plural"
            placeholder="Insira o nome no plural"
            {...form.register("pluralName")}
            error={form.formState.errors.pluralName?.message}
            disabled={createCategoryMutation.isPending}
          />

          <div className="flex justify-end">
            <Button type="submit" disabled={createCategoryMutation.isPending}>
              Salvar
            </Button>
          </div>
        </form>
      </Wrapper>
    </PageWrapper>
  );
}
