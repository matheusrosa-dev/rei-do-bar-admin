import { useProductsService } from "@services";
import type {
  ICategoryGroupWithProducts,
  IProductWithCategory,
} from "@shared/models";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { ProductGroupBlock } from "./product-group-block";
import { RemoveModal, StatusModal } from "../../-partials";

type Props = {
  groups: ICategoryGroupWithProducts[];
};

type ModalOpen =
  | { mode: "remove-product"; productId: string }
  | { mode: "toggle-status"; product: IProductWithCategory };

export const ProductGroupsList = ({ groups }: Props) => {
  const [modalOpen, setModalOpen] = useState<ModalOpen | null>(null);
  const [statusMode, setStatusMode] = useState<"activate" | "deactivate">(
    "activate",
  );

  const queryClient = useQueryClient();

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
    <div className="flex flex-col gap-6">
      {groups.map((group) => (
        <ProductGroupBlock
          key={group.id}
          group={group}
          pendingProductId={pendingProductId}
          onToggleProduct={onToggleProduct}
          onRemoveProduct={(product) =>
            setModalOpen({ mode: "remove-product", productId: product.id })
          }
        />
      ))}

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
