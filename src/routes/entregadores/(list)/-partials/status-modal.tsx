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
      title={
        mode === "deactivate" ? "Desativar entregador?" : "Ativar entregador?"
      }
      description={
        mode === "deactivate"
          ? "Novos pedidos não poderão atribuir este entregador. Pedidos antigos manterão a referência."
          : "O entregador poderá ser atribuído a novos pedidos."
      }
      onClose={onClose}
      variant={mode === "deactivate" ? "danger" : "default"}
      canClose={canClose}
      confirmLabel={mode === "deactivate" ? "Desativar" : "Ativar"}
      onConfirm={onConfirm}
    />
  );
};
