import { ConfirmModal } from "@components";

type Props = {
  isOpen: boolean;
  mode: "activate" | "deactivate";
  canClose: boolean;
  onConfirm: () => void;
  onClose: () => void;
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
      title={mode === "deactivate" ? "Desativar cliente?" : "Ativar cliente?"}
      description={
        mode === "deactivate"
          ? "O cliente não poderá finalizar novos pedidos."
          : "O cliente poderá realizar pedidos normalmente."
      }
      onClose={onClose}
      variant={mode === "deactivate" ? "danger" : "default"}
      canClose={canClose}
      confirmLabel={mode === "deactivate" ? "Desativar" : "Ativar"}
      onConfirm={onConfirm}
    />
  );
};
