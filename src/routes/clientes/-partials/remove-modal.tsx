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
      title="Tem certeza que deseja remover este cliente?"
      onClose={onClose}
      variant="danger"
      canClose={canClose}
      confirmLabel="Remover cliente"
      description="Essa ação não poderá ser desfeita."
      onConfirm={onConfirm}
    />
  );
};
