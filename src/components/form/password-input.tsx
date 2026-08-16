import type { InputHTMLAttributes, Ref } from "react";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { LuEye, LuEyeOff } from "react-icons/lu";
import { twMerge } from "tailwind-merge";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  ref?: Ref<HTMLInputElement>;
};

export function PasswordInput({
  placeholder,
  className,
  label,
  error,
  ...props
}: Props) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <label className="flex flex-col gap-1.5 w-full">
      {label && (
        <span className="text-zinc-300 text-sm font-medium">{label}</span>
      )}

      <div className="relative">
        <input
          placeholder={placeholder}
          className={twMerge(
            `w-full border text-white placeholder-zinc-500 rounded-lg py-2.5 pl-4 pr-11 text-sm outline-none
             focus:ring-1 transition disabled:cursor-not-allowed disabled:opacity-50
            ${
              error
                ? "border-red-500 bg-red-500/5 focus:border-red-500 focus:ring-red-500"
                : "border-zinc-700 bg-zinc-800 focus:border-amber-500 focus:ring-amber-500"
            }`,
            className,
          )}
          {...props}
          type={isVisible ? "text" : "password"}
        />

        <button
          type="button"
          aria-label={isVisible ? "Ocultar senha" : "Mostrar senha"}
          title={isVisible ? "Ocultar senha" : "Mostrar senha"}
          onClick={() => setIsVisible((previous) => !previous)}
          disabled={props.disabled}
          className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-zinc-400 not-disabled:hover:text-zinc-300 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isVisible ? <LuEyeOff size={16} /> : <LuEye size={16} />}
        </button>
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
