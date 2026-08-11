import { useEffect, useState } from "react";
import * as RadixDialog from "@radix-ui/react-dialog";
import { Button, Modal, Select } from "@components";
import { useDeliveryPersonsService, useOrdersService } from "@services";
import type { IOrderWithItemsAndCustomer } from "@shared/models";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type Props = {
  order: IOrderWithItemsAndCustomer | null;
  onClose: () => void;
};

export const EditDeliveryPersonModal = ({ order, onClose }: Props) => {
  const [deliveryPersonId, setDeliveryPersonId] = useState<string | null>(null);

  const { getDeliveryPersonsSimple } = useDeliveryPersonsService();
  const { updateOrderDeliveryPerson, getOrders, getOrdersManagement } =
    useOrdersService();
  const queryClient = useQueryClient();

  const isOpen = !!order;

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
    if (order) setDeliveryPersonId(order.deliveryPerson?.id ?? null);
  }, [order]);

  const updateDeliveryPersonMutation = useMutation({
    mutationFn: (deliveryPersonId: string) =>
      updateOrderDeliveryPerson({
        orderId: order!.id,
        body: { deliveryPersonId },
      }),
    onSuccess: () => {
      toast.success("Entregador atualizado com sucesso!");
      queryClient.invalidateQueries({ queryKey: [getOrders.key] });
      queryClient.invalidateQueries({
        queryKey: [getOrdersManagement.key],
      });
      onClose();
    },
  });

  const activeDeliveryPersons = (deliveryPersons ?? []).filter(
    (deliveryPerson) => deliveryPerson.isActive,
  );

  const showSelect = !isLoading && !isError && activeDeliveryPersons.length > 0;

  const handleConfirm = () => {
    if (deliveryPersonId) updateDeliveryPersonMutation.mutate(deliveryPersonId);
  };

  return (
    <Modal
      isOpen={isOpen}
      canClose={!updateDeliveryPersonMutation.isPending}
      onClose={onClose}
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <RadixDialog.Title className="text-white font-bold text-lg">
            Editar entregador
          </RadixDialog.Title>

          {order && (
            <RadixDialog.Description className="text-zinc-400 text-sm">
              Selecione o novo entregador do pedido #{order.orderNumber}. O
              status do pedido não será alterado.
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
            disabled={updateDeliveryPersonMutation.isPending}
          />
        )}

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={updateDeliveryPersonMutation.isPending}
          >
            Voltar
          </Button>

          <Button
            type="button"
            onClick={handleConfirm}
            disabled={
              updateDeliveryPersonMutation.isPending || !deliveryPersonId
            }
          >
            Salvar
          </Button>
        </div>
      </div>
    </Modal>
  );
};
