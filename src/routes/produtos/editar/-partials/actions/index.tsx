import { Toggle, Wrapper } from "@components";
import type { IProduct } from "@shared/models";
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

type Props = {
  product: IProduct;
};

export const Actions = ({ product }: Props) => {
  const [modalOpen, setModalOpen] = useState<ModalOpen | null>(null);

  const {
    activateProduct,
    deactivateProduct,
    getProductById,
    incrementStock,
    decrementStock,
  } = useProductsService();
  const queryClient = useQueryClient();

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
    onError: () => {
      toast.error(
        `Ocorreu um erro ao ${product.isActive ? "desativar" : "ativar"} o produto`,
      );
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
    onError: () => {
      toast.error(`Ocorreu um erro ao atualizar o estoque.`);
    },
  });

  return (
    <>
      <Wrapper className="flex flex-col gap-4 w-fit">
        <h2 className="text-white text-lg font-bold">Ações</h2>

        <hr className="border-white/10" />

        <div className="flex gap-12 items-center">
          <Toggle
            checked={product.isActive}
            onCheckedChange={(value) =>
              setModalOpen(value ? "activate" : "deactivate")
            }
            label="Status"
          />

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
    </>
  );
};
