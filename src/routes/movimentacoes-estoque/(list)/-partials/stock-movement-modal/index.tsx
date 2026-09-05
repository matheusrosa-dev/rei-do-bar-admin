import { Button, Input, Modal, Select, Tooltip } from "@components";
import { useInventoryService, useProductsService } from "@services";
import {
  InventoryMovementOrigin,
  type IInventoryMovement,
} from "@shared/models";
import type { MovementProductsBody } from "@shared/services/inventory/types";
import * as RadixDialog from "@radix-ui/react-dialog";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { MOVEMENT_PROPS_BY_ORIGIN } from "../../-helpers";
import { toFormValues } from "./-helpers";
import { defaultValues, resolver, type Form } from "./form";
import { ConfirmMovementModal, ProductRow } from "./partials";
import { FiSearch } from "react-icons/fi";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  movement?: IInventoryMovement;
};

const ORIGIN_OPTIONS = [
  InventoryMovementOrigin.ADMIN_RESTOCK,
  InventoryMovementOrigin.ADMIN_REMOVAL,
];

const getSubmitLabel = (isEditing: boolean, isPending: boolean) => {
  if (isPending) return "Salvando...";
  return isEditing ? "Salvar alterações" : "Confirmar";
};

export const StockMovementModal = ({ isOpen, onClose, movement }: Props) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [pendingMovement, setPendingMovement] = useState<Form | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const isEditing = !!movement;

  const queryClient = useQueryClient();
  const {
    incrementInventory,
    decrementInventory,
    updateInventoryMovement,
    getInventoryMovements,
  } = useInventoryService();
  const { getProductsSimple } = useProductsService();

  const { data: products, isLoading } = useQuery({
    queryKey: [getProductsSimple.key],
    queryFn: getProductsSimple.fn,
    enabled: isOpen,
    retry: false,
    refetchOnWindowFocus: false,
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

  const { fields } = useFieldArray({ control, name: "products" });

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
    setIsConfirmOpen(false);
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

  const updateMutation = useMutation({
    mutationFn: (variables: {
      movementId: string;
      body: MovementProductsBody;
    }) => updateInventoryMovement(variables.movementId, variables.body),
    onSuccess: () => {
      toast.success("Movimentação atualizada com sucesso!");
      queryClient.invalidateQueries({ queryKey: [getInventoryMovements.key] });
      queryClient.invalidateQueries({ queryKey: [getProductsSimple.key] });
      onCloseHandler();
    },
  });

  const isPending =
    incrementMutation.isPending ||
    decrementMutation.isPending ||
    updateMutation.isPending;

  const onSubmit = (data: Form) => {
    setPendingMovement(data);
    setIsConfirmOpen(true);
  };

  const onConfirmMovement = () => {
    if (!pendingMovement) return;

    const movementProducts = pendingMovement.products
      .filter((product) => product.selected)
      .map((product) => ({
        productId: product.productId,
        quantity: Number(product.quantity),
        totalCost: Number(product.totalCost),
      }));

    if (movement) {
      updateMutation.mutate({
        movementId: movement.id,
        body: { movementProducts },
      });
      return;
    }

    if (pendingMovement.origin === InventoryMovementOrigin.ADMIN_REMOVAL) {
      decrementMutation.mutate({ movementProducts });
      return;
    }
    incrementMutation.mutate({
      movementProducts,
    });
  };

  const pendingProducts = (pendingMovement?.products ?? []).filter(
    (product) => product.selected || product.previousQuantity > 0,
  );

  const selectionError = errors.products?.root?.message;

  useEffect(() => {
    if (!isOpen) return;

    reset(toFormValues(products ?? [], movement));
  }, [isOpen, products, movement, reset]);

  return (
    <>
      <Modal isOpen={isOpen} canClose={!isPending} onClose={onCloseHandler}>
        <div className="flex flex-col gap-6 pr-1">
          <div className="flex flex-col gap-1">
            <RadixDialog.Title className="text-white font-bold text-lg">
              {isEditing ? "Editar reposição de estoque" : "Movimentar estoque"}
            </RadixDialog.Title>

            <RadixDialog.Description className="text-zinc-400 text-sm">
              {isEditing
                ? "Altere os produtos, as quantidades e os custos desta reposição."
                : "Selecione os produtos e informe a quantidade e o preço da movimentação."}
            </RadixDialog.Description>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <Controller
              control={control}
              name="origin"
              render={({ field, fieldState }) => (
                <Tooltip
                  content="Só é possível editar reposições de estoque."
                  disabled={!isEditing}
                >
                  <div>
                    <Select
                      label="Tipo de movimentação"
                      options={ORIGIN_OPTIONS.map((origin) => ({
                        label:
                          MOVEMENT_PROPS_BY_ORIGIN[origin].originTranslation,
                        value: origin,
                      }))}
                      value={field.value}
                      onChange={field.onChange}
                      disabled={isPending || isEditing}
                      error={fieldState.error?.message}
                    />
                  </div>
                </Tooltip>
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
                        isPending={isPending}
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
                disabled={isPending}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isPending || isLoading}>
                {getSubmitLabel(isEditing, isPending)}
              </Button>
            </div>
          </form>
        </div>
      </Modal>

      <ConfirmMovementModal
        isOpen={isConfirmOpen}
        origin={
          pendingMovement?.origin || InventoryMovementOrigin.ADMIN_RESTOCK
        }
        products={pendingProducts}
        isEditing={isEditing}
        isPending={isPending}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={onConfirmMovement}
      />
    </>
  );
};
