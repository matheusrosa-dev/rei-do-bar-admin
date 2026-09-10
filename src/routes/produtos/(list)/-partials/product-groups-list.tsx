import {
  closestCorners,
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import type { DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import { useProductsService } from "@services";
import type {
  ICategoryGroupWithProducts,
  IProductWithCategory,
} from "@shared/models";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { MdDragIndicator } from "react-icons/md";
import { toast } from "sonner";
import { ProductCard } from "./product-card";
import { ProductGroupBlock } from "./product-group-block";
import { RemoveModal, StatusModal } from "../../-partials";

type Props = {
  groups: ICategoryGroupWithProducts[];
  isReordering: boolean;
  dirtyGroupIds: string[];
  activeProductId: string | null;
  onResetGroupOrder: (groupId: string) => void;
  onDragStart: (event: DragStartEvent) => void;
  onDragEnd: (event: DragEndEvent) => void;
  onDragCancel: () => void;
};

type ModalOpen =
  | { mode: "remove-product"; productId: string }
  | { mode: "toggle-status"; product: IProductWithCategory };

export const ProductGroupsList = ({
  groups,
  isReordering,
  dirtyGroupIds,
  activeProductId,
  onResetGroupOrder,
  onDragStart,
  onDragEnd,
  onDragCancel,
}: Props) => {
  const [modalOpen, setModalOpen] = useState<ModalOpen | null>(null);
  const [statusMode, setStatusMode] = useState<"activate" | "deactivate">(
    "activate",
  );

  const queryClient = useQueryClient();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  const { removeProduct, getProducts, activateProduct, deactivateProduct } =
    useProductsService();

  const invalidateProducts = () => {
    queryClient.invalidateQueries({ queryKey: [getProducts.key] });
  };

  const removeProductMutation = useMutation({
    mutationFn: removeProduct,
    onSuccess: () => {
      toast.success("Produto removido com sucesso!");
      invalidateProducts();
      setModalOpen(null);
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: (product: IProductWithCategory) => {
      if (product.isActive) {
        return deactivateProduct(product.id);
      }

      return activateProduct(product.id);
    },
    onSuccess: () => {
      toast.success(
        `Produto ${statusMode === "activate" ? "ativado" : "desativado"} com sucesso!`,
      );
      invalidateProducts();
      setModalOpen(null);
    },
  });

  const isPending =
    removeProductMutation.isPending || toggleStatusMutation.isPending;

  const getPendingProductId = () => {
    if (!isPending || !modalOpen) return null;

    if (modalOpen.mode === "remove-product") {
      return modalOpen.productId;
    }

    return modalOpen.product.id;
  };

  const onToggleProduct = (product: IProductWithCategory) => {
    setStatusMode(product.isActive ? "deactivate" : "activate");
    setModalOpen({ mode: "toggle-status", product });
  };

  const activeProduct =
    groups
      .flatMap((group) => group.products)
      .find((product) => product.id === activeProductId) ?? null;

  const reorderBanner = (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 rounded-xl border border-amber-500/30 bg-amber-500/5 px-4 py-3">
      <MdDragIndicator size={18} className="shrink-0 text-amber-500" />

      <span className="text-sm font-medium text-amber-500">
        Modo de reordenação ativo
      </span>

      <span className="text-sm text-gray-400">
        Arraste os produtos dentro de cada grupo para reordenar. Salve para
        aplicar.
      </span>
    </div>
  );

  if (groups.length === 0) {
    return (
      <span className="text-sm text-gray-400">
        Nenhum grupo de categorias cadastrado. Crie um grupo em Categorias para
        começar a cadastrar produtos.
      </span>
    );
  }

  const pendingProductId = getPendingProductId();

  return (
    <div className="flex flex-col gap-4">
      {isReordering && reorderBanner}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragCancel={onDragCancel}
      >
        <div className="flex flex-col gap-6">
          {groups.map((group) => (
            <ProductGroupBlock
              key={`${group.id}-${isReordering}`}
              group={group}
              isReordering={isReordering}
              isOrderDirty={dirtyGroupIds.includes(group.id)}
              pendingProductId={pendingProductId}
              onResetOrder={() => onResetGroupOrder(group.id)}
              onToggleProduct={onToggleProduct}
              onRemoveProduct={(product) =>
                setModalOpen({ mode: "remove-product", productId: product.id })
              }
            />
          ))}
        </div>

        <DragOverlay>
          {activeProduct && (
            <ProductCard
              product={activeProduct}
              position={activeProduct.sortOrder}
              isReordering
              isPending={false}
              onToggle={() => {}}
              onRemove={() => {}}
            />
          )}
        </DragOverlay>
      </DndContext>

      <RemoveModal
        isOpen={modalOpen?.mode === "remove-product"}
        canClose={!removeProductMutation.isPending}
        onClose={() => setModalOpen(null)}
        onConfirm={() => {
          if (modalOpen?.mode === "remove-product") {
            removeProductMutation.mutate(modalOpen.productId);
          }
        }}
      />

      <StatusModal
        isOpen={modalOpen?.mode === "toggle-status"}
        mode={statusMode}
        canClose={!toggleStatusMutation.isPending}
        onClose={() => setModalOpen(null)}
        onConfirm={() => {
          if (modalOpen?.mode === "toggle-status") {
            toggleStatusMutation.mutate(modalOpen.product);
          }
        }}
      />
    </div>
  );
};
