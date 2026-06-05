import { ConfirmModal } from "@components";

const variantData = {
  activate: {
    title: "Ativar produto",
    description: "O produto ficará disponível para os clientes.",
    variant: "default",
    confirmLabel: "Ativar",
  },
  deactivate: {
    title: "Desativar produto",
    description: "O produto ficará indisponível para os clientes.",
    variant: "danger",
    confirmLabel: "Desativar",
  },
} as const;

export type StatusModalVariant = keyof typeof variantData;

type Props = {
  isOpen: boolean;
  variant: StatusModalVariant;
  isPending: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export const StatusModal = ({
  isOpen,
  variant,
  isPending,
  onClose,
  onConfirm,
}: Props) => {
  return (
    <ConfirmModal
      isOpen={isOpen}
      onClose={onClose}
      title={variantData[variant]?.title}
      description={variantData[variant]?.description}
      variant={variantData[variant]?.variant}
      onConfirm={onConfirm}
      canClose={!isPending}
      confirmLabel={variantData[variant]?.confirmLabel}
    />
  );
};
