import { useEffect, useState } from "react";
import * as RadixDialog from "@radix-ui/react-dialog";
import { Button, Modal, Select } from "@components";
import { useDeliveryPersonsService } from "@services";
import { useQuery } from "@tanstack/react-query";

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

  const { getDeliveryPersonsSimple } = useDeliveryPersonsService();

  const {
    data: deliveryPersons,
    isLoading,
    isError,
  } = useQuery({
    queryKey: [getDeliveryPersonsSimple.key],
    queryFn: getDeliveryPersonsSimple.fn,
    enabled: isOpen,
    retry: false,
  });

  useEffect(() => {
    if (isOpen) setDeliveryPersonId(null);
  }, [isOpen]);

  const activeDeliveryPersons = (deliveryPersons ?? []).filter(
    (deliveryPerson) => deliveryPerson.isActive,
  );

  const showSelect = !isLoading && !isError && activeDeliveryPersons.length > 0;

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
              Selecione o entregador do pedido #{orderNumber}. A atribuição é
              definitiva e não poderá ser alterada depois.
            </RadixDialog.Description>
          )}
        </div>

        {isLoading && (
          <span className="text-zinc-500 text-sm text-center block">
            Carregando entregadores...
          </span>
        )}

        {!isLoading && isError && (
          <span className="text-zinc-500 text-sm text-center block">
            Não foi possível carregar os entregadores.
          </span>
        )}

        {!isLoading && !isError && activeDeliveryPersons.length === 0 && (
          <span className="text-zinc-500 text-sm text-center block">
            Nenhum entregador ativo cadastrado.
          </span>
        )}

        {showSelect && (
          <Select
            label="Entregador"
            placeholder="Selecione o entregador"
            options={activeDeliveryPersons.map((deliveryPerson) => ({
              value: deliveryPerson.id,
              label: deliveryPerson.name,
            }))}
            value={deliveryPersonId}
            onChange={setDeliveryPersonId}
            disabled={isPending}
          />
        )}

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
