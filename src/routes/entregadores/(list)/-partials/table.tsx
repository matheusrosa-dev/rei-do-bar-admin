import { StatusBadge, Table as TableComponent, Toggle } from "@components";
import { useDeliveryPersonsService } from "@services";
import type { IPagination } from "@shared/interfaces";
import type {
  IDeliveryPerson,
  IDeliveryPersonWithAccess,
} from "@shared/models";
import { formatPhone, formatZipCode } from "@shared/helpers/string";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { toast } from "sonner";
import { DeliveryPersonModal } from "./delivery-person-modal";
import { PasswordModal } from "./password-modal";
import { RemoveModal } from "./remove-modal";
import { RevokeAccessModal } from "./revoke-access-modal";
import { RowActions } from "./row-actions";
import { StatusModal } from "./status-modal";

type Props = {
  data: IDeliveryPersonWithAccess[];
  meta?: IPagination<unknown>["meta"];
  limit: number;
  isLoading?: boolean;
  isError?: boolean;
};

type ModalOpen =
  | { mode: "edit"; deliveryPerson: IDeliveryPerson }
  | { mode: "remove"; deliveryPersonId: string }
  | { mode: "password"; deliveryPerson: IDeliveryPerson }
  | { mode: "revoke-access"; deliveryPersonId: string }
  | { mode: "toggle-status"; deliveryPerson: IDeliveryPerson };

