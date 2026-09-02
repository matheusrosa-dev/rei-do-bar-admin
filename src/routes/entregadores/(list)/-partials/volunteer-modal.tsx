import { ConfirmModal } from "@components";

type Props = {
  isOpen: boolean;
  mode: "mark" | "unmark";
  canClose: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export const VolunteerModal = ({
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
        mode === "unmark" ? "Desmarcar voluntário?" : "Marcar como voluntário?"
      }
      description={
        mode === "unmark"
          ? "O entregador deixa de ser marcado como acertado por fora da aplicação."
          : "Este entregador passa a ser acertado por fora da aplicação. A marcação não altera nenhum cálculo ou total."
      }
      onClose={onClose}
      variant="default"
      canClose={canClose}
      confirmLabel={mode === "unmark" ? "Desmarcar" : "Marcar"}
      onConfirm={onConfirm}
    />
  );
};
