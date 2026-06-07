import { Sidebar } from "@components";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { useState } from "react";
import { HiMenu } from "react-icons/hi";

const RootLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-dvh w-full">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="md:hidden flex items-center h-14 px-4 border-b border-white/10 shrink-0">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="Abrir menu"
          >
            <HiMenu size={24} />
          </button>
          <span className="ml-4 text-white font-bold tracking-tight">
            Rei do Bar
          </span>
        </div>

        <div className="flex-1 overflow-auto">
          <Outlet />
        </div>
      </main>

      <TanStackRouterDevtools />
    </div>
  );
};

export const Route = createRootRoute({ component: RootLayout });
