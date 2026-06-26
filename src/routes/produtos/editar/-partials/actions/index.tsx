import { Toggle, Tooltip, TrashButton, Wrapper } from "@components";
import { useState } from "react";
import type { ModalOpen } from "./types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useProductsService } from "@services";
import { toast } from "sonner";
import type { IProductWithCategory } from "@shared/models";
import { useNavigate } from "@tanstack/react-router";
import { RemoveModal, StatusModal } from "../../../-partials";

type Props = {
  product: IProductWithCategory;
};

export const Actions = ({ product }: Props) => {
  const [modalOpen, setModalOpen] = useState<ModalOpen | null>(null);

  const {
    activateProduct,
    deactivateProduct,
    getProductById,
    removeProduct,
    getProducts,
  } = useProductsService();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const toggleStatusMutation = useMutation({
    mutationFn: () => {
      if (product.isActive) {
        return deactivateProduct(product.id);
      }
      return activateProduct(product.id);
    },
    onSuccess: (updatedProduct) => {
      queryClient.setQueryData(
        [getProductById.key, product.id],
        updatedProduct,
      );
      toast.success(
        `Produto ${updatedProduct.isActive ? "ativado" : "desativado"} com sucesso!`,
      );

      setModalOpen(null);
    },
  });

  const removeProductMutation = useMutation({
    mutationFn: () => removeProduct(product.id),
    onSuccess: () => {
      toast.success("Produto removido com sucesso!");
      queryClient.invalidateQueries({ queryKey: [getProducts.key] });
      navigate({ to: "/produtos" });
    },
  });

  return (
    <>
      <Wrapper className="flex flex-col gap-4 w-fit">
        <div className="flex items-center justify-between gap-8">
          <h2 className="text-white text-lg font-bold">Ações</h2>
        </div>

        <hr className="border-white/10" />

        <div className="flex gap-12 items-center">
          <Tooltip
            disabled={product.category.isActive}
            content={"A categoria deste produto está desativada."}
          >
            <span>
              <Toggle
                checked={product.isActive}
                disabled={!product.category.isActive}
                onCheckedChange={() => setModalOpen("toggle-status")}
                label="Status"
              />
            </span>
          </Tooltip>

          <div className="flex flex-col gap-2">
            <h2 className="text-zinc-300 text-sm font-medium select-none text-center">
              Estoque
            </h2>

            <span className="text-zinc-300 text-sm font-medium select-none text-center">
              {product.stockQuantity}
            </span>
          </div>

          <TrashButton
            onClick={() => setModalOpen("remove")}
            className="w-10 h-10 -ml-4 mt-auto"
          />
        </div>
      </Wrapper>

      <StatusModal
        isOpen={modalOpen === "toggle-status"}
        onClose={() => setModalOpen(null)}
        mode={product.isActive ? "deactivate" : "activate"}
        canClose={!toggleStatusMutation.isPending}
        onConfirm={toggleStatusMutation.mutate}
      />

      <RemoveModal
        isOpen={modalOpen === "remove"}
        canClose={!removeProductMutation.isPending}
        onClose={() => setModalOpen(null)}
        onConfirm={removeProductMutation.mutate}
      />
    </>
  );
};
