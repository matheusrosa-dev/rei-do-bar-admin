import * as RadixDialog from "@radix-ui/react-dialog";
import { Button, Modal, NumberInput } from "@components";
import { useForm } from "react-hook-form";
import { defaultValues, resolver, type Form } from "./form";
import { useEffect } from "react";

const variantData = {
  ["increment-stock"]: {
    title: "Adicionar estoque",
    description: "Informe a quantidade a ser adicionada ao estoque.",
    confirmLabel: "Adicionar",
  },
  ["decrement-stock"]: {
    title: "Remover estoque",
    description: "Informe a quantidade a ser removida do estoque.",
    confirmLabel: "Remover",
  },
} as const;

export type StockModalVariant = keyof typeof variantData;

type Props = {
  isOpen: boolean;
  variant: StockModalVariant;
  isPending: boolean;
  onClose: () => void;
  onConfirm: (data: Form) => void;
};

export const StockModal = ({
  isOpen,
  variant,
  isPending,
  onClose,
  onConfirm,
}: Props) => {
  const form = useForm<Form>({
    defaultValues,
    resolver,
  });

  useEffect(() => {
    if (isOpen) {
      form.reset();
    }
  }, [isOpen, form.reset]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} canClose={!isPending}>
      <form
        noValidate
        onSubmit={form.handleSubmit(onConfirm)}
        className="flex flex-col gap-4"
      >
        <div className="flex flex-col gap-1.5">
          <RadixDialog.Title className="text-white font-bold text-lg">
            {variantData[variant]?.title}
          </RadixDialog.Title>

          <RadixDialog.Description className="text-zinc-400 text-sm">
            {variantData[variant]?.description}
          </RadixDialog.Description>
        </div>

        <NumberInput
          label="Quantidade"
          placeholder="0"
          min={1}
          autoFocus
          disabled={isPending}
          {...form.register("amount", {
            valueAsNumber: true,
          })}
          error={form.formState.errors?.amount?.message}
        />

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            onClick={onClose}
            disabled={isPending}
            variant="secondary"
          >
            Cancelar
          </Button>

          <Button
            type="submit"
            disabled={isPending}
            variant={variant === "decrement-stock" ? "danger" : "default"}
          >
            {variantData[variant]?.confirmLabel}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
