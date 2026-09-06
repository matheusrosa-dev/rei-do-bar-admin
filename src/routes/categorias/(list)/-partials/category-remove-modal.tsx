import { ConfirmModal } from "@components";

type Props = {
  isOpen: boolean;
  canClose: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export const CategoryRemoveModal = ({
  isOpen,
  canClose,
  onClose,
  onConfirm,
}: Props) => {
  return (
    <ConfirmModal
      isOpen={isOpen}
      title="Tem certeza que deseja remover esta categoria?"
      description="Essa ação não poderá ser desfeita."
      onClose={onClose}
      variant="danger"
      canClose={canClose}
      confirmLabel="Remover categoria"
      onConfirm={onConfirm}
    />
  );
};
