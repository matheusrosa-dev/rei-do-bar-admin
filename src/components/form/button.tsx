import type { ButtonHTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

type Variant = "default" | "secondary" | "danger";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
};

export function Button({
  children,
  className,
  type = "button",
  variant = "default",
  ...props
}: Props) {
  const variantClasses: Record<Variant, string> = {
    default: "bg-amber-500 not-disabled:hover:bg-amber-400 text-black",
    secondary:
      "text-zinc-300 border border-zinc-700 not-disabled:hover:bg-zinc-800",
    danger: "bg-red-600 not-disabled:hover:bg-red-500 text-white",
  };

  return (
    <button
      type={type}
      className={twMerge(
        "font-semibold rounded-lg py-2.5 px-4 text-sm flex items-center justify-center gap-2 cursor-pointer duration-150 disabled:cursor-not-allowed disabled:opacity-50",
        variantClasses[variant],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
