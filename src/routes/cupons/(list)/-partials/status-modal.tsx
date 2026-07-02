import { ConfirmModal } from "@components";

type Props = {
  isOpen: boolean;
  mode: "activate" | "deactivate";
  canClose: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export const StatusModal = ({
  isOpen,
  mode,
  canClose,
  onClose,
  onConfirm,
}: Props) => {
  return (
    <ConfirmModal
      isOpen={isOpen}
      title={mode === "deactivate" ? "Desativar cupom?" : "Ativar cupom?"}
      description={
        mode === "deactivate"
          ? "O cupom não poderá mais ser aplicado em novos pedidos."
          : "O cupom poderá ser aplicado em novos pedidos."
      }
      onClose={onClose}
      variant={mode === "deactivate" ? "danger" : "default"}
      canClose={canClose}
      confirmLabel={mode === "deactivate" ? "Desativar" : "Ativar"}
      onConfirm={onConfirm}
    />
  );
};
