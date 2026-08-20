import { MultiSelect, RefetchButton } from "@components";
import type { NotificationStatus, NotificationTarget } from "@shared/models";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { FiX } from "react-icons/fi";
import { STATUS_FILTER_OPTIONS, TARGET_FILTER_OPTIONS } from "../-helpers";

type Props = {
  onRefetch: () => void;
  isRefetching: boolean;
};

export const Filters = ({ onRefetch, isRefetching }: Props) => {
  const { target, status } = useSearch({
    from: "/notificacoes/(list)/",
  });

  const navigate = useNavigate({
    from: "/notificacoes/",
  });

  const onChangeTargetFilter = (value: string[]) => {
    navigate({
      search: (prev) => ({
        ...prev,
        target: value.length > 0 ? (value as NotificationTarget[]) : undefined,
        page: undefined,
      }),
    });
  };

  const onChangeStatusFilter = (value: string[]) => {
    navigate({
      search: (prev) => ({
        ...prev,
        status: value.length > 0 ? (value as NotificationStatus[]) : undefined,
        page: undefined,
      }),
    });
  };

  const hasActiveFilters = Boolean(target?.length || status?.length);

  return (
    <div className="flex items-end gap-3">
      <div className="flex gap-3 flex-wrap">
        <div className="w-64">
          <MultiSelect
            label="Segmento"
            placeholder="Todos os segmentos"
            options={TARGET_FILTER_OPTIONS}
            value={target ?? []}
            onChange={onChangeTargetFilter}
            active={Boolean(target?.length)}
            clearable
          />
        </div>

        <div className="w-48">
          <MultiSelect
            label="Status"
            placeholder="Todos os status"
            options={STATUS_FILTER_OPTIONS}
            value={status ?? []}
            onChange={onChangeStatusFilter}
            active={Boolean(status?.length)}
            clearable
          />
        </div>
      </div>

      {hasActiveFilters && (
        <button
          type="button"
          onClick={() => navigate({ search: () => ({}) })}
          className="flex items-center gap-1.5 px-3 py-2.5 text-sm text-zinc-400 hover:text-white transition-colors cursor-pointer"
        >
          <FiX className="size-4" />
          Limpar filtros
        </button>
      )}

      <RefetchButton
        onRefetch={onRefetch}
        isRefetching={isRefetching}
        className="ml-auto"
      />
    </div>
  );
};
