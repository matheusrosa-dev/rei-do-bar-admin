import { Table as TableComponent } from "@components";
import type { ColumnDef } from "@tanstack/react-table";
import { type ISetting, SettingKey } from "@shared/models";

type Props = {
  data: ISetting[];
  isLoading?: boolean;
  isError?: boolean;
};

const SETTING_KEY_LABEL: Record<SettingKey, string> = {
  [SettingKey.DELIVERY_FEE]: "Taxa de entrega",
  [SettingKey.ALERT_MESSAGE]: "Mensagem de alerta",
  [SettingKey.DANGER_MESSAGE]: "Mensagem de perigo",
  [SettingKey.MIN_ORDER_VALUE]: "Valor mínimo do pedido",
  [SettingKey.CONTACT_PHONE]: "Telefone de contato",
  [SettingKey.CONTACT_EMAIL]: "E-mail de contato",
};

export const Table = ({ data, isLoading, isError }: Props) => {
  const settingColumns: ColumnDef<ISetting>[] = [
    {
      accessorKey: "key",
      header: "Configuração",
      cell: ({ row }) =>
        SETTING_KEY_LABEL[row.original.key] ?? row.original.key,
    },
    {
      accessorKey: "value",
      header: "Valor",
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
      />
    </div>
  );
};
