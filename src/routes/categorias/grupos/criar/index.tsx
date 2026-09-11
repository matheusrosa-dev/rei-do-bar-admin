import { Button, Input, PageWrapper, Wrapper } from "@components";
import { useCategoryGroupsService } from "@services";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  defaultValues,
  type Form,
  resolver,
} from "../../-shared/category-group-form";

export const Route = createFileRoute("/categorias/grupos/criar/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { createCategoryGroup, getCategoryGroups } = useCategoryGroupsService();

  const queryClient = useQueryClient();
  const navigate = Route.useNavigate();

  const createCategoryGroupMutation = useMutation({
    mutationFn: createCategoryGroup,
    onSuccess: () => {
      toast.success("Grupo criado com sucesso!");
      queryClient.invalidateQueries({ queryKey: [getCategoryGroups.key] });

      navigate({ to: "/categorias", replace: true });
    },
  });

  const form = useForm<Form>({
    defaultValues,
    resolver,
  });

  const onSubmit = (formData: Form) => {
    createCategoryGroupMutation.mutate({
      name: formData.name,
      allProductsImageUrl: formData.allProductsImageUrl,
      promotionsImageUrl: formData.promotionsImageUrl,
    });
  };

  return (
    <PageWrapper title="Criar grupo de categorias" goBack>
      <Wrapper className="max-w-4xl">
        <form
          className="flex flex-col gap-4"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <h2 className="text-white text-lg font-bold">Dados básicos</h2>

          <hr className="border-white/10" />

          <Input
            label="Nome"
            placeholder="Insira o nome"
            {...form.register("name")}
            error={form.formState.errors.name?.message}
            disabled={createCategoryGroupMutation.isPending}
          />

          <Input
            label="Imagem de todos os produtos"
            placeholder="Insira a URL da imagem"
            {...form.register("allProductsImageUrl")}
            error={form.formState.errors.allProductsImageUrl?.message}
            disabled={createCategoryGroupMutation.isPending}
          />

          <Input
            label="Imagem de promoções"
            placeholder="Insira a URL da imagem"
            {...form.register("promotionsImageUrl")}
            error={form.formState.errors.promotionsImageUrl?.message}
            disabled={createCategoryGroupMutation.isPending}
          />

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={createCategoryGroupMutation.isPending}
            >
              Salvar
            </Button>
          </div>
        </form>
      </Wrapper>
    </PageWrapper>
  );
}
