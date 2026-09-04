import { useEffect, useState } from "react";
import * as RadixDialog from "@radix-ui/react-dialog";
import { Button, Modal } from "@components";
import { DeliveryPersonSelect } from "../delivery-person-select";

type Props = {
  isOpen: boolean;
  orderNumber?: number;
  isPending: boolean;
  onClose: () => void;
  onConfirm: (deliveryPersonId: string) => void;
};

export const ShipOrderModal = ({
  isOpen,
  orderNumber,
  isPending,
  onClose,
  onConfirm,
}: Props) => {
  const [deliveryPersonId, setDeliveryPersonId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) setDeliveryPersonId(null);
  }, [isOpen]);

  const handleConfirm = () => {
    if (deliveryPersonId) onConfirm(deliveryPersonId);
  };

  return (
    <Modal isOpen={isOpen} canClose={!isPending} onClose={onClose}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <RadixDialog.Title className="text-white font-bold text-lg">
            Enviar pedido
          </RadixDialog.Title>

          {orderNumber !== undefined && (
            <RadixDialog.Description className="text-zinc-400 text-sm">
              Selecione o entregador do pedido{" "}
              <strong className="font-bold text-white">#{orderNumber}</strong>.
              Você poderá alterar o entregador depois.
            </RadixDialog.Description>
          )}
        </div>

        <DeliveryPersonSelect
          value={deliveryPersonId}
          disabled={isPending}
          onChange={setDeliveryPersonId}
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
            onClick={handleConfirm}
            disabled={isPending || !deliveryPersonId}
          >
            Confirmar envio
          </Button>
        </div>
      </div>
    </Modal>
  );
};
