import { Link } from "@tanstack/react-router";
import { LuPlus } from "react-icons/lu";

export const AddGroupCard = () => {
  return (
    <Link
      to="/categorias/grupos/criar"
      className="w-full flex items-center justify-center gap-2 p-5 cursor-pointer rounded-xl border border-dashed border-white/10 text-gray-400 hover:border-amber-500 hover:text-amber-500 hover:bg-amber-500/5 transition-colors duration-150 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
    >
      <LuPlus size={18} />
      <span className="text-sm font-medium">Criar grupo de categorias</span>
    </Link>
  );
};
