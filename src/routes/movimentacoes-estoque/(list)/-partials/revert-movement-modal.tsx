import { ConfirmModal } from "@components";

type Props = {
  isOpen: boolean;
  canClose: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export const RevertMovementModal = ({
  isOpen,
  canClose,
  onClose,
  onConfirm,
}: Props) => {
  return (
    <ConfirmModal
      isOpen={isOpen}
      title="Tem certeza que deseja reverter esta reposição?"
      description="Todo o estoque adicionado por ela será devolvido e a movimentação sairá do histórico. Essa ação não poderá ser desfeita."
      variant="danger"
      canClose={canClose}
      confirmLabel="Reverter reposição"
      confirmDelaySeconds={5}
      onClose={onClose}
      onConfirm={onConfirm}
    />
  );
};
