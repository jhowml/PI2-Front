import Link from "next/link";
import { Flame } from "lucide-react";

export function SidebarBrand() {
  return (
    <Link
      href="/"
      className="flex items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-sidebar-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring"
    >
      <span
        className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
        aria-hidden="true"
      >
        <Flame className="size-5" />
      </span>
      <span className="flex min-w-0 flex-col leading-tight">
        <span className="truncate text-sm font-semibold tracking-tight text-sidebar-foreground">
          Soberania Digital
        </span>
        <span className="truncate text-xs text-sidebar-foreground/80">
          Gestão de pedidos
        </span>
      </span>
    </Link>
  );
}
