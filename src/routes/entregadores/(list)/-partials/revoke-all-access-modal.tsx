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
      description="Todas as sessões ativas no app serão encerradas e cada entregador precisará entrar novamente. Nenhuma senha é alterada — para bloquear alguém, desative o entregador."
      onClose={onClose}
      variant="danger"
      canClose={canClose}
      confirmLabel="Remover acesso de todos"
      onConfirm={onConfirm}
    />
  );
};
