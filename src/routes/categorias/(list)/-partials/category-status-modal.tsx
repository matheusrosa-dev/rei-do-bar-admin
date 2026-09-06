import { ConfirmModal } from "@components";

type Props = {
  isOpen: boolean;
  mode: "activate" | "deactivate";
  canClose: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export const CategoryStatusModal = ({
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
        mode === "deactivate" ? "Desativar categoria?" : "Ativar categoria?"
      }
      description={
        mode === "deactivate"
          ? "A categoria ficará indisponível para seleção de produtos."
          : "A categoria voltará a ficar disponível para seleção de produtos."
      }
      onClose={onClose}
      variant={mode === "deactivate" ? "danger" : "default"}
      canClose={canClose}
      confirmLabel={mode === "deactivate" ? "Desativar" : "Ativar"}
      onConfirm={onConfirm}
    />
  );
};
