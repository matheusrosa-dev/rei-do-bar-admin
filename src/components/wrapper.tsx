import { twMerge } from "tailwind-merge";

type Props = {
  children: React.ReactNode;
  className?: string;
};

export const Wrapper = ({ children, className }: Props) => {
  return (
    <section
      className={twMerge(
        "p-5 rounded-xl border border-white/10 bg-white/5",
        className,
      )}
    >
      {children}
    </section>
  );
};
