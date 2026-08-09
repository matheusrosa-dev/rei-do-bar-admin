import { ConfirmModal } from "@components";

type Props = {
  isOpen: boolean;
  canClose: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export const RemoveModal = ({
  isOpen,
  canClose,
  onClose,
  onConfirm,
}: Props) => {
  return (
    <ConfirmModal
      isOpen={isOpen}
      title="Tem certeza que deseja remover este entregador?"
      onClose={onClose}
      variant="danger"
      canClose={canClose}
      confirmLabel="Remover entregador"
      description="Se houver pedidos vinculados, a exclusão será bloqueada. Considere desativar o entregador nesse caso."
      onConfirm={onConfirm}
    />
  );
};
