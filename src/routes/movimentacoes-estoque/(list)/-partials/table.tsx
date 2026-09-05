import { StatusBadge, Table as TableComponent, Tooltip } from "@components";
import { useInventoryService, useProductsService } from "@services";
import { formatPrice } from "@shared/helpers/number";
import { formatDateTime } from "@shared/helpers/string";
import type { IPagination } from "@shared/interfaces";
import {
  type IInventoryMovement,
  InventoryMovementOrigin,
} from "@shared/models";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import {
  RiArrowGoBackLine,
  RiExternalLinkLine,
  RiPencilLine,
} from "react-icons/ri";
import { toast } from "sonner";
import {
  ADMIN_ORIGINS,
  MOVEMENT_PROPS_BY_ORIGIN,
  MOVEMENT_QUANTITY_CLASS,
} from "../-helpers";
import { RevertMovementModal } from "./revert-movement-modal";
import { StockMovementModal } from "./stock-movement-modal";

type Props = {
  data: IInventoryMovement[];
  meta?: IPagination<unknown>["meta"];
  limit: number;
  isLoading?: boolean;
  isError?: boolean;
};

type ModalOpen =
  | { mode: "edit"; movement: IInventoryMovement }
  | { mode: "revert"; movementId: string };

const LOCKED_RESTOCK_MESSAGE =
  "Esta reposição não pode mais ser alterada porque um pedido ou remoção de estoque foi criado após ela.";

export const Table = ({ data, meta, limit, isLoading, isError }: Props) => {
  const [modalOpen, setModalOpen] = useState<ModalOpen | null>(null);

  const navigate = useNavigate({ from: "/movimentacoes-estoque/" });
  const queryClient = useQueryClient();

  const { getInventoryMovements, revertInventoryMovement } =
    useInventoryService();
  const { getProductsSimple } = useProductsService();

  const revertMutation = useMutation({
    mutationFn: revertInventoryMovement,
    onSuccess: () => {
      toast.success("Reposição revertida com sucesso!");
      queryClient.invalidateQueries({ queryKey: [getInventoryMovements.key] });
      queryClient.invalidateQueries({ queryKey: [getProductsSimple.key] });
      setModalOpen(null);
    },
  });

  const movementColumns: ColumnDef<IInventoryMovement>[] = [
    {
      accessorKey: "origin",
      header: "Origem",
      cell: ({ row }) => {
        const { originVariant, originTranslation } =
          MOVEMENT_PROPS_BY_ORIGIN[row.original.origin];

        return (
          <StatusBadge variant={originVariant}>{originTranslation}</StatusBadge>
        );
      },
    },
    {
      id: "is-admin",
      cell: ({ row }) => {
        const isAdmin = ADMIN_ORIGINS.includes(row.original.origin);

        if (!isAdmin) return null;

        return <StatusBadge variant="alert">Admin</StatusBadge>;
      },
    },
    {
      id: "items",
      header: "Itens",
      cell: ({ row }) => {
        const { quantityVariant: variant, showsPrice } =
          MOVEMENT_PROPS_BY_ORIGIN[row.original.origin];

        const sign = variant === "active" ? "+" : "-";
        const { products } = row.original;

        return (
          <div className={`flex max-w-48 flex-col gap-2`}>
            {products.map((item) => (
              <span key={item.id} className="whitespace-nowrap">
                <span className={MOVEMENT_QUANTITY_CLASS[variant]}>
                  {sign}
                  {item.quantity} {item.product.name}{" "}
                </span>
                {showsPrice && (
                  <span className="text-gray-400 text-xs">
                    ({formatPrice(item.price)} unidade)
                  </span>
                )}
              </span>
            ))}
          </div>
        );
      },
    },
    {
      id: "total",
      header: "Total",
      cell: ({ row }) => {
        const { showsPrice } = MOVEMENT_PROPS_BY_ORIGIN[row.original.origin];

        if (!showsPrice) {
          return "-";
        }

        const total = row.original.products.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0,
        );

        return (
          <span className="whitespace-nowrap font-medium">
            {formatPrice(total)}
          </span>
        );
      },
    },
    {
      accessorKey: "order",
      header: "Pedido",
      cell: ({ row }) => {
        const order = row.original?.order;
        if (!order) {
          return "-";
        }

        return (
          <Link
            className="text-gray-400 text-sm underline flex w-fit flex-nowrap items-center gap-1 duration-150 hover:text-white"
            to="/pedidos"
            search={{ searchTerm: String(order.orderNumber) }}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
          >
            #{order.orderNumber}
            <RiExternalLinkLine />
          </Link>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Data",
      cell: ({ getValue }) => formatDateTime(getValue<string>()),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => {
        const { origin, editable, id } = row.original;

        if (origin !== InventoryMovementOrigin.ADMIN_RESTOCK) return null;

        return (
          <div className="flex items-center justify-end gap-1">
            <Tooltip disabled={editable} content={LOCKED_RESTOCK_MESSAGE}>
              <span className="flex">
                <button
                  type="button"
                  title="Editar"
                  aria-label="Editar reposição de estoque"
                  disabled={!editable || revertMutation.isPending}
                  onClick={(e) => {
                    e.stopPropagation();
                    setModalOpen({ mode: "edit", movement: row.original });
                  }}
                  className="cursor-pointer p-2 rounded-md text-zinc-400 transition-colors not-disabled:hover:bg-white/5 not-disabled:hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <RiPencilLine className="size-4" />
                </button>
              </span>
            </Tooltip>

            <Tooltip disabled={editable} content={LOCKED_RESTOCK_MESSAGE}>
              <span className="flex">
                <button
                  type="button"
                  title="Reverter"
                  aria-label="Reverter reposição de estoque"
                  disabled={!editable || revertMutation.isPending}
                  onClick={(e) => {
                    e.stopPropagation();
                    setModalOpen({ mode: "revert", movementId: id });
                  }}
                  className="cursor-pointer p-2 rounded-md text-red-500 transition-colors not-disabled:hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <RiArrowGoBackLine className="size-4" />
                </button>
              </span>
            </Tooltip>
          </div>
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
        {meta?.total} movimentaç{meta?.total !== 1 ? "ões" : "ão"} no total
      </span>

      <TableComponent
        data={data}
        columns={movementColumns}
        isLoading={isLoading}
        isError={isError}
        limit={limit}
      />

      {meta?.totalPages && (
        <TableComponent.Pagination meta={meta} onChangePage={setPage} />
      )}

      <StockMovementModal
        isOpen={modalOpen?.mode === "edit"}
        movement={modalOpen?.mode === "edit" ? modalOpen.movement : undefined}
        onClose={() => setModalOpen(null)}
      />

      <RevertMovementModal
        isOpen={modalOpen?.mode === "revert"}
        canClose={!revertMutation.isPending}
        onClose={() => setModalOpen(null)}
        onConfirm={() => {
          if (modalOpen?.mode === "revert") {
            revertMutation.mutate(modalOpen.movementId);
          }
        }}
      />
    </div>
  );
};
