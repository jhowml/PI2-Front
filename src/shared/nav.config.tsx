import type { LucideIcon } from "lucide-react";
import { ClipboardList, House, UtensilsCrossed, Users } from "lucide-react";

export type ShellNavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

export const shellNavItems: ShellNavItem[] = [
  { href: "/", label: "Início", icon: House },
  { href: "/pedidos", label: "Pedidos", icon: ClipboardList },
  { href: "/clientes", label: "Clientes", icon: Users },
  { href: "/cardapio", label: "Cardápio", icon: UtensilsCrossed },
];

export function isNavItemActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}
