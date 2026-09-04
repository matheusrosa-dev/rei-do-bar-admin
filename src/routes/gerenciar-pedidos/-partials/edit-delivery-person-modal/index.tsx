import { useEffect, useState } from "react";
import * as RadixDialog from "@radix-ui/react-dialog";
import { Button, Modal } from "@components";
import { DeliveryPersonSelect } from "../delivery-person-select";

type Props = {
  isOpen: boolean;
  orderNumber?: number;
  currentDeliveryPersonId: string | null;
  isPending: boolean;
  onClose: () => void;
  onConfirm: (deliveryPersonId: string) => void;
};

export const EditDeliveryPersonModal = ({
  isOpen,
  orderNumber,
  currentDeliveryPersonId,
  isPending,
  onClose,
  onConfirm,
}: Props) => {
  const [deliveryPersonId, setDeliveryPersonId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) setDeliveryPersonId(currentDeliveryPersonId);
  }, [isOpen, currentDeliveryPersonId]);

  const handleConfirm = () => {
    if (deliveryPersonId) onConfirm(deliveryPersonId);
  };

  return (
    <Modal isOpen={isOpen} canClose={!isPending} onClose={onClose}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <RadixDialog.Title className="text-white font-bold text-lg">
            Editar entregador
          </RadixDialog.Title>

          {orderNumber !== undefined && (
            <RadixDialog.Description className="text-zinc-400 text-sm">
              Selecione o novo entregador do pedido{" "}
              <strong className="font-bold text-white">#{orderNumber}</strong>.
              O status do pedido não será alterado.
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
            disabled={
              isPending ||
              !deliveryPersonId ||
              deliveryPersonId === currentDeliveryPersonId
            }
          >
            Salvar
          </Button>
        </div>
      </div>
    </Modal>
  );
};
