import * as Dialog from "@radix-ui/react-dialog";
import { MdClose } from "react-icons/md";
import { twMerge } from "tailwind-merge";

type Props = {
  src: string;
  alt?: string;
  className?: string;
};

export function ImagePreview({ src, alt = "Imagem", className }: Props) {
  return (
    <Dialog.Root>
      <Dialog.Trigger onClick={(e) => e.stopPropagation()} className="block">
        <img
          src={src}
          alt={alt}
          className={twMerge(
            "cursor-zoom-in transition-opacity object-contain hover:opacity-80 select-none rounded-md bg-white/5",
            className,
          )}
        />
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm data-[state=open]:animate-fade-in" />

        <Dialog.Content className="fixed z-50 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 max-w-[90vw] max-h-[90vh] focus:outline-none">
          <img
            src={src}
            alt={alt}
            className="max-w-full max-h-[90vh] rounded-xl object-contain shadow-2xl"
          />

          <Dialog.Close className="cursor-pointer absolute -top-3 -right-3 w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center text-gray-300 hover:text-white transition-colors">
            <MdClose size={14} />
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
