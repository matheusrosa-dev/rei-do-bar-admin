import { ConfirmModal } from "@components";

type Props = {
  isOpen: boolean;
  canClose: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export const GroupRemoveModal = ({
  isOpen,
  canClose,
  onClose,
  onConfirm,
}: Props) => {
  return (
    <ConfirmModal
      isOpen={isOpen}
      title="Tem certeza que deseja remover este grupo de categorias?"
      description="Essa ação não poderá ser desfeita."
      onClose={onClose}
      variant="danger"
      canClose={canClose}
      confirmLabel="Remover grupo"
      onConfirm={onConfirm}
    />
  );
};
