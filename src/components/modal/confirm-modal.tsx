import * as RadixDialog from "@radix-ui/react-dialog";
import { Modal } from "./modal";
import { Button } from "../form/button";

type Props = {
  isOpen: boolean;
  title: string;
  description?: string;
  cancelLabel?: string;
  confirmLabel?: string;
  variant?: "danger" | "default";
  canClose?: boolean;
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
  onClose,
  onConfirm,
}: Props) {
  return (
    <Modal isOpen={isOpen} canClose={canClose} onClose={onClose}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <RadixDialog.Title className="text-white font-bold text-lg">
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
            disabled={!canClose}
            variant={variant}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
