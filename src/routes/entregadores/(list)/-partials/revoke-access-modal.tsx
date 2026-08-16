import { ConfirmModal } from "@components";

type Props = {
  isOpen: boolean;
  canClose: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export const RevokeAccessModal = ({
  isOpen,
  canClose,
  onClose,
  onConfirm,
}: Props) => {
  return (
    <ConfirmModal
      isOpen={isOpen}
      title="Tem certeza que deseja remover o acesso deste entregador?"
      description="A sessão ativa no app será encerrada e ele precisará entrar novamente. A senha não é alterada — para bloquear o acesso, desative o entregador."
      onClose={onClose}
      variant="danger"
      canClose={canClose}
      confirmLabel="Remover acesso"
      onConfirm={onConfirm}
    />
  );
};
