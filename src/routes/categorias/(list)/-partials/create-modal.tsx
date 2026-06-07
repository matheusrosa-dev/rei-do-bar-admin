import { Button, Input, Modal } from "@components";
import * as RadixDialog from "@radix-ui/react-dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useCategoriesService } from "@services";
import {
  defaultValues,
  resolver,
  type Form,
} from "../../-shared/category-form";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export function CreateModal({ isOpen, onClose }: Props) {
  const queryClient = useQueryClient();
  const { createCategory, getCategories } = useCategoriesService();

  const createCategoryMutation = useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      toast.success("Categoria criada com sucesso!");
      queryClient.invalidateQueries({ queryKey: [getCategories.key] });
      handleClose();
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Form>({ defaultValues, resolver });

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = (data: Form) => {
    createCategoryMutation.mutate(data);
  };

  const isPending = createCategoryMutation.isPending;

  return (
    <Modal isOpen={isOpen} canClose={!isPending} onClose={handleClose}>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <RadixDialog.Title className="text-white font-bold text-lg">
            Criar categoria
          </RadixDialog.Title>
          <RadixDialog.Description className="text-zinc-400 text-sm">
            Preencha os dados para cadastrar uma nova categoria.
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
            <Button type="submit" disabled={isPending}>
              {isPending ? "Criando..." : "Criar categoria"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
