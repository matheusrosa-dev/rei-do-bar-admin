import * as RadixDialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "motion/react";
import type React from "react";

type Props = {
  isOpen: boolean;
  canClose?: boolean;
  children: React.ReactNode;
  onClose: () => void;
};

export function Modal({ isOpen, canClose = true, children, onClose }: Props) {
  return (
    <RadixDialog.Root
      open={isOpen}
      onOpenChange={canClose ? onClose : undefined}
    >
      <RadixDialog.Portal forceMount>
        <AnimatePresence>
          {isOpen && (
            <div className="fixed z-50 inset-0 flex items-center justify-center max-h-dvh">
              <RadixDialog.Overlay asChild forceMount>
                <motion.div
                  className="absolute inset-0 bg-black/60"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                />
              </RadixDialog.Overlay>

              <RadixDialog.Content asChild forceMount>
                <motion.div
                  className="max-h-full overflow-y-auto z-10 w-full max-w-lg bg-zinc-900 border border-white/10 rounded-xl p-6 shadow-xl"
                  initial={{ opacity: 0, scale: 0.95, y: 8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 8 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                >
                  {children}
                </motion.div>
              </RadixDialog.Content>
            </div>
          )}
        </AnimatePresence>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  );
}
