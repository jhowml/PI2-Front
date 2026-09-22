"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { isNavItemActive, shellNavItems } from "@/shared/nav.config"

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 flex border-t border-sidebar-border bg-sidebar-background md:hidden"
      aria-label="Navegação principal (celular)"
    >
      {shellNavItems.map((item) => {
        const active = isNavItemActive(pathname, item.href)
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={[
              "flex flex-1 flex-col items-center justify-center gap-1 py-3 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-sidebar-ring",
              active
                ? "text-sidebar-primary"
                : "text-sidebar-foreground/80 hover:text-sidebar-foreground",
            ].join(" ")}
          >
            <item.icon className="size-5" aria-hidden="true" />
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}
