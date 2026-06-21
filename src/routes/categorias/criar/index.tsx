import { Button, Input, PageWrapper, Wrapper } from "@components";
import { createFileRoute } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { defaultValues, resolver, type Form } from "../-shared/category-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCategoriesService } from "@services";
import { toast } from "sonner";

export const Route = createFileRoute("/categorias/criar/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { createCategory, getCategories } = useCategoriesService();

  const queryClient = useQueryClient();
  const navigate = Route.useNavigate();

  const createCategoryMutation = useMutation({
    mutationFn: createCategory,
    onSuccess: (createdCategory) => {
      toast.success("Categoria criada com sucesso!");
      queryClient.invalidateQueries({ queryKey: [getCategories.key] });

      navigate({
        to: "/categorias/editar/$categoryId",
        params: { categoryId: createdCategory.id },
        replace: true,
      });
    },
  });

  const form = useForm({
    defaultValues,
    resolver,
  });

  const onSubmit = (formData: Form) => {
    createCategoryMutation.mutate({
      name: formData.name,
      pluralName: formData.pluralName,
      imageUrl: formData.imageUrl,
    });
  };

  return (
    <PageWrapper title="Criar categoria" goBack>
      <Wrapper className="max-w-4xl">
        <form
          className="flex flex-col gap-4"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <h2 className="text-white text-lg font-bold">Dados básicos</h2>

          <hr className="border-white/10" />

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
