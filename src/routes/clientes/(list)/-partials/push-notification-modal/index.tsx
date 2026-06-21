import { Button, Input, Modal, Select } from "@components";
import * as RadixDialog from "@radix-ui/react-dialog";
import { Controller, useForm } from "react-hook-form";
import { defaultValues, resolver, type Form } from "./form";
import {
  NOTIFICATION_ACTION_LABEL,
  NOTIFICATION_ACTIONS,
  NOTIFICATION_TARGET_LABEL,
  NOTIFICATION_TARGETS,
} from "./helpers/notification-target";
import { useMutation } from "@tanstack/react-query";
import { useNotificationsService } from "@services";
import { toast } from "sonner";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export const PushNotificationModal = ({ isOpen, onClose }: Props) => {
  const { pushNotification } = useNotificationsService();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<Form>({
    defaultValues,
    resolver,
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const pushNotificationMutation = useMutation({
    mutationFn: pushNotification,
    onSuccess: () => {
      toast.success("Notificação enviada com sucesso!");
      handleClose();
    },
  });

  const onSubmit = (formData: Form) => {
    pushNotificationMutation.mutate({
      title: formData.title,
      description: formData.description,
      target: formData.target,
      ...(formData?.action && {
        action: formData.action,
      }),
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      canClose={!pushNotificationMutation.isPending}
      onClose={handleClose}
    >
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <RadixDialog.Title className="text-white font-bold text-lg">
            Enviar notificação
          </RadixDialog.Title>

          <RadixDialog.Description className="text-zinc-400 text-sm">
            Dispare notificações para clientes.
          </RadixDialog.Description>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Input
            label="Título"
            placeholder="Insira um título"
            error={errors?.title?.message}
            {...register("title")}
            disabled={pushNotificationMutation.isPending}
          />

          <Input
            label="Descrição"
            placeholder="Insira uma descrição"
            error={errors?.description?.message}
            disabled={pushNotificationMutation.isPending}
            {...register("description")}
          />

          <div className="grid grid-cols-2 gap-4">
            <Controller
              control={control}
              name="target"
              render={({ field, fieldState }) => (
                <Select
                  label="Destino"
                  options={NOTIFICATION_TARGETS.map((target) => ({
                    label: NOTIFICATION_TARGET_LABEL[target],
                    value: target,
                  }))}
                  disabled={pushNotificationMutation.isPending}
                  value={field.value}
                  onChange={field.onChange}
                  error={fieldState.error?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="action"
              render={({ field, fieldState }) => (
                <Select
                  label="Ação ao pressionar"
                  options={NOTIFICATION_ACTIONS.map((target) => ({
                    label: NOTIFICATION_ACTION_LABEL[target],
                    value: target,
                  }))}
                  clearable
                  placeholder="Sem ação"
                  disabled={pushNotificationMutation.isPending}
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  error={fieldState.error?.message}
                />
              )}
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={handleClose}
              disabled={pushNotificationMutation.isPending}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={pushNotificationMutation.isPending}>
              {pushNotificationMutation.isPending ? "Enviando..." : "Enviar"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
