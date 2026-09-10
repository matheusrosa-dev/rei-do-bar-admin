import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import { Wrapper } from "@components";
import type {
  ICategoryGroupWithProducts,
  IProductWithCategory,
} from "@shared/models";
import { useState } from "react";
import { FiX } from "react-icons/fi";
import { MdUndo } from "react-icons/md";
import { AddProductCard } from "./add-product-card";
import { FilterChips } from "./filter-chips";
import { SortableProductCard } from "./sortable-product-card";

type Props = {
  group: ICategoryGroupWithProducts;
  isReordering: boolean;
  isOrderDirty: boolean;
  pendingProductId: string | null;
  onResetOrder: () => void;
  onToggleProduct: (product: IProductWithCategory) => void;
  onRemoveProduct: (product: IProductWithCategory) => void;
};

type FilterOption = {
  value: string;
  label: string;
  matches: (product: IProductWithCategory) => boolean;
};

const LOW_STOCK_LIMIT = 10;

const STOCK_OPTIONS: FilterOption[] = [
  {
    value: "out-of-stock",
    label: "Esgotado",
    matches: (product) => product.stockQuantity === 0,
  },
  {
    value: "low-stock",
    label: "Acabando",
    matches: (product) =>
      product.stockQuantity > 0 && product.stockQuantity <= LOW_STOCK_LIMIT,
  },
];

const STATUS_OPTIONS: FilterOption[] = [
  {
    value: "active",
    label: "Ativo",
    matches: (product) => product.isActive,
  },
  {
    value: "inactive",
    label: "Inativo",
    matches: (product) => !product.isActive,
  },
];

const getCategoryOptions = (products: IProductWithCategory[]) => {
  const categoriesById = new Map(
    products.map((product) => [product.category.id, product.category]),
  );

  if (categoriesById.size < 2) return [];

  return [...categoriesById.values()].map<FilterOption>((category) => ({
    value: category.id,
    label: category.pluralName,
    matches: (product) => product.category.id === category.id,
  }));
};

const getFilterDimensions = (products: IProductWithCategory[]) => [
  {
    key: "category",
    legend: "Categoria",
    options: getCategoryOptions(products),
  },
  {
    key: "stock",
    legend: "Estoque",
    options: STOCK_OPTIONS.filter((option) => products.some(option.matches)),
  },
  {
    key: "status",
    legend: "Status",
    options: products.length > 0 ? STATUS_OPTIONS : [],
  },
];

export const ProductGroupBlock = ({
  group,
  isReordering,
  isOrderDirty,
  pendingProductId,
  onResetOrder,
  onToggleProduct,
  onRemoveProduct,
}: Props) => {
  const [selection, setSelection] = useState<Record<string, string>>({});

  const hasProducts = group.products.length > 0;

  const dimensions = getFilterDimensions(group.products).map((dimension) => {
    const selectedOption = dimension.options.find(
      (option) => option.value === selection[dimension.key],
    );

    return { ...dimension, selectedOption };
  });

  const filteredProducts = group.products.filter((product) =>
    dimensions.every(
      ({ selectedOption }) =>
        !selectedOption || selectedOption.matches(product),
    ),
  );

  const products = isReordering ? group.products : filteredProducts;

  const hasSelection = dimensions.some(({ selectedOption }) => selectedOption);

  const onClearFilters = () => setSelection({});

  const onSelectFilter = (
    dimension: (typeof dimensions)[number],
    value: string,
  ) => {
    const nextValue = dimension.selectedOption?.value === value ? null : value;

    const nextSelection: Record<string, string> = {};

    for (const item of dimensions) {
      const itemValue =
        item.key === dimension.key ? nextValue : item.selectedOption?.value;

      if (itemValue) nextSelection[item.key] = itemValue;
    }

    setSelection(nextSelection);
  };

  return (
    <Wrapper className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-white text-lg font-bold">{group.name}</h2>

        {isReordering && isOrderDirty && (
          <button
            type="button"
            onClick={onResetOrder}
            className="select-none flex items-center gap-1.5 px-3 py-2.5 rounded-lg text-sm font-medium text-amber-500 cursor-pointer transition-colors duration-150 hover:bg-amber-500/10 focus:outline-none focus:ring-1 focus:ring-amber-500"
          >
            <MdUndo className="size-4" />
            Resetar ordem
          </button>
        )}
      </div>

      <hr className="border-white/10" />

      <div className="flex flex-wrap items-end gap-x-6 gap-y-3 empty:hidden">
        {!isReordering &&
          dimensions
            .filter((dimension) => dimension.options.length > 0)
            .map((dimension) => (
              <FilterChips
                key={dimension.key}
                legend={dimension.legend}
                options={dimension.options}
                selected={dimension.selectedOption?.value ?? null}
                onSelect={(value) => onSelectFilter(dimension, value)}
              />
            ))}

        {!isReordering && hasSelection && (
          <button
            type="button"
            onClick={onClearFilters}
            className="flex items-center gap-1.5 px-3 py-2.5 text-sm text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <FiX className="size-4" />
            Limpar filtros
          </button>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <SortableContext
          disabled={!isReordering}
          items={products.map((product) => product.id)}
          strategy={rectSortingStrategy}
        >
          {products.map((product, index) => (
            <SortableProductCard
              key={product.id}
              product={product}
              position={index + 1}
              isReordering={isReordering}
              isPending={pendingProductId === product.id}
              onToggle={() => onToggleProduct(product)}
              onRemove={() => onRemoveProduct(product)}
            />
          ))}
        </SortableContext>

        {products.length === 0 && hasSelection && (
          <div
            role="status"
            className="col-span-full flex items-center justify-center p-8 rounded-lg border border-dashed border-white/10 text-gray-400 text-sm"
          >
            Nenhum produto para os filtros selecionados.
          </div>
        )}

        {!isReordering && (
          <AddProductCard
            groupId={group.id}
            className={products.length === 0 ? "col-span-full" : undefined}
          />
        )}

        {isReordering && !hasProducts && (
          <div className="col-span-full flex items-center justify-center p-8 rounded-lg border border-dashed border-white/10 text-gray-400 text-sm">
            Nenhum produto neste grupo
          </div>
        )}
      </div>
    </Wrapper>
  );
};
