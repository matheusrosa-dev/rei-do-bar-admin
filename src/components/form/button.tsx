import type { ButtonHTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

type Props = ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({
  children,
  className,
  type = "button",
  ...props
}: Props) {
  return (
    <button
      className={twMerge(
        "bg-amber-500 not-disabled:hover:bg-amber-400 text-black font-semibold rounded-lg py-2.5 text-sm flex items-center justify-center gap-2 cursor-pointer duration-150 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
