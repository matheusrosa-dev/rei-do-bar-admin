import { ConfirmModal, Table as TableComponent, Toggle } from "@components";
import type { ColumnDef } from "@tanstack/react-table";
import { useSettingsService } from "@services";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { SettingType, type ISetting } from "@shared/models";
import { useState } from "react";
import { EditModal } from "./edit-modal";
import { formatPrice } from "@shared/helpers/number";
import { formatPhone } from "@shared/helpers/string";
import { parseSettingCoupon, SETTING_KEY_LABEL } from "../-helpers";

type Props = {
  data: ISetting[];
  isLoading?: boolean;
  isError?: boolean;
};

type ModalOpen = { mode: "toggle-status"; setting: ISetting };

export const Table = ({ data, isLoading, isError }: Props) => {
  const [editingSetting, setEditingSetting] = useState<ISetting | null>(null);
  const [modalOpen, setModalOpen] = useState<ModalOpen | null>(null);

  const queryClient = useQueryClient();

  const { getSettings, activateSetting, deactivateSetting } =
    useSettingsService();

  const toggleSettingMutation = useMutation({
    mutationFn: (setting: ISetting) => {
      if (setting.isActive) {
        return deactivateSetting({ settingKey: setting.key });
      }

      return activateSetting({ settingKey: setting.key });
    },
    onSuccess: (_, setting) => {
      toast.success(
        `Configuração ${setting.isActive ? "desativada" : "ativada"} com sucesso!`,
      );
      queryClient.invalidateQueries({ queryKey: [getSettings.key] });
      setModalOpen(null);
    },
  });

  const settingColumns: ColumnDef<ISetting>[] = [
    {
      accessorKey: "key",
      header: "Configuração",
      cell: ({ row }) =>
        SETTING_KEY_LABEL[row.original.key] ?? row.original.key,
    },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: ({ row }) => {
        const setting = row.original;

        return (
          <span onClick={(e) => e.stopPropagation()} className="flex w-fit">
            <Toggle
              checked={setting.isActive}
              onCheckedChange={() =>
                setModalOpen({ mode: "toggle-status", setting })
              }
              disabled={toggleSettingMutation.isPending}
            />
          </span>
        );
      },
    },
    {
      accessorKey: "value",
      header: "Valor",
      cell: ({ row }) => {
        const setting = row.original;

        if (setting.type === SettingType.CURRENCY) {
          return formatPrice(Number(setting.value));
        }

        if (setting.type === SettingType.PHONE) {
          return formatPhone(setting.value);
        }

        if (setting.type === SettingType.COUPON) {
          const coupon = parseSettingCoupon(setting.value);

          return (
            <div className="flex flex-col gap-1">
              <div>
                Desconto:{" "}
                <span className="font-bold">
                  {formatPrice(coupon.discountValue)}
                </span>
              </div>

              <div>
                Pedido mínimo:{" "}
                <span className="font-bold">
                  {formatPrice(coupon.minOrderValue)}
                </span>
              </div>
            </div>
          );
        }

        return row.original.value;
      },
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <span
        className={`text-sm text-gray-400 ${data.length > 0 || !isLoading ? "opacity-100" : "opacity-0"}`}
      >
        {data.length} configuraç{data.length !== 1 ? "ões" : "ão"} no total
      </span>

      <TableComponent
        data={data}
        columns={settingColumns}
        isLoading={isLoading}
        isError={isError}
        limit={data.length || 5}
        onRowClick={(row) => setEditingSetting(row)}
      />

      <EditModal
        setting={editingSetting}
        onClose={() => setEditingSetting(null)}
      />

      <ConfirmModal
        isOpen={modalOpen?.mode === "toggle-status"}
        title={
          modalOpen?.mode === "toggle-status" && modalOpen.setting.isActive
            ? "Desativar configuração?"
            : "Ativar configuração?"
        }
        description={
          modalOpen?.mode === "toggle-status" && modalOpen.setting.isActive
            ? "A configuração deixará de ser aplicada."
            : "A configuração voltará a ser aplicada."
        }
        onClose={() => setModalOpen(null)}
        variant={
          modalOpen?.mode === "toggle-status" && modalOpen.setting.isActive
            ? "danger"
            : "default"
        }
        canClose={!toggleSettingMutation.isPending}
        confirmLabel={
          modalOpen?.mode === "toggle-status" && modalOpen.setting.isActive
            ? "Desativar"
            : "Ativar"
        }
        onConfirm={() => {
          if (modalOpen?.mode === "toggle-status") {
            toggleSettingMutation.mutate(modalOpen.setting);
          }
        }}
      />
    </div>
  );
};
