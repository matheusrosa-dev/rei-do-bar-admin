import {
  StatusBadge,
  Table as TableComponent,
  Toggle,
  TrashButton,
} from "@components";
import { useCouponsService } from "@services";
import { formatPrice } from "@shared/helpers/number";
import { formatCalendarDate } from "@shared/helpers/string";
import type { IPagination } from "@shared/interfaces";
import type { ICoupon } from "@shared/models";
import { useNavigate } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { toast } from "sonner";
import { formatDiscountValue, getCouponSituation } from "../-helpers";
import { CouponModal } from "./coupon-modal";
import { RemoveModal } from "./remove-modal";
import { StatusModal } from "./status-modal";

type Props = {
  data: ICoupon[];
  meta?: IPagination<unknown>["meta"];
  limit: number;
  isLoading?: boolean;
  isError?: boolean;
};

type ModalOpen =
  | { mode: "remove"; couponId: string }
  | { mode: "edit"; coupon: ICoupon }
  | { mode: "toggle-status"; coupon: ICoupon };

export const Table = ({ data, meta, limit, isLoading, isError }: Props) => {
  const [modalOpen, setModalOpen] = useState<ModalOpen | null>(null);

  const navigate = useNavigate({ from: "/cupons/" });
  const queryClient = useQueryClient();

  const { getCoupons, removeCoupon, activateCoupon, deactivateCoupon } =
    useCouponsService();

  const removeMutation = useMutation({
    mutationFn: removeCoupon,
    onSuccess: () => {
      toast.success("Cupom removido com sucesso!");
      queryClient.invalidateQueries({ queryKey: [getCoupons.key] });
      setModalOpen(null);
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: (coupon: ICoupon) => {
      if (coupon.isActive) {
        return deactivateCoupon(coupon.id);
      }
      return activateCoupon(coupon.id);
    },
    onSuccess: (updatedCoupon) => {
      toast.success(
        `Cupom ${updatedCoupon.isActive ? "ativado" : "desativado"} com sucesso!`,
      );
      queryClient.invalidateQueries({ queryKey: [getCoupons.key] });
      setModalOpen(null);
    },
  });

  const couponColumns: ColumnDef<ICoupon>[] = [
    {
      accessorKey: "code",
      header: "Código",
      cell: ({ getValue }) => (
        <span className="font-medium text-white">{getValue<string>()}</span>
      ),
    },
    {
      accessorKey: "discountValue",
      header: "Desconto",
      cell: ({ row }) =>
        formatDiscountValue(
          row.original.discountType,
          row.original.discountValue,
        ),
    },
    {
      accessorKey: "minOrderValue",
      header: "Pedido mínimo (inclui frete)",
      cell: ({ getValue }) => formatPrice(getValue<number>()),
    },
    {
      accessorKey: "startsAt",
      header: "Início",
      cell: ({ getValue }) => formatCalendarDate(getValue<string>()),
    },
    {
      accessorKey: "endsAt",
      header: "Término",
      cell: ({ getValue }) => {
        const endsAt = getValue<string | null>();
        return endsAt ? formatCalendarDate(endsAt) : "Sem término";
      },
    },
    {
      accessorKey: "usageLimit",
      header: "Limite de uso",
      cell: ({ getValue }) => getValue<number | null>() ?? "Ilimitado",
    },
    {
      accessorKey: "usageCount",
      header: "Usos",
      cell: ({ getValue }) => getValue<number>(),
    },
    {
      id: "situation",
      header: "Situação",
      cell: ({ row }) => {
        const { label, variant } = getCouponSituation(row.original);
        return <StatusBadge variant={variant}>{label}</StatusBadge>;
      },
    },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: ({ row }) => {
        const coupon = row.original;
        return (
          <span onClick={(e) => e.stopPropagation()} className="flex w-fit">
            <Toggle
              checked={coupon.isActive}
              onCheckedChange={() =>
                setModalOpen({ mode: "toggle-status", coupon })
              }
              disabled={toggleStatusMutation.isPending}
            />
          </span>
        );
      },
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <TrashButton
          onClick={() =>
            setModalOpen({ mode: "remove", couponId: row.original.id })
          }
        />
      ),
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
        {meta?.total} cupo{meta?.total !== 1 ? "ns" : "m"} no total
      </span>

      <TableComponent
        data={data}
        columns={couponColumns}
        isLoading={isLoading}
        isError={isError}
        limit={limit}
        onRowClick={(coupon) => setModalOpen({ mode: "edit", coupon })}
      />

      {meta?.totalPages && (
        <TableComponent.Pagination meta={meta} onChangePage={setPage} />
      )}

      <CouponModal
        isOpen={modalOpen?.mode === "edit"}
        coupon={modalOpen?.mode === "edit" ? modalOpen.coupon : undefined}
        onClose={() => setModalOpen(null)}
      />

      <RemoveModal
        isOpen={modalOpen?.mode === "remove"}
        canClose={!removeMutation.isPending}
        onClose={() => setModalOpen(null)}
        onConfirm={() => {
          if (modalOpen?.mode === "remove") {
            removeMutation.mutate(modalOpen.couponId);
          }
        }}
      />

      <StatusModal
        isOpen={modalOpen?.mode === "toggle-status"}
        onClose={() => setModalOpen(null)}
        mode={
          modalOpen?.mode === "toggle-status" && modalOpen.coupon.isActive
            ? "deactivate"
            : "activate"
        }
        canClose={!toggleStatusMutation.isPending}
        onConfirm={() => {
          if (modalOpen?.mode === "toggle-status") {
            toggleStatusMutation.mutate(modalOpen.coupon);
          }
        }}
      />
    </div>
  );
};
