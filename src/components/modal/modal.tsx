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
            <RadixDialog.Overlay asChild forceMount>
              <motion.div
                className="fixed inset-0 bg-black/60 z-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              />
            </RadixDialog.Overlay>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isOpen && (
            <RadixDialog.Content asChild forceMount>
              <motion.div
                className="fixed z-50 left-1/2 top-1/2 w-full max-w-md bg-zinc-900 border border-white/10 rounded-xl p-6 shadow-xl"
                style={{ translateX: "-50%", translateY: "-50%" }}
                initial={{ opacity: 0, scale: 0.95, y: "-48%" }}
                animate={{ opacity: 1, scale: 1, y: "-50%" }}
                exit={{ opacity: 0, scale: 0.95, y: "-48%" }}
                transition={{ duration: 0.18, ease: "easeOut" }}
              >
                {children}
              </motion.div>
            </RadixDialog.Content>
          )}
        </AnimatePresence>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  );
}
