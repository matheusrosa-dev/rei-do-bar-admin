import type { HTMLAttributes, Ref } from "react";
import { twMerge } from "tailwind-merge";

type Props = HTMLAttributes<HTMLElement> & {
  ref?: Ref<HTMLElement>;
};

export const Wrapper = ({ children, className, ...props }: Props) => {
  return (
    <section
      className={twMerge(
        "p-5 rounded-xl border border-white/10 bg-white/5",
        className,
      )}
      {...props}
    >
      {children}
    </section>
  );
};
