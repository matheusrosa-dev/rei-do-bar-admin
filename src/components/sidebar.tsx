import { Link } from "@tanstack/react-router";
import { MdShoppingBasket } from "react-icons/md";
import { BiCategory } from "react-icons/bi";
import { IoClose } from "react-icons/io5";
import { FiShoppingBag, FiUsers } from "react-icons/fi";

const navItems = [
  { to: "/produtos", label: "Produtos", icon: MdShoppingBasket },
  { to: "/categorias", label: "Categorias", icon: BiCategory },
  { to: "/clientes", label: "Clientes", icon: FiUsers },
  { to: "/pedidos", label: "Pedidos", icon: FiShoppingBag },
] as const;

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <>
      <div
        className={`fixed inset-0 z-20 bg-black/50 transition-opacity duration-300 md:hidden ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-30 flex flex-col w-60 border-r border-white/10 bg-neutral-950 transition-transform duration-300 md:relative md:translate-x-0 md:z-auto md:min-h-screen md:bg-white/3 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="px-5 h-18 flex items-center justify-between border-b border-white/10">
          <span className="text-white font-bold text-lg tracking-tight">
            Rei do Bar
          </span>
          <button
            type="button"
            onClick={onClose}
            className="md:hidden text-gray-400 hover:text-white transition-colors"
            aria-label="Fechar menu"
          >
            <IoClose size={20} />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              onClick={onClose}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-400 transition-colors hover:text-white hover:bg-white/5"
              activeProps={{
                className:
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white bg-white/10",
              }}
            >
              <Icon size={16} />
              {label}
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
}
