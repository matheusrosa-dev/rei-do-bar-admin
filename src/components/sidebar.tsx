import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { MdShoppingBasket } from "react-icons/md";
import { BiCategory } from "react-icons/bi";
import { IoClose } from "react-icons/io5";
import {
  FiChevronsLeft,
  FiChevronsRight,
  FiShoppingBag,
  FiUsers,
} from "react-icons/fi";
import { twMerge } from "tailwind-merge";

const navItems = [
  { to: "/gerenciar-pedidos", label: "Gerenciar pedidos", icon: FiShoppingBag },
  { to: "/produtos", label: "Produtos", icon: MdShoppingBasket },
  { to: "/categorias", label: "Categorias", icon: BiCategory },
  { to: "/clientes", label: "Clientes", icon: FiUsers },
] as const;

type Props = {
  isOpen: boolean;
  collapsed: boolean;
  onClose: () => void;
  onToggleCollapse: () => void;
};

export function Sidebar({
  isOpen,
  collapsed,
  onClose,
  onToggleCollapse,
}: Props) {
  const [hovered, setHovered] = useState(false);

  const desktopExpanded = !collapsed || hovered;
  const floating = collapsed && hovered;

  return (
    <>
      <div
        className={twMerge(
          "fixed inset-0 z-20 bg-black/50 transition-opacity duration-300 md:hidden",
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none",
        )}
        onClick={onClose}
      />

      <div
        className={twMerge(
          "relative w-0 shrink-0 transition-[width] duration-200",
          collapsed ? "md:w-16" : "md:w-60",
        )}
      >
        <aside
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className={twMerge(
            "fixed inset-y-0 left-0 z-30 flex w-60 flex-col overflow-hidden border-r border-white/10 bg-neutral-950 transition-[width,transform] duration-200 md:absolute md:translate-x-0",
            isOpen ? "translate-x-0" : "-translate-x-full",
            desktopExpanded ? "md:w-60" : "md:w-16",
            floating && "md:z-40 md:shadow-xl",
          )}
        >
          <div
            className={twMerge(
              "h-18 flex items-center justify-between border-b border-white/10 px-5",
              !desktopExpanded && "md:justify-center md:px-0",
            )}
          >
            <span
              className={twMerge(
                "whitespace-nowrap text-white font-bold text-lg tracking-tight",
                !desktopExpanded && "md:hidden",
              )}
            >
              Rei do Bar
            </span>

            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 transition-colors hover:text-white md:hidden"
              aria-label="Fechar menu"
            >
              <IoClose size={20} />
            </button>

            <button
              type="button"
              onClick={onToggleCollapse}
              className="cursor-pointer hidden text-gray-400 transition-colors hover:text-white md:flex"
              aria-label={collapsed ? "Expandir menu" : "Recolher menu"}
              aria-expanded={!collapsed}
            >
              {collapsed ? (
                <FiChevronsRight size={20} />
              ) : (
                <FiChevronsLeft size={20} />
              )}
            </button>
          </div>

          <nav className="flex-1 space-y-1 px-3 py-4">
            {navItems.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                onClick={onClose}
                className="flex items-center gap-3 whitespace-nowrap rounded-lg px-3 py-2.5 text-sm text-gray-400 transition-colors hover:text-white hover:bg-white/5"
                activeProps={{
                  className:
                    "flex items-center gap-3 whitespace-nowrap rounded-lg px-3 py-2.5 text-sm text-white bg-white/10",
                }}
              >
                <Icon size={16} className="shrink-0" />
                <span className={twMerge(!desktopExpanded && "md:sr-only")}>
                  {label}
                </span>
              </Link>
            ))}
          </nav>
        </aside>
      </div>
    </>
  );
}
