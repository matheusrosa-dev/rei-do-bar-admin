import { MultiSelect, RefetchButton } from "@components";
import type { InventoryMovementOrigin, IProduct } from "@shared/models";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { FiX } from "react-icons/fi";
import { ORIGIN_FILTER_OPTIONS } from "../-helpers";

type Props = {
  products: IProduct[];
  onRefetch: () => void;
  isRefetching: boolean;
};

export const Filters = ({ products, onRefetch, isRefetching }: Props) => {
  const { origin, productIds } = useSearch({
    from: "/movimentacoes-estoque/(list)/",
  });

  const navigate = useNavigate({
    from: "/movimentacoes-estoque/",
  });

  const productOptions = products.map((product) => ({
    value: product.id,
    label: product.name,
  }));

  const onChangeOriginFilter = (value: string[]) => {
    navigate({
      search: (prev) => ({
        ...prev,
        origin:
          value.length > 0 ? (value as InventoryMovementOrigin[]) : undefined,
        page: undefined,
      }),
    });
  };

  const onChangeProductFilter = (value: string[]) => {
    navigate({
      search: (prev) => ({
        ...prev,
        productIds: value.length > 0 ? value : undefined,
        page: undefined,
      }),
    });
  };

  const hasActiveFilters = Boolean(origin?.length || productIds?.length);

  return (
    <div className="flex items-end gap-3">
      <div className="flex gap-3 flex-wrap">
        <div className="w-64">
          <MultiSelect
            label="Origem"
            placeholder="Todas as origens"
            options={ORIGIN_FILTER_OPTIONS}
            value={origin ?? []}
            onChange={onChangeOriginFilter}
            active={Boolean(origin?.length)}
            clearable
          />
        </div>

        <div className="w-64">
          <MultiSelect
            label="Produto"
            placeholder="Todos os produtos"
            options={productOptions}
            value={productIds ?? []}
            onChange={onChangeProductFilter}
            active={Boolean(productIds?.length)}
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
