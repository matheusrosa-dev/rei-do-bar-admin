import { Button, Modal, PasswordInput } from "@components";
import { useDeliveryPersonsService } from "@services";
import type { IDeliveryPerson } from "@shared/models";
import * as RadixDialog from "@radix-ui/react-dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { defaultValues, resolver, type Form } from "./form";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  deliveryPerson?: IDeliveryPerson;
};

export const PasswordModal = ({ isOpen, onClose, deliveryPerson }: Props) => {
  const queryClient = useQueryClient();
  const {
    updateDeliveryPersonPassword,
    getDeliveryPersons,
    getDeliveryPersonsHasAccess,
  } = useDeliveryPersonsService();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Form>({ defaultValues, resolver });

  const onCloseHandler = () => {
    reset();
    onClose();
  };

  const { mutate, isPending } = useMutation({
    mutationFn: (variables: {
      deliveryPersonId: string;
      body: Parameters<typeof updateDeliveryPersonPassword>[1];
    }) =>
      updateDeliveryPersonPassword(variables.deliveryPersonId, variables.body),
    onSuccess: () => {
      toast.success("Senha atualizada com sucesso!");
      queryClient.invalidateQueries({ queryKey: [getDeliveryPersons.key] });
      queryClient.invalidateQueries({
        queryKey: [getDeliveryPersonsHasAccess.key],
      });
      onCloseHandler();
    },
  });

  const onSubmit = (data: Form) => {
    if (!deliveryPerson) return;

    mutate({
      deliveryPersonId: deliveryPerson.id,
      body: { password: data.password },
    });
  };

  return (
    <Modal isOpen={isOpen} canClose={!isPending} onClose={onCloseHandler}>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <RadixDialog.Title className="text-white font-bold text-lg">
            Definir senha
          </RadixDialog.Title>

          <RadixDialog.Description className="text-zinc-400 text-sm">
            {deliveryPerson
              ? `Defina a senha de acesso ao app de ${deliveryPerson.name}.`
              : "Defina a senha de acesso ao app do entregador."}
          </RadixDialog.Description>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <PasswordInput
            label="Senha"
            placeholder="Mínimo 8 caracteres"
            autoComplete="new-password"
            error={errors.password?.message}
            disabled={isPending}
            {...register("password")}
          />

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={onCloseHandler}
              disabled={isPending}
            >
              Cancelar
            </Button>

            <Button type="submit" disabled={isPending}>
              {isPending ? "Salvando..." : "Salvar senha"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
