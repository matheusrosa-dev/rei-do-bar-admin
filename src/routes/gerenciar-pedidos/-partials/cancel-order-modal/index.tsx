import { useEffect, useState } from "react";
import * as RadixDialog from "@radix-ui/react-dialog";
import { Button, Modal, Textarea } from "@components";

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

  useEffect(() => {
    if (isOpen) setStatusReason("");
  }, [isOpen]);

  const handleConfirm = () => {
    onConfirm(statusReason.trim() || undefined);
  };

  return (
    <Modal isOpen={isOpen} canClose={!isPending} onClose={onClose}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <RadixDialog.Title className="text-white font-bold text-lg">
            Cancelar pedido
          </RadixDialog.Title>

          {orderNumber !== undefined && (
            <RadixDialog.Description className="text-zinc-400 text-sm">
              Cancelar o pedido #{orderNumber}? Informe o motivo abaixo, se
              quiser.
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
            disabled={isPending}
          >
            Cancelar pedido
          </Button>
        </div>
      </div>
    </Modal>
  );
};
