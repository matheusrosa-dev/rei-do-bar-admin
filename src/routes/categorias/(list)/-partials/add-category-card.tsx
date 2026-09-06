import { Link } from "@tanstack/react-router";
import { LuPlus } from "react-icons/lu";

type Props = {
  groupId: string;
};

export const AddCategoryCard = ({ groupId }: Props) => {
  return (
    <Link
      to="/categorias/criar"
      search={{ grupo: groupId }}
      className="h-full flex flex-col items-center justify-center gap-2 p-4 rounded-lg border border-dashed border-white/10 text-gray-400 hover:border-amber-500 hover:text-amber-500 hover:bg-amber-500/5 transition-colors duration-150 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
    >
      <LuPlus size={18} />
      <span className="text-sm font-medium">Criar categoria</span>
    </Link>
  );
};
