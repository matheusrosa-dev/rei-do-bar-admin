import { ConfirmModal } from "@components";

type Props = {
  isOpen: boolean;
  canClose: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export const RevokeAllAccessModal = ({
  isOpen,
  canClose,
  onClose,
  onConfirm,
}: Props) => {
  return (
    <ConfirmModal
      isOpen={isOpen}
      title="Tem certeza que deseja remover o acesso de todos os entregadores?"
      description="As senhas cadastradas serão removidas e as sessões ativas no app serão encerradas. Cada entregador só volta a acessar o app depois que você definir uma nova senha."
      onClose={onClose}
      variant="danger"
      canClose={canClose}
      confirmLabel="Remover acesso de todos"
      onConfirm={onConfirm}
    />
  );
};
