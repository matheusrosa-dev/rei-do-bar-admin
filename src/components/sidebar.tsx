import { Link } from "@tanstack/react-router";
import { MdShoppingBasket } from "react-icons/md";

const navItems = [
  { to: "/products", label: "Produtos", icon: MdShoppingBasket },
] as const;

export function Sidebar() {
  return (
    <aside className="flex flex-col w-60 min-h-screen border-r border-white/10 bg-white/3">
      <div className="px-5 py-5 border-b border-white/10">
        <span className="text-white font-bold text-lg tracking-tight">
          Rei do Bar
        </span>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
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
  );
}
