"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { formatCurrency } from "@/shared/lib/format"
import { createPedido, CreatePedidoPayload } from "../services"
import { pedidosQueryKey } from "./use-pedidos"

export function useCreatePedido() {
    const queryClient = useQueryClient()

    const { mutateAsync, isPending } = useMutation({
        mutationFn: (payload: CreatePedidoPayload) => createPedido(payload),
        onSuccess: (pedido) => {
            queryClient.invalidateQueries({ queryKey: pedidosQueryKey })
            toast.success(`Pedido #${pedido.id} registrado — total ${formatCurrency(pedido.valorTotal)}`)
        },
        onError: (e: Error) => toast.error(e.message),
    })

    return { create: mutateAsync, loading: isPending }
}
