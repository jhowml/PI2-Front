import Link from "next/link"
import { ClipboardList, PlusCircle, UtensilsCrossed, Users } from "lucide-react"
import type { LucideIcon } from "lucide-react"

type Shortcut = { href: string; title: string; description: string; icon: LucideIcon }

const shortcuts: Shortcut[] = [
    { href: "/pedidos?novo=1", title: "Novo pedido", description: "Registrar um pedido de entrega ou retirada.", icon: PlusCircle },
    { href: "/pedidos", title: "Pedidos", description: "Acompanhar os pedidos por status.", icon: ClipboardList },
    { href: "/clientes", title: "Clientes", description: "Cadastrar e consultar clientes, com busca de CEP.", icon: Users },
    { href: "/cardapio", title: "Cardápio", description: "Cadastrar itens, preços e disponibilidade.", icon: UtensilsCrossed },
]

export function HomeView() {
    return (
        <div className="flex flex-col gap-6 p-4 md:p-8">
            <header>
                <h1 className="text-2xl font-bold tracking-tight">Início</h1>
                <p className="mt-2 text-sm text-muted-foreground">
                    Gestão interna de pedidos, cardápio e clientes, sem taxas de intermediação.
                </p>
            </header>
            <ul className="grid gap-4 sm:grid-cols-2">
                {shortcuts.map((shortcut) => (
                    <li key={shortcut.href}>
                        <Link
                            href={shortcut.href}
                            className="flex h-full gap-4 rounded-lg border border-border border-l-4 border-l-sidebar-primary bg-card p-5 transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                            <shortcut.icon className="size-6 shrink-0 text-primary" aria-hidden="true" />
                            <span className="flex flex-col">
                                <span className="font-semibold text-foreground">{shortcut.title}</span>
                                <span className="text-sm text-muted-foreground">{shortcut.description}</span>
                            </span>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    )
}
