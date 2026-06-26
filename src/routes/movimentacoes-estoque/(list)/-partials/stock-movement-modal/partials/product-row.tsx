import {
  Controller,
  type Control,
  type UseFormRegister,
} from "react-hook-form";
import type { Form } from "../form";
import {
  CurrencyInput,
  ImagePreview,
  NumberInput,
  StatusBadge,
  Toggle,
} from "@components";
import type { IProduct } from "@shared/models";

type Props = {
  index: number;
  product: Pick<IProduct, "name" | "imageUrl" | "stockQuantity" | "isActive">;
  isSelected: boolean;
  isPending: boolean;
  showPrice: boolean;
  control: Control<Form>;
  register: UseFormRegister<Form>;
  error?: string;
};

export const ProductRow = ({
  index,
  product,
  isSelected,
  isPending,
  showPrice,
  control,
  register,
  error,
}: Props) => {
  const containerClass = isSelected
    ? "border-amber-500 bg-amber-500/10"
    : "border-white/10";

  return (
    <div
      className={`flex flex-col gap-3 rounded-lg border p-3 transition-colors ${containerClass}`}
    >
      <div className="flex items-center gap-3">
        <Controller
          control={control}
          name={`products.${index}.selected`}
          render={({ field }) => (
            <Toggle
              checked={field.value}
              onCheckedChange={field.onChange}
              disabled={isPending}
            />
          )}
        />

        <ImagePreview src={product.imageUrl} className="w-12 h-12" />

        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-gray-200 text-sm font-medium truncate">
              {product.name}
            </span>
            <StatusBadge variant={product.isActive ? "active" : "inactive"}>
              {product.isActive ? "Ativo" : "Inativo"}
            </StatusBadge>
          </div>
          <span className="text-gray-500 text-sm">
            Estoque atual: {product.stockQuantity}
          </span>
        </div>
      </div>

      {isSelected && (
        <div
          className={`grid gap-3 ${showPrice ? "grid-cols-2" : "grid-cols-1"}`}
        >
          <NumberInput
            label="Quantidade"
            placeholder="0"
            error={error}
            disabled={isPending}
            {...register(`products.${index}.quantity`, { valueAsNumber: true })}
          />

          {showPrice && (
            <Controller
              control={control}
              name={`products.${index}.cost`}
              render={({ field, fieldState }) => (
                <CurrencyInput
                  label="Custo unitário"
                  value={field.value ?? 0}
                  onChange={field.onChange}
                  error={fieldState.error?.message}
                  disabled={isPending}
                />
              )}
            />
          )}
        </div>
      )}
    </div>
  );
};
