import { Button, Input, Modal } from "@components";
import * as RadixDialog from "@radix-ui/react-dialog";
import { useCategoryGroupsService } from "@services";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { defaultValues, type Form, resolver } from "./form";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export const GroupModal = ({ isOpen, onClose }: Props) => {
  const queryClient = useQueryClient();
  const { createCategoryGroup, getCategoryGroups } = useCategoryGroupsService();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Form>({
    defaultValues,
    resolver,
  });

  const onCloseHandler = () => {
    reset();
    onClose();
  };

  const createMutation = useMutation({
    mutationFn: createCategoryGroup,
    onSuccess: () => {
      toast.success("Grupo criado com sucesso!");
      queryClient.invalidateQueries({ queryKey: [getCategoryGroups.key] });
      onCloseHandler();
    },
  });

  const onSubmit = (data: Form) => {
    createMutation.mutate({ name: data.name });
  };

  return (
    <Modal
      isOpen={isOpen}
      canClose={!createMutation.isPending}
      onClose={onCloseHandler}
    >
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <RadixDialog.Title className="text-white font-bold text-lg">
            Criar grupo de categorias
          </RadixDialog.Title>

          <RadixDialog.Description className="text-zinc-400 text-sm">
            Informe o nome do novo grupo de categorias.
          </RadixDialog.Description>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Input
            label="Nome"
            placeholder="Nome do grupo"
            error={errors.name?.message}
            disabled={createMutation.isPending}
            {...register("name")}
          />

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={onCloseHandler}
              disabled={createMutation.isPending}
            >
              Cancelar
            </Button>

            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? "Criando..." : "Criar grupo"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
