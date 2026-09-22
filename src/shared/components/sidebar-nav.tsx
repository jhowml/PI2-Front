"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { isNavItemActive, shellNavItems } from "@/shared/nav.config";

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-0.5" aria-label="Navegação principal">
      {shellNavItems.map((item) => {
        const active = isNavItemActive(pathname, item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={[
              "flex gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring",
              active
                ? "bg-sidebar-primary text-sidebar-primary-foreground"
                : "text-sidebar-foreground/85 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
            ].join(" ")}
          >
            <item.icon className="size-4" aria-hidden="true" /> {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
