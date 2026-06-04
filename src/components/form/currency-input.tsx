import { useCallback } from "react";
import { AnimatePresence, motion } from "motion/react";
import { twMerge } from "tailwind-merge";

type Props = {
  label: string;
  value: number;
  onChange: (value: number) => void;
  error?: string;
  disabled?: boolean;
  className?: string;
};

export function CurrencyInput({
  label,
  value,
  onChange,
  error,
  disabled,
  className,
}: Props) {
  const formatted = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value ? value / 100 : 0);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const digits = e.target.value.replace(/\D/g, "");
      onChange?.(Number(digits));
    },
    [onChange],
  );

  return (
    <label className="flex flex-col gap-1.5 w-full">
      <span className="text-zinc-300 text-sm font-medium">{label}</span>

      <input
        value={formatted}
        onChange={handleChange}
        disabled={disabled}
        className={twMerge(
          `border text-white rounded-lg px-4 py-2.5 text-sm outline-none
           focus:ring-1 transition disabled:cursor-not-allowed disabled:opacity-50
          ${
            error
              ? "border-red-500 bg-red-500/5 focus:border-red-500 focus:ring-red-500"
              : "border-zinc-700 bg-zinc-800 focus:border-amber-500 focus:ring-amber-500"
          }`,
          className,
        )}
      />

      <AnimatePresence>
        {!!(error && !disabled) && (
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
