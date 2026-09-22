import { SidebarBrand } from "./sidebar-brand";
import { SidebarNav } from "./sidebar-nav";
import { LogoutButton } from "./logout-button";

export function AppSidebar() {
  return (
    <aside
      className="hidden min-h-screen w-60 shrink-0 flex-col border-r border-sidebar-border bg-sidebar-background px-3 py-4 md:flex"
      aria-label="Menu lateral"
    >
      <div className="mb-6 px-1">
        <SidebarBrand />
      </div>
      <SidebarNav />
      <div className="mt-auto">
        <LogoutButton />
      </div>
    </aside>
  );
}
