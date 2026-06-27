import type { InputHTMLAttributes, ReactNode, Ref } from "react";
import { AnimatePresence, motion } from "motion/react";
import { twMerge } from "tailwind-merge";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  leftIcon?: ReactNode;
  ref?: Ref<HTMLInputElement>;
};

export function Input({
  placeholder,
  className,
  label,
  error,
  leftIcon,
  ...props
}: Props) {
  return (
    <label className="flex flex-col gap-1.5 w-full">
      {label && (
        <span className="text-zinc-300 text-sm font-medium">{label}</span>
      )}

      <div className="relative">
        {leftIcon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none">
            {leftIcon}
          </span>
        )}

        <input
          placeholder={placeholder}
          className={twMerge(
            `w-full border text-white placeholder-zinc-500 rounded-lg py-2.5 text-sm outline-none
             focus:ring-1 transition disabled:cursor-not-allowed disabled:opacity-50
            ${leftIcon ? "pl-9 pr-4" : "px-4"}
            ${
              error
                ? "border-red-500 bg-red-500/5 focus:border-red-500 focus:ring-red-500"
                : "border-zinc-700 bg-zinc-800 focus:border-amber-500 focus:ring-amber-500"
            }`,
            className,
          )}
          {...props}
        />
      </div>

      <AnimatePresence>
        {!!(error && !props?.disabled) && (
          <motion.span
            className="text-red-500 text-xs select-none overflow-hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {error}
          </motion.span>
        )}
      </AnimatePresence>
    </label>
  );
}
