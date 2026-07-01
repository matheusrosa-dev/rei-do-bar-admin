import {
  Button,
  CurrencyInput,
  DatePicker,
  Input,
  Modal,
  NumberInput,
  Select,
} from "@components";
import { useCouponsService } from "@services";
import { CouponDiscountType } from "@shared/models";
import * as RadixDialog from "@radix-ui/react-dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { DISCOUNT_TYPE_OPTIONS } from "../../-helpers";
import { defaultValues, resolver, type Form } from "./form";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export const CouponModal = ({ isOpen, onClose }: Props) => {
  const queryClient = useQueryClient();
  const { createCoupon, getCoupons } = useCouponsService();

  const {
    control,
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm<Form>({ defaultValues, resolver });

  const isPercentage = watch("discountType") === CouponDiscountType.PERCENTAGE;

  const codeField = register("code");

  const onCloseHandler = () => {
    reset();
    onClose();
  };

  const createMutation = useMutation({
    mutationFn: createCoupon,
    onSuccess: () => {
      toast.success("Cupom criado com sucesso!");
      queryClient.invalidateQueries({ queryKey: [getCoupons.key] });
      onCloseHandler();
    },
  });

  const isPending = createMutation.isPending;

  const onSubmit = (data: Form) => {
    createMutation.mutate({
      code: data.code.trim().toUpperCase(),
      discountType: data.discountType,
      discountValue: data.discountValue,
      minOrderValue: data.minOrderValue,
      startsAt: new Date(data.startsAt),
      endsAt: data.endsAt ? new Date(data.endsAt) : undefined,
      usageLimit: data.usageLimit ?? undefined,
    });
  };

  return (
    <Modal isOpen={isOpen} canClose={!isPending} onClose={onCloseHandler}>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <RadixDialog.Title className="text-white font-bold text-lg">
            Criar cupom
          </RadixDialog.Title>

          <RadixDialog.Description className="text-zinc-400 text-sm">
            Preencha os dados do cupom de desconto.
          </RadixDialog.Description>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Input
            label="Código"
            placeholder="Ex: BEMVINDO10"
            error={errors.code?.message}
            disabled={isPending}
            {...codeField}
            onChange={(event) => {
              event.target.value = event.target.value.toUpperCase();
              codeField.onChange(event);
            }}
          />

          <div className="grid grid-cols-2 gap-3">
            <Controller
              control={control}
              name="discountType"
              render={({ field, fieldState }) => (
                <Select
                  label="Tipo de desconto"
                  options={DISCOUNT_TYPE_OPTIONS}
                  value={field.value}
                  onChange={(value) => {
                    field.onChange(value);
                    setValue("discountValue", 0);
                  }}
                  disabled={isPending}
                  error={fieldState.error?.message}
                />
              )}
            />

            {isPercentage ? (
              <NumberInput
                label="Desconto (%)"
                placeholder="0"
                error={errors.discountValue?.message}
                disabled={isPending}
                {...register("discountValue", { valueAsNumber: true })}
              />
            ) : (
              <Controller
                control={control}
                name="discountValue"
                render={({ field, fieldState }) => (
                  <CurrencyInput
                    label="Desconto"
                    value={field.value ?? 0}
                    onChange={field.onChange}
                    error={fieldState.error?.message}
                    disabled={isPending}
                  />
                )}
              />
            )}
          </div>

          <Controller
            control={control}
            name="minOrderValue"
            render={({ field, fieldState }) => (
              <CurrencyInput
                label="Valor mínimo do pedido"
                value={field.value ?? 0}
                onChange={field.onChange}
                error={fieldState.error?.message}
                disabled={isPending}
              />
            )}
          />

          <div className="grid grid-cols-2 gap-3">
            <Controller
              control={control}
              name="startsAt"
              render={({ field, fieldState }) => (
                <DatePicker
                  label="Início"
                  value={field.value}
                  onChange={field.onChange}
                  error={fieldState.error?.message}
                  disabled={isPending}
                />
              )}
            />

            <Controller
              control={control}
              name="endsAt"
              render={({ field, fieldState }) => (
                <DatePicker
                  label="Término (opcional)"
                  value={field.value}
                  onChange={field.onChange}
                  error={fieldState.error?.message}
                  disabled={isPending}
                  disabledBefore={watch("startsAt")}
                />
              )}
            />
          </div>

          <NumberInput
            label="Limite de uso (opcional)"
            placeholder="Ilimitado"
            error={errors.usageLimit?.message}
            disabled={isPending}
            {...register("usageLimit", { valueAsNumber: true })}
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
              {isPending ? "Salvando..." : "Criar cupom"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
