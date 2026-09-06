import { ConfirmModal } from "@components";

type Props = {
  isOpen: boolean;
  mode: "activate" | "deactivate";
  canClose: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export const GroupStatusModal = ({
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
        mode === "deactivate"
          ? "Desativar grupo de categorias?"
          : "Ativar grupo de categorias?"
      }
      description={
        mode === "deactivate"
          ? "O grupo ficará indisponível. As categorias dentro dele não serão alteradas."
          : "O grupo voltará a ficar disponível. As categorias dentro dele não serão alteradas."
      }
      onClose={onClose}
      variant={mode === "deactivate" ? "danger" : "default"}
      canClose={canClose}
      confirmLabel={mode === "deactivate" ? "Desativar" : "Ativar"}
      onConfirm={onConfirm}
    />
  );
};
