import {
  ConfirmModal,
  Toggle,
  Tooltip,
  TrashButton,
  Wrapper,
} from "@components";
import { useState } from "react";
import type { ModalOpen } from "./types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useProductsService } from "@services";
import { toast } from "sonner";
import { FaMinus, FaPlus } from "react-icons/fa";
import {
  StatusModal,
  StockModal,
  type StatusModalVariant,
  type StockModalVariant,
} from "./partials";
import type { IProductWithCategory } from "@shared/models";
import { useNavigate } from "@tanstack/react-router";

type Props = {
  product: IProductWithCategory;
};

export const Actions = ({ product }: Props) => {
  const [modalOpen, setModalOpen] = useState<ModalOpen | null>(null);

  const {
    activateProduct,
    deactivateProduct,
    getProductById,
    incrementStock,
    decrementStock,
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

  const changeStockMutation = useMutation({
    mutationFn: (body: { amount: number }) => {
      if (modalOpen === "increment-stock") {
        return incrementStock({
          productId: product.id,
          body,
        });
      }

      return decrementStock({
        productId: product.id,
        body,
      });
    },
    onSuccess: (updatedProduct) => {
      queryClient.setQueryData(
        [getProductById.key, product.id],
        updatedProduct,
      );

      toast.success("Estoque atualizado com sucesso!");

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

          <TrashButton onClick={() => setModalOpen("remove")} />
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
                onCheckedChange={(value) =>
                  setModalOpen(value ? "activate" : "deactivate")
                }
                label="Status"
              />
            </span>
          </Tooltip>

          <div>
            <h2 className="text-zinc-300 text-sm font-medium select-none text-center">
              Estoque
            </h2>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setModalOpen("decrement-stock")}
                className="bg-amber-500 text-black rounded-full w-5 max-w-5 h-5 max-h-5 flex items-center justify-center cursor-pointer hover:bg-amber-400 transition"
              >
                <FaMinus size={12} />
              </button>

              <span className="text-white text-2xl font-bold text-center">
                {product.stock}
              </span>

              <button
                type="button"
                onClick={() => setModalOpen("increment-stock")}
                className="bg-amber-500 text-black rounded-full w-5 max-w-5 h-5 max-h-5 flex items-center justify-center cursor-pointer hover:bg-amber-400 transition"
              >
                <FaPlus size={12} />
              </button>
            </div>
          </div>
        </div>
      </Wrapper>

      <StatusModal
        isOpen={modalOpen === "activate" || modalOpen === "deactivate"}
        variant={modalOpen as StatusModalVariant}
        isPending={toggleStatusMutation.isPending}
        onClose={() => setModalOpen(null)}
        onConfirm={toggleStatusMutation.mutate}
      />

      <StockModal
        isOpen={
          modalOpen === "increment-stock" || modalOpen === "decrement-stock"
        }
        variant={modalOpen as StockModalVariant}
        isPending={changeStockMutation.isPending}
        onClose={() => setModalOpen(null)}
        onConfirm={changeStockMutation.mutate}
      />

      <ConfirmModal
        isOpen={modalOpen === "remove"}
        title="Tem certeza que deseja remover este produto?"
        description="Essa ação não poderá ser desfeita."
        variant="danger"
        confirmLabel="Remover produto"
        canClose={!removeProductMutation.isPending}
        onClose={() => setModalOpen(null)}
        onConfirm={removeProductMutation.mutate}
      />
    </>
  );
};
