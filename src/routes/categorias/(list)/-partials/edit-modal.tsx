import { Button, Input, Modal } from "@components";
import * as RadixDialog from "@radix-ui/react-dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useCategoriesService } from "@services";
import { resolver, type Form } from "../../-shared/category-form";
import type { ICategory } from "@shared/models";

type Props = {
  category: ICategory | null;
  onClose: () => void;
};

export function EditModal({ category, onClose }: Props) {
  const queryClient = useQueryClient();
  const { updateCategory, getCategories } = useCategoriesService();

  const updateCategoryMutation = useMutation({
    mutationFn: updateCategory,
    onSuccess: () => {
      toast.success("Categoria atualizada com sucesso!");
      queryClient.invalidateQueries({ queryKey: [getCategories.key] });
      handleClose();
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<Form>({
    resolver,
    values: category
      ? {
          name: category.name,
          pluralName: category.pluralName,
        }
      : undefined,
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = (data: Form) => {
    if (!category) return;
    updateCategoryMutation.mutate({ categoryId: category.id, body: data });
  };

  const isPending = updateCategoryMutation.isPending;

  return (
    <Modal isOpen={!!category} canClose={!isPending} onClose={handleClose}>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <RadixDialog.Title className="text-white font-bold text-lg">
            Editar categoria
          </RadixDialog.Title>
          <RadixDialog.Description className="text-zinc-400 text-sm">
            Atualize os dados da categoria.
          </RadixDialog.Description>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Input
            label="Nome"
            placeholder="Insira o nome"
            error={errors.name?.message}
            disabled={isPending}
            {...register("name")}
          />

          <Input
            label="Nome plural"
            placeholder="Insira o nome no plural"
            error={errors.pluralName?.message}
            disabled={isPending}
            {...register("pluralName")}
          />

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={handleClose}
              disabled={isPending}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending || !isDirty}>
              {isPending ? "Salvando..." : "Salvar alterações"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
