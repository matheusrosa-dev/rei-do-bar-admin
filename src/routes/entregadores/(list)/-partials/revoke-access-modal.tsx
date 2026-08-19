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
      description="A senha cadastrada será removida e a sessão no app, se houver, será encerrada. Ele só volta a acessar o app depois que você definir uma nova senha."
      onClose={onClose}
      variant="danger"
      canClose={canClose}
      confirmLabel="Remover acesso"
      onConfirm={onConfirm}
    />
  );
};
