import { useEffect, useState } from "react";
import * as RadixDialog from "@radix-ui/react-dialog";
import { FiAlertTriangle } from "react-icons/fi";
import { Button, Modal, Textarea } from "@components";

const CONFIRM_CANCEL_DELAY_SECONDS = 5;

type Props = {
  isOpen: boolean;
  orderNumber?: number;
  isPending: boolean;
  onClose: () => void;
  onConfirm: (statusReason?: string) => void;
};

export const CancelOrderModal = ({
  isOpen,
  orderNumber,
  isPending,
  onClose,
  onConfirm,
}: Props) => {
  const [statusReason, setStatusReason] = useState("");
  const [secondsLeft, setSecondsLeft] = useState(0);

  useEffect(() => {
    if (!isOpen) return;

    setStatusReason("");
    setSecondsLeft(CONFIRM_CANCEL_DELAY_SECONDS);
  }, [isOpen]);

  useEffect(() => {
    if (secondsLeft <= 0) return;

    const timeout = setTimeout(() => setSecondsLeft(secondsLeft - 1), 1000);

    return () => clearTimeout(timeout);
  }, [secondsLeft]);

  const handleConfirm = () => {
    onConfirm(statusReason.trim() || undefined);
  };

  return (
    <Modal isOpen={isOpen} canClose={!isPending} onClose={onClose}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <RadixDialog.Title className="flex items-center gap-2 text-white font-bold text-lg">
            <FiAlertTriangle className="text-red-500 shrink-0" size={20} />
            Cancelar pedido
          </RadixDialog.Title>

          {orderNumber !== undefined && (
            <RadixDialog.Description className="text-zinc-400 text-sm">
              Informe o motivo do cancelamento do pedido{" "}
              <strong className="font-bold text-white">#{orderNumber}</strong>,
              se quiser.
            </RadixDialog.Description>
          )}
        </div>

        <Textarea
          label="Motivo do cancelamento"
          placeholder="Descreva o motivo do cancelamento (opcional)"
          rows={3}
          value={statusReason}
          onChange={(event) => setStatusReason(event.target.value)}
          disabled={isPending}
        />

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={isPending}
          >
            Voltar
          </Button>

          <Button
            type="button"
            variant="danger"
            onClick={handleConfirm}
            disabled={isPending || secondsLeft > 0}
          >
            {secondsLeft > 0
              ? `Cancelar pedido (${secondsLeft})`
              : "Cancelar pedido"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
