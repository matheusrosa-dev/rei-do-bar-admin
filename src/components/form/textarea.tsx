import type { TextareaHTMLAttributes } from "react";
import { AnimatePresence, motion } from "motion/react";
import { twMerge } from "tailwind-merge";

type Props = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  error?: string;
};

export function Textarea({
  placeholder,
  className,
  label,
  error,
  ...props
}: Props) {
  return (
    <label className="flex flex-col gap-1.5 w-full">
      <span className="text-zinc-300 text-sm font-medium">{label}</span>

      <textarea
        placeholder={placeholder}
        className={twMerge(
          `border text-white placeholder-zinc-500 rounded-lg px-4 py-2.5 text-sm outline-none
           focus:ring-1 transition disabled:cursor-not-allowed disabled:opacity-50 resize-none
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
