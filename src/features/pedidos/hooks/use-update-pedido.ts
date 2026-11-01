"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { formatCurrency } from "@/shared/lib/format"
import { updatePedido, UpdatePedidoPayload } from "../services"
import { pedidosQueryKey } from "./use-pedidos"

export function useUpdatePedido(id: number) {
    const queryClient = useQueryClient()

    const { mutateAsync, isPending } = useMutation({
        mutationFn: (payload: UpdatePedidoPayload) => updatePedido(id, payload),
        onSuccess: (pedido) => {
            queryClient.invalidateQueries({ queryKey: pedidosQueryKey })
            toast.success(`Pedido #${pedido.id} atualizado — total ${formatCurrency(pedido.valorTotal)}`)
        },
        onError: (e: Error) => toast.error(e.message),
    })

    return { update: mutateAsync, loading: isPending }
}