export const Table = ({ data, meta, limit, isLoading, isError }: Props) => {
  const [modalOpen, setModalOpen] = useState<ModalOpen | null>(null);

  const navigate = useNavigate({ from: "/entregadores/" });
  const queryClient = useQueryClient();

  const {
    getDeliveryPersons,
    getDeliveryPersonsHasAccess,
    removeDeliveryPerson,
    activateDeliveryPerson,
    deactivateDeliveryPerson,
    revokeDeliveryPersonAccess,
  } = useDeliveryPersonsService();

  const removeMutation = useMutation({
    mutationFn: removeDeliveryPerson,
    onSuccess: () => {
      toast.success("Entregador removido com sucesso!");
      queryClient.invalidateQueries({ queryKey: [getDeliveryPersons.key] });
      queryClient.invalidateQueries({
        queryKey: [getDeliveryPersonsHasAccess.key],
      });
      setModalOpen(null);
    },
  });

  const revokeAccessMutation = useMutation({
    mutationFn: revokeDeliveryPersonAccess,
    onSuccess: () => {
      toast.success("Acesso removido com sucesso!");
      queryClient.invalidateQueries({ queryKey: [getDeliveryPersons.key] });
      queryClient.invalidateQueries({
        queryKey: [getDeliveryPersonsHasAccess.key],
      });
      setModalOpen(null);
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: (deliveryPerson: IDeliveryPerson) => {
      if (deliveryPerson.isActive) {
        return deactivateDeliveryPerson(deliveryPerson.id);
      }
      return activateDeliveryPerson(deliveryPerson.id);
    },
    onSuccess: (updatedDeliveryPerson) => {
      toast.success(
        `Entregador ${updatedDeliveryPerson.isActive ? "ativado" : "desativado"} com sucesso!`,
      );
      queryClient.invalidateQueries({ queryKey: [getDeliveryPersons.key] });
      setModalOpen(null);
    },
  });

  const deliveryPersonColumns: ColumnDef<IDeliveryPersonWithAccess>[] = [
    {
      accessorKey: "name",
      header: "Nome",
      cell: ({ getValue }) => (
        <span className="font-medium text-white">{getValue<string>()}</span>
      ),
    },
    {
      accessorKey: "phone",
      header: "Telefone",
      cell: ({ getValue }) => formatPhone(getValue<string>()),
    },
    {
      accessorKey: "cpf",
      header: "CPF",
      cell: ({ getValue }) => {
        const digits = getValue<string>();
        return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
      },
    },
    {
      accessorKey: "address",
      header: "Bairro",
      cell: ({ row }) => row.original.address.neighborhood,
    },
    {
      accessorKey: "address",
      header: "CEP",
      cell: ({ row }) => formatZipCode(row.original.address.zipCode),
    },
    {
      accessorKey: "ordersCount",
      header: "Entregas",
      cell: ({ getValue }) => (
        <span className="ml-10">{getValue<number>()}</span>
      ),
    },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: ({ row }) => {
        const deliveryPerson = row.original;
        return (
          <span onClick={(e) => e.stopPropagation()} className="flex w-fit">
            <Toggle
              checked={deliveryPerson.isActive}
              onCheckedChange={() =>
                setModalOpen({ mode: "toggle-status", deliveryPerson })
              }
              disabled={toggleStatusMutation.isPending}
            />
          </span>
        );
      },
    },
    {
      accessorKey: "hasAccess",
      header: "Acesso",
      cell: ({ getValue }) => {
        const hasAccess = getValue<boolean>();
        return (
          <StatusBadge variant={hasAccess ? "active" : "neutral"}>
            {hasAccess ? "Com acesso" : "Sem acesso"}
          </StatusBadge>
        );
      },
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => {
        const deliveryPerson = row.original;
        return (
          <RowActions
            ordersCount={deliveryPerson.ordersCount}
            hasAccess={deliveryPerson.hasAccess}
            isActive={deliveryPerson.isActive}
            disabled={
              revokeAccessMutation.isPending || removeMutation.isPending
            }
            onSetPassword={() =>
              setModalOpen({ mode: "password", deliveryPerson })
            }
            onRevokeAccess={() =>
              setModalOpen({
                mode: "revoke-access",
                deliveryPersonId: deliveryPerson.id,
              })
            }
            onRemove={() =>
              setModalOpen({
                mode: "remove",
                deliveryPersonId: deliveryPerson.id,
              })
            }
          />
        );
      },
    },
  ];

  const setPage = (page: number) => {
    navigate({
      search: (prev) => ({ ...prev, page: page > 1 ? page : undefined }),
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <span
        className={`text-sm text-gray-400 ${meta ? "opacity-100" : "opacity-0"}`}
      >
        {meta?.total} entregador
        {meta?.total !== 1 ? "es" : ""} no total
      </span>

      <TableComponent
        data={data}
        columns={deliveryPersonColumns}
        isLoading={isLoading}
        isError={isError}
        limit={limit}
        onRowClick={(deliveryPerson) =>
          setModalOpen({ mode: "edit", deliveryPerson })
        }
      />

      {meta?.totalPages && (
        <TableComponent.Pagination meta={meta} onChangePage={setPage} />
      )}

      <DeliveryPersonModal
        isOpen={modalOpen?.mode === "edit"}
        onClose={() => setModalOpen(null)}
        deliveryPerson={
          modalOpen?.mode === "edit" ? modalOpen.deliveryPerson : undefined
        }
      />

      <PasswordModal
        isOpen={modalOpen?.mode === "password"}
        onClose={() => setModalOpen(null)}
        deliveryPerson={
          modalOpen?.mode === "password" ? modalOpen.deliveryPerson : undefined
        }
      />

      <RevokeAccessModal
        isOpen={modalOpen?.mode === "revoke-access"}
        canClose={!revokeAccessMutation.isPending}
        onClose={() => setModalOpen(null)}
        onConfirm={() => {
          if (modalOpen?.mode === "revoke-access") {
            revokeAccessMutation.mutate(modalOpen.deliveryPersonId);
          }
        }}
      />

      <RemoveModal
        isOpen={modalOpen?.mode === "remove"}
        canClose={!removeMutation.isPending}
        onClose={() => setModalOpen(null)}
        onConfirm={() => {
          if (modalOpen?.mode === "remove") {
            removeMutation.mutate(modalOpen.deliveryPersonId);
          }
        }}
      />

      <StatusModal
        isOpen={modalOpen?.mode === "toggle-status"}
        onClose={() => setModalOpen(null)}
        mode={
          modalOpen?.mode === "toggle-status" &&
          modalOpen.deliveryPerson.isActive
            ? "deactivate"
            : "activate"
        }
        canClose={!toggleStatusMutation.isPending}
        onConfirm={() => {
          if (modalOpen?.mode === "toggle-status") {
            toggleStatusMutation.mutate(modalOpen.deliveryPerson);
          }
        }}
      />
    </div>
  );
};
