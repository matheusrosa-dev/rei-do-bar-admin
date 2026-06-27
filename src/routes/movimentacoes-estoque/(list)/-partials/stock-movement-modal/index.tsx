import { Button, Input, Modal, Select } from "@components";
import { useInventoryService, useProductsService } from "@services";
import { InventoryMovementOrigin } from "@shared/models";
import * as RadixDialog from "@radix-ui/react-dialog";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { MOVEMENT_PROPS_BY_ORIGIN } from "../../-helpers";
import { defaultValues, resolver, type Form } from "./form";
import { ProductRow } from "./partials";
import { FiSearch } from "react-icons/fi";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const ORIGIN_OPTIONS = [
  InventoryMovementOrigin.ADMIN_RESTOCK,
  InventoryMovementOrigin.ADMIN_REMOVAL,
];

export const StockMovementModal = ({ isOpen, onClose }: Props) => {
  const [searchTerm, setSearchTerm] = useState("");

  const queryClient = useQueryClient();
  const { incrementInventory, decrementInventory, getInventoryMovements } =
    useInventoryService();
  const { getProductsSimple } = useProductsService();

  const { data: products, isLoading } = useQuery({
    queryKey: [getProductsSimple.key],
    queryFn: getProductsSimple.fn,
    enabled: isOpen,
    retry: false,
  });

  const validationContext = useRef({ origin: defaultValues.origin });

  const {
    control,
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<Form>({
    defaultValues,
    resolver,
    context: validationContext.current,
  });

  const { fields, replace } = useFieldArray({ control, name: "products" });

  const filteredFields = fields
    .map((field, index) => ({ field, index }))
    .filter(({ field }) =>
      field.name.toLowerCase().includes((searchTerm ?? "").toLowerCase()),
    );

  const origin = watch("origin");
  const showPrice = origin === InventoryMovementOrigin.ADMIN_RESTOCK;
  validationContext.current.origin = origin;

  const selectedCount = watch("products").filter(
    (product) => product.selected,
  ).length;

  const onCloseHandler = () => {
    reset();
    setSearchTerm("");
    onClose();
  };

  const incrementMutation = useMutation({
    mutationFn: incrementInventory,
    onSuccess: () => {
      toast.success("Movimentação registrada com sucesso!");
      queryClient.invalidateQueries({ queryKey: [getInventoryMovements.key] });
      queryClient.invalidateQueries({ queryKey: [getProductsSimple.key] });
      onCloseHandler();
    },
  });

  const decrementMutation = useMutation({
    mutationFn: decrementInventory,
    onSuccess: () => {
      toast.success("Movimentação registrada com sucesso!");
      queryClient.invalidateQueries({ queryKey: [getInventoryMovements.key] });
      queryClient.invalidateQueries({ queryKey: [getProductsSimple.key] });
      onCloseHandler();
    },
  });

  const onSubmit = (data: Form) => {
    const movementProducts = data.products
      .filter((product) => product.selected)
      .map((product) => ({
        productId: product.productId,
        quantity: Number(product.quantity),
        totalCost: Number(product.totalCost),
      }));

    if (data.origin === InventoryMovementOrigin.ADMIN_REMOVAL) {
      decrementMutation.mutate({ movementProducts });
      return;
    }
    incrementMutation.mutate({
      movementProducts,
    });
  };

  const selectionError = errors.products?.root?.message;

  useEffect(() => {
    if (!isOpen || !products?.length) return;

    replace(
      products.map((product) => ({
        productId: product.id,
        name: product.name,
        imageUrl: product.imageUrl,
        stockQuantity: product.stockQuantity,
        price: product.price,
        isActive: product.isActive,
        selected: false,
        quantity: undefined,
        totalCost: 0,
      })),
    );
  }, [isOpen, products, replace]);

  return (
    <Modal
      isOpen={isOpen}
      canClose={!incrementMutation.isPending}
      onClose={onCloseHandler}
    >
      <div className="flex flex-col gap-6 pr-1">
        <div className="flex flex-col gap-1">
          <RadixDialog.Title className="text-white font-bold text-lg">
            Movimentar estoque
          </RadixDialog.Title>

          <RadixDialog.Description className="text-zinc-400 text-sm">
            Selecione os produtos e informe a quantidade e o preço da
            movimentação.
          </RadixDialog.Description>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Controller
            control={control}
            name="origin"
            render={({ field, fieldState }) => (
              <Select
                label="Tipo de movimentação"
                options={ORIGIN_OPTIONS.map((origin) => ({
                  label: MOVEMENT_PROPS_BY_ORIGIN[origin].originTranslation,
                  value: origin,
                }))}
                value={field.value}
                onChange={field.onChange}
                disabled={incrementMutation.isPending}
                error={fieldState.error?.message}
              />
            )}
          />

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="text-zinc-300 text-sm font-medium">
                Produtos
              </span>
            </div>

            <Input
              placeholder="Pesquisar"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftIcon={<FiSearch className="size-4" />}
            />

            <span className="text-sm block text-end my-1 text-amber-500 font-medium">
              {selectedCount} selecionado{selectedCount !== 1 ? "s" : ""}
            </span>

            <div className="h-80 max-h-80 overflow-y-auto pr-1">
              {isLoading && (
                <span className="text-zinc-500 text-sm text-center block">
                  Carregando produtos...
                </span>
              )}

              {Boolean(!isLoading && !filteredFields.length) && (
                <span className="text-zinc-500 text-sm text-center block">
                  Nenhum produto encontrado.
                </span>
              )}

              {Boolean(!isLoading && !!filteredFields.length) && (
                <div className="flex flex-col gap-2">
                  {filteredFields.map(({ field, index }) => (
                    <ProductRow
                      key={field.id}
                      index={index}
                      product={{
                        imageUrl: field.imageUrl,
                        name: field.name,
                        stockQuantity: field.stockQuantity,
                        isActive: field.isActive,
                      }}
                      isSelected={!!watch(`products.${index}.selected`)}
                      isPending={incrementMutation.isPending}
                      showPrice={showPrice}
                      control={control}
                      register={register}
                      error={errors.products?.[index]?.quantity?.message}
                    />
                  ))}
                </div>
              )}
            </div>

            {selectionError && (
              <span className="text-red-500 text-xs">{selectionError}</span>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={onCloseHandler}
              disabled={incrementMutation.isPending}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={incrementMutation.isPending || isLoading}
            >
              {incrementMutation.isPending ? "Salvando..." : "Confirmar"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
