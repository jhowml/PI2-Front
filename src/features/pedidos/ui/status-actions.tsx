"use client"

import { Button } from "@/components"
import { useUpdatePedidoStatus } from "../hooks/use-update-pedido-status"
import type { Pedido, PedidoStatus } from "../types"

const PROXIMO_STATUS: Partial<Record<PedidoStatus, { status: Exclude<PedidoStatus, "CONFIRMADO">; label: string }>> = {
    CONFIRMADO: { status: "PREPARANDO", label: "Iniciar preparo" },
    PREPARANDO: { status: "ENTREGUE", label: "Marcar como entregue" },
}

const STATUS_CANCELAVEIS: PedidoStatus[] = ["CONFIRMADO", "PREPARANDO"]

interface StatusActionsProps {
    pedido: Pedido
    /** Pagamento do pedido já está PAGO — cancelar fica bloqueado até estornar. */
    pagamentoPago: boolean
}

export function StatusActions({ pedido, pagamentoPago }: StatusActionsProps) {
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
        <div className="flex flex-col gap-2">
            <div className="flex flex-wrap gap-2">
                {proximo && (
                    <Button label={proximo.label} onClick={() => update(proximo.status)} disabled={loading} />
                )}
                {cancelavel && (
                    <Button
                        label="Cancelar pedido"
                        title={pagamentoPago ? "Estorne o pagamento antes de cancelar o pedido." : undefined}
                        onClick={cancelar}
                        disabled={loading || pagamentoPago}
                        className="bg-transparent text-destructive ring-1 ring-destructive/40 hover:bg-destructive/10"
                    />
                )}
            </div>
            {cancelavel && pagamentoPago && (
                <p className="text-xs text-muted-foreground" role="note">
                    Pagamento já recebido — estorne-o na seção &quot;Pagamento&quot; abaixo para poder cancelar o pedido.
                </p>
            )}
        </div>
    )
}
