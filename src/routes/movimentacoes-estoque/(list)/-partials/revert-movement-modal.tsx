import { ConfirmModal } from "@components";

type Props = {
  isOpen: boolean;
  mode: "restock" | "removal";
  canClose: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export const RevertMovementModal = ({
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
        mode === "removal"
          ? "Tem certeza que deseja reverter esta remoção?"
          : "Tem certeza que deseja reverter esta reposição?"
      }
      description={
        mode === "removal"
          ? "Toda a quantidade removida por ela voltará ao estoque e a movimentação sairá do histórico. Essa ação não poderá ser desfeita."
          : "Todo o estoque adicionado por ela será devolvido e a movimentação sairá do histórico. Essa ação não poderá ser desfeita."
      }
      variant="danger"
      canClose={canClose}
      confirmLabel={
        mode === "removal" ? "Reverter remoção" : "Reverter reposição"
      }
      confirmDelaySeconds={5}
      onClose={onClose}
      onConfirm={onConfirm}
    />
  );
};
