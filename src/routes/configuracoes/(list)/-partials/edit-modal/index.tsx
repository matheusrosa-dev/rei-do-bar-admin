import { Button, CurrencyInput, Input, Modal } from "@components";
import * as RadixDialog from "@radix-ui/react-dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useSettingsService } from "@services";
import { SettingType, type ISetting } from "@shared/models";
import { resolver, type Form } from "./form";
import { SETTING_KEY_LABEL } from "../../-helpers/setting-labels";

type Props = {
  setting: ISetting | null;
  onClose: () => void;
};

export function EditModal({ setting, onClose }: Props) {
  const queryClient = useQueryClient();
  const { updateSetting, getSettings } = useSettingsService();

  const updateSettingMutation = useMutation({
    mutationFn: updateSetting,
    onSuccess: () => {
      toast.success("Configuração atualizada com sucesso!");
      queryClient.invalidateQueries({ queryKey: [getSettings.key] });
      handleClose();
    },
  });

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<Form>({
    resolver,
    values: setting ? { value: setting.value } : undefined,
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = (formData: Form) => {
    if (!setting) return;
    updateSettingMutation.mutate({
      settingKey: setting.key,
      body: {
        value: formData?.value || "",
      },
    });
  };

  const isPending = updateSettingMutation.isPending;

  return (
    <Modal isOpen={!!setting} canClose={!isPending} onClose={handleClose}>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <RadixDialog.Title className="text-white font-bold text-lg">
            Editar configuração
          </RadixDialog.Title>
          <RadixDialog.Description className="text-zinc-400 text-sm">
            Atualize o valor da configuração.
          </RadixDialog.Description>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {setting?.type === SettingType.CURRENCY && (
            <Controller
              control={control}
              name="value"
              render={({ field, fieldState }) => (
                <CurrencyInput
                  label={SETTING_KEY_LABEL[setting.key]}
                  value={Number(field.value)}
                  onChange={(value) => field.onChange(String(value))}
                  error={fieldState.error?.message}
                  disabled={isPending}
                />
              )}
            />
          )}

          {setting?.type === SettingType.TEXT && (
            <Input
              label={SETTING_KEY_LABEL[setting.key]}
              placeholder="Insira a mensagem"
              error={errors.value?.message}
              disabled={isPending}
              {...register("value")}
            />
          )}

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
