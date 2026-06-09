import { RefetchButton, Select } from "@components";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { FiX } from "react-icons/fi";

type Props = {
  onRefetch: () => void;
  isRefetching: boolean;
};

const STATUS_OPTIONS = [
  { value: "all", label: "Todos" },
  { value: "true", label: "Ativo" },
  { value: "false", label: "Inativo" },
];

export const Filters = ({ onRefetch, isRefetching }: Props) => {
  const { isActive } = useSearch({ from: "/clientes/(list)/" });

  const navigate = useNavigate({ from: "/clientes/" });

  const statusValue =
    isActive === true ? "true" : isActive === false ? "false" : "all";

  const hasActiveFilters = statusValue !== "all";

  const onChangeStatusFilter = (value: string) => {
    navigate({
      search: (prev) => ({
        ...prev,
        isActive: value === "all" ? undefined : value === "true",
        page: undefined,
      }),
    });
  };

  return (
    <div className="flex items-end gap-3">
      <div className="flex gap-3 flex-wrap">
        <div className="w-28">
          <Select
            label="Status"
            placeholder="Todos"
            options={STATUS_OPTIONS}
            value={statusValue}
            onChange={(newValue) => onChangeStatusFilter(newValue || "all")}
            active={statusValue !== "all"}
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
