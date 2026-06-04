import { Sidebar } from "@components";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

const RootLayout = () => (
  <div className="flex h-dvh w-full">
    <Sidebar />

    <main className="flex-1">
      <Outlet />
    </main>

    <TanStackRouterDevtools />
  </div>
);

export const Route = createRootRoute({ component: RootLayout });
