"use client"

import { Button } from "@/components"
import { useUpdatePedidoStatus } from "../hooks/use-update-pedido-status"
import type { Pedido, PedidoStatus } from "../types"

const PROXIMO_STATUS: Partial<Record<PedidoStatus, { status: Exclude<PedidoStatus, "CONFIRMADO">; label: string }>> = {
    CONFIRMADO: { status: "PREPARANDO", label: "Iniciar preparo" },
    PREPARANDO: { status: "ENTREGUE", label: "Marcar como entregue" },
}

const STATUS_CANCELAVEIS: PedidoStatus[] = ["CONFIRMADO", "PREPARANDO"]

export function StatusActions({ pedido }: { pedido: Pedido }) {
    const { update, loading } = useUpdatePedidoStatus(pedido.id)
    const proximo = PROXIMO_STATUS[pedido.status]
    const cancelavel = STATUS_CANCELAVEIS.includes(pedido.status)

    if (!proximo && !cancelavel) return null

    function cancelar() {
        if (window.confirm(`Cancelar o pedido #${pedido.id}? Essa ação não pode ser desfeita.`)) {
            update("CANCELADO")
        }
    }

    return (
        <div className="flex flex-wrap gap-2">
            {proximo && (
                <Button label={proximo.label} onClick={() => update(proximo.status)} disabled={loading} />
            )}
            {cancelavel && (
                <Button
                    label="Cancelar pedido"
                    onClick={cancelar}
                    disabled={loading}
                    className="bg-transparent text-destructive ring-1 ring-destructive/40 hover:bg-destructive/10"
                />
            )}
        </div>
    )
}
