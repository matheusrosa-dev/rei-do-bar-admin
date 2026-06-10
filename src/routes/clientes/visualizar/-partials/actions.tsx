import { Toggle, TrashButton, Wrapper } from "@components";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCustomersService } from "@services";
import { toast } from "sonner";
import type { ICustomerWithRelations } from "@shared/models";
import { useNavigate } from "@tanstack/react-router";
import { RemoveModal, StatusModal } from "../../-partials";

type ModalOpen = "toggle-status" | "deactivate" | "remove";

type Props = {
  customer: ICustomerWithRelations;
};

export const Actions = ({ customer }: Props) => {
  const [modalOpen, setModalOpen] = useState<ModalOpen | null>(null);

  const {
    activateCustomer,
    deactivateCustomer,
    getCustomerById,
    removeCustomer,
    getCustomers,
  } = useCustomersService();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const toggleStatusMutation = useMutation({
    mutationFn: () => {
      if (customer.isActive) {
        return deactivateCustomer(customer.id);
      }
      return activateCustomer(customer.id);
    },
    onSuccess: (updatedCustomer) => {
      queryClient.setQueryData(
        [getCustomerById.key, customer.id],
        (old: ICustomerWithRelations) => ({ ...old, ...updatedCustomer }),
      );
      toast.success(
        `Cliente ${updatedCustomer.isActive ? "ativado" : "desativado"} com sucesso!`,
      );
      setModalOpen(null);
    },
  });

  const removeCustomerMutation = useMutation({
    mutationFn: () => removeCustomer(customer.id),
    onSuccess: () => {
      toast.success("Cliente removido com sucesso!");
      queryClient.invalidateQueries({ queryKey: [getCustomers.key] });
      navigate({ to: "/clientes" });
    },
  });

  return (
    <>
      <Wrapper className="flex flex-col gap-4 w-fit">
        <div className="flex items-center justify-between gap-8">
          <h2 className="text-white text-lg font-bold">Ações</h2>
        </div>

        <hr className="border-white/10" />

        <div className="flex gap-12 items-center">
          <Toggle
            checked={customer.isActive}
            onCheckedChange={() => setModalOpen("toggle-status")}
            label="Status"
          />

          <TrashButton
            onClick={() => setModalOpen("remove")}
            className="w-10 h-10 -ml-4 mt-auto"
          />
        </div>
      </Wrapper>

      <StatusModal
        isOpen={modalOpen === "toggle-status"}
        canClose={!toggleStatusMutation.isPending}
        mode={customer.isActive ? "deactivate" : "activate"}
        onClose={() => setModalOpen(null)}
        onConfirm={toggleStatusMutation.mutate}
      />

      <RemoveModal
        isOpen={modalOpen === "remove"}
        onClose={() => setModalOpen(null)}
        onConfirm={removeCustomerMutation.mutate}
        canClose={!removeCustomerMutation.isPending}
      />
    </>
  );
};
