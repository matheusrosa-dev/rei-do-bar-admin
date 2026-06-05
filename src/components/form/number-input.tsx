import type { InputHTMLAttributes, KeyboardEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import { twMerge } from "tailwind-merge";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  labelClassname?: string;
};

const BLOCKED_KEYS = ["e", "E", "+", "-", ".", ","];

export function NumberInput({
  placeholder,
  className,
  label,
  error,
  labelClassname,
  onKeyDown,
  ...props
}: Props) {
  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (BLOCKED_KEYS.includes(e.key)) e.preventDefault();
    onKeyDown?.(e);
  }

  return (
    <label className="flex flex-col gap-1.5 w-full">
      <span
        className={twMerge("text-zinc-300 text-sm font-medium", labelClassname)}
      >
        {label}
      </span>

      <input
        type="number"
        placeholder={placeholder}
        onKeyDown={handleKeyDown}
        className={twMerge(
          `border text-white placeholder-zinc-500 rounded-lg px-4 py-2.5 text-sm outline-none
           focus:ring-1 transition disabled:cursor-not-allowed disabled:opacity-50
           [&::-webkit-outer-spin-button]:appearance-none
           [&::-webkit-inner-spin-button]:appearance-none
           [-moz-appearance:textfield]
          ${
            error
              ? "border-red-500 bg-red-500/5 focus:border-red-500 focus:ring-red-500"
              : "border-zinc-700 bg-zinc-800 focus:border-amber-500 focus:ring-amber-500"
          }`,
          className,
        )}
        {...props}
      />

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
