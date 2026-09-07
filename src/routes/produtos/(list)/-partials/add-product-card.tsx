import { Link } from "@tanstack/react-router";
import { LuPlus } from "react-icons/lu";
import { twMerge } from "tailwind-merge";

type Props = {
  groupId: string;
  className?: string;
};

export const AddProductCard = ({ groupId, className }: Props) => {
  return (
    <Link
      to="/produtos/criar"
      search={{ grupo: groupId }}
      className={twMerge(
        "min-h-32 h-full flex flex-col items-center justify-center gap-2 p-4 rounded-lg border border-dashed border-white/10 text-gray-400 hover:border-amber-500 hover:text-amber-500 hover:bg-amber-500/5 transition-colors duration-150 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500",
        className,
      )}
    >
      <LuPlus size={18} />
      <span className="text-sm font-medium">Criar produto</span>
    </Link>
  );
};
