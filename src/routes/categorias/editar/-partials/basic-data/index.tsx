import { Button, ImagePreview, Input, StatusBadge, Wrapper } from "@components";
import { useForm } from "react-hook-form";
import type { ICategoryWithGroup } from "@shared/models";
import { useCategoriesService, useCategoryGroupsService } from "@services";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { resolver, type Form } from "../../../-shared/category-form";

type Props = {
  category: ICategoryWithGroup;
};

export const BasicData = ({ category }: Props) => {
  const { updateCategory, getCategories, getCategoryById } =
    useCategoriesService();
  const { getCategoryGroups } = useCategoryGroupsService();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const form = useForm<Form>({
    values: {
      name: category.name,
      pluralName: category.pluralName,
      imageUrl: category.imageUrl,
    },
    resolver,
  });

  const updateCategoryMutation = useMutation({
    mutationFn: updateCategory,
    onSuccess: () => {
      toast.success("Categoria atualizada com sucesso!");
      queryClient.invalidateQueries({
        queryKey: [getCategoryById.key, category.id],
      });
      queryClient.invalidateQueries({ queryKey: [getCategories.key] });
      queryClient.invalidateQueries({ queryKey: [getCategoryGroups.key] });
      navigate({ to: "/categorias" });
    },
  });

  const onSubmit = (formData: Form) => {
    updateCategoryMutation.mutate({
      categoryId: category.id,
      body: {
        name: formData.name,
        pluralName: formData.pluralName,
        imageUrl: formData.imageUrl,
      },
    });
  };

  return (
    <Wrapper>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        <h2 className="text-white text-lg font-bold">Dados básicos</h2>

        <hr className="border-white/10" />

        <div className="flex gap-1.5 items-center">
          <span className="text-zinc-300 text-sm font-medium">Grupo:</span>

          <span className="text-amber-500 font-medium">
            {category.categoryGroup.name}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <ImagePreview src={category.imageUrl} className="size-24" />

          <div className="flex flex-col gap-2">
            <h2 className="text-amber-500 text-lg font-bold">
              {category.name}
            </h2>
            <StatusBadge variant={category.isActive ? "active" : "inactive"}>
              {category.isActive ? "Ativo" : "Inativo"}
            </StatusBadge>
          </div>
        </div>

        <Input
          label="Imagem"
          placeholder="Insira a URL da imagem"
          {...form.register("imageUrl")}
          error={form.formState.errors.imageUrl?.message}
          disabled={updateCategoryMutation.isPending}
        />

        <div className="grid md:grid-cols-2 gap-4">
          <Input
            label="Nome"
            placeholder="Insira o nome"
            {...form.register("name")}
            error={form.formState.errors.name?.message}
            disabled={updateCategoryMutation.isPending}
          />

          <Input
            label="Nome plural"
            placeholder="Insira o nome no plural"
            {...form.register("pluralName")}
            error={form.formState.errors.pluralName?.message}
            disabled={updateCategoryMutation.isPending}
          />
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={
              updateCategoryMutation.isPending || !form.formState.isDirty
            }
          >
            Salvar alterações
          </Button>
        </div>
      </form>
    </Wrapper>
  );
};
