import { useEffect, useState, type ReactNode } from "react";
import * as RadixDialog from "@radix-ui/react-dialog";
import { FiAlertTriangle } from "react-icons/fi";
import { Modal } from "./modal";
import { Button } from "../form/button";

type Props = {
  isOpen: boolean;
  title: string;
  description?: ReactNode;
  cancelLabel?: string;
  confirmLabel?: string;
  variant?: "danger" | "default";
  canClose?: boolean;
  confirmDelaySeconds?: number;
  onClose: () => void;
  onConfirm: () => void;
};

export function ConfirmModal({
  isOpen,
  title,
  description,
  variant = "default",
  canClose = true,
  cancelLabel = "Cancelar",
  confirmLabel = "Confirmar",
  confirmDelaySeconds = 0,
  onClose,
  onConfirm,
}: Props) {
  const [secondsLeft, setSecondsLeft] = useState(0);

  useEffect(() => {
    setSecondsLeft(isOpen ? confirmDelaySeconds : 0);
  }, [isOpen, confirmDelaySeconds]);

  useEffect(() => {
    if (secondsLeft <= 0) return;

    const timeout = setTimeout(() => setSecondsLeft(secondsLeft - 1), 1000);

    return () => clearTimeout(timeout);
  }, [secondsLeft]);

  return (
    <Modal isOpen={isOpen} canClose={canClose} onClose={onClose}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <RadixDialog.Title className="flex items-center gap-2 text-white font-bold text-lg">
            {variant === "danger" && (
              <FiAlertTriangle className="text-red-500 shrink-0" size={20} />
            )}
            {title}
          </RadixDialog.Title>

          {description && (
            <RadixDialog.Description className="text-zinc-400 text-sm">
              {description}
            </RadixDialog.Description>
          )}
        </div>

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={!canClose}
          >
            {cancelLabel}
          </Button>

          <Button
            type="button"
            onClick={onConfirm}
            disabled={!canClose || secondsLeft > 0}
            variant={variant}
          >
            {secondsLeft > 0
              ? `${confirmLabel} (${secondsLeft})`
              : confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
