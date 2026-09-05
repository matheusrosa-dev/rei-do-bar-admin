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
        mode === "deactivate"
          ? "Desativar configuração?"
          : "Ativar configuração?"
      }
      description={
        mode === "deactivate"
          ? "A configuração deixará de ser aplicada."
          : "A configuração voltará a ser aplicada."
      }
      onClose={onClose}
      variant={mode === "deactivate" ? "danger" : "default"}
      canClose={canClose}
      confirmLabel={mode === "deactivate" ? "Desativar" : "Ativar"}
      onConfirm={onConfirm}
    />
  );
};
