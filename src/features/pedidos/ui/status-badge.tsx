import { cn } from "@/shared/lib/cn"
import { PEDIDO_STATUS_LABELS, type PedidoStatus } from "../types"

const STATUS_STYLES: Record<PedidoStatus, string> = {
    PENDENTE: "bg-accent text-accent-foreground ring-1 ring-sidebar-primary",
    CONFIRMADO: "bg-blue-100 text-blue-900",
    PREPARANDO: "bg-orange-100 text-orange-900",
    ENTREGUE: "bg-green-100 text-green-900",
    CANCELADO: "bg-stone-200 text-stone-800 line-through",
}

export function StatusBadge({ status, className }: { status: PedidoStatus; className?: string }) {
    return (
        <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-semibold", STATUS_STYLES[status], className)}>
            <span className="sr-only">Status: </span>
            {PEDIDO_STATUS_LABELS[status]}
        </span>
    )
}
