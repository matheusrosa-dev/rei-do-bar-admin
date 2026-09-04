import { useEffect, useState } from "react";
import * as RadixDialog from "@radix-ui/react-dialog";
import { FiAlertTriangle } from "react-icons/fi";
import { Button, Modal, StatusBadge } from "@components";
import { formatPrice } from "@shared/helpers/number";
import { InventoryMovementOrigin } from "@shared/models";
import {
  MOVEMENT_PROPS_BY_ORIGIN,
  MOVEMENT_QUANTITY_CLASS,
} from "../../../-helpers";
import { getUnitCost } from "../-helpers";
import type { Form } from "../form";

const CONFIRM_DELAY_SECONDS = 5;

type Props = {
  isOpen: boolean;
  origin: Form["origin"];
  products: Form["products"];
  isPending: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export const ConfirmMovementModal = ({
  isOpen,
  origin,
  products,
  isPending,
  onClose,
  onConfirm,
}: Props) => {
  const [secondsLeft, setSecondsLeft] = useState(0);

  useEffect(() => {
    setSecondsLeft(isOpen ? CONFIRM_DELAY_SECONDS : 0);
  }, [isOpen]);

  useEffect(() => {
    if (secondsLeft <= 0) return;

    const timeout = setTimeout(() => setSecondsLeft(secondsLeft - 1), 1000);

    return () => clearTimeout(timeout);
  }, [secondsLeft]);

  const isRestock = origin === InventoryMovementOrigin.ADMIN_RESTOCK;
  const { originTranslation, originVariant, quantityVariant } =
    MOVEMENT_PROPS_BY_ORIGIN[origin];
  const sign = isRestock ? "+" : "-";

  const totalItems = products.reduce(
    (total, product) => total + (product.quantity ?? 0),
    0,
  );
  const totalCost = products.reduce(
    (total, product) => total + (product.totalCost ?? 0),
    0,
  );

  const countdownLabel = secondsLeft > 0 ? ` (${secondsLeft})` : "";
  const confirmLabel = isPending ? "Salvando..." : `Confirmar${countdownLabel}`;

  return (
    <Modal isOpen={isOpen} canClose={!isPending} onClose={onClose}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <RadixDialog.Title className="flex items-center gap-2 text-white font-bold text-lg">
            {!isRestock && (
              <FiAlertTriangle className="text-red-500 shrink-0" size={20} />
            )}
            Confirmar movimentação
          </RadixDialog.Title>

          <RadixDialog.Description className="text-zinc-400 text-sm">
            Revise os dados antes de confirmar. Essa ação não poderá ser
            desfeita.
          </RadixDialog.Description>

          <StatusBadge variant={originVariant}>{originTranslation}</StatusBadge>
        </div>

        <div className="max-h-64 overflow-y-auto rounded-xl border border-white/10 bg-white/5 divide-y divide-white/10">
          {products.map((product) => {
            const movedQuantity = product.quantity ?? 0;
            const nextStock = isRestock
              ? product.stockQuantity + movedQuantity
              : product.stockQuantity - movedQuantity;
            const unitCost = getUnitCost(product.totalCost, product.quantity);

            return (
              <div
                key={product.productId}
                className="flex items-start justify-between gap-3 p-3"
              >
                <div className="flex flex-col min-w-0">
                  <span className="text-gray-200 text-sm font-medium truncate">
                    {product.name}
                  </span>
                  <span className="text-gray-500 text-sm">
                    Estoque {product.stockQuantity} → {nextStock}
                  </span>
                </div>

                <div className="flex flex-col items-end shrink-0">
                  <span
                    className={`text-sm ${MOVEMENT_QUANTITY_CLASS[quantityVariant]}`}
                  >
                    {sign}
                    {movedQuantity} unidade{movedQuantity !== 1 ? "s" : ""}
                  </span>

                  {isRestock && (
                    <span className="text-gray-200 text-sm">
                      {formatPrice(product.totalCost ?? null)}{" "}
                      <span className="text-gray-400 text-xs">
                        ({formatPrice(unitCost)} unidade)
                      </span>
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-gray-400 text-sm">
            {products.length} produto{products.length !== 1 ? "s" : ""} ·{" "}
            {totalItems} {totalItems !== 1 ? "itens" : "item"}
          </span>

          {isRestock && (
            <span className="text-gray-400 text-sm">
              Custo total{" "}
              <strong className="text-amber-500 font-semibold">
                {formatPrice(totalCost)}
              </strong>
            </span>
          )}
        </div>

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={isPending}
          >
            Voltar
          </Button>

          <Button
            type="button"
            variant={isRestock ? "default" : "danger"}
            onClick={onConfirm}
            disabled={isPending || secondsLeft > 0}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
