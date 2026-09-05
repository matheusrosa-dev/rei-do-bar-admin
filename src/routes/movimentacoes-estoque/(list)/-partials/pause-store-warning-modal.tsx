import { ConfirmModal } from "@components";
import { Link } from "@tanstack/react-router";

const PAUSE_WARNING_DELAY_SECONDS = 10;

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export const PauseStoreWarningModal = ({
  isOpen,
  onClose,
  onConfirm,
}: Props) => (
  <ConfirmModal
    isOpen={isOpen}
    variant="danger"
    title="Pause a loja antes de movimentar o estoque"
    description={
      <>
        Se um item for cadastrado errado, a movimentação não poderá ser editada
        caso um pedido seja criado depois dela. Pause a loja em{" "}
        <Link
          to="/configuracoes"
          className="text-gray-300 underline duration-150 hover:text-white"
        >
          Configurações
        </Link>{" "}
        antes de continuar.
      </>
    }
    confirmLabel="Entendi, continuar"
    confirmDelaySeconds={PAUSE_WARNING_DELAY_SECONDS}
    onClose={onClose}
    onConfirm={onConfirm}
  />
);
