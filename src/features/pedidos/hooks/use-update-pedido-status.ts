"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { updatePedidoStatus } from "../services"
import { pedidosQueryKey } from "./use-pedidos"
import type { PedidoStatus } from "../types"

export function useUpdatePedidoStatus(id: number) {
    const queryClient = useQueryClient()

    const { mutateAsync, isPending } = useMutation({
        mutationFn: (status: Exclude<PedidoStatus, "CONFIRMADO">) => updatePedidoStatus(id, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: pedidosQueryKey })
            toast.success("Status do pedido atualizado.")
        },
        onError: (e: Error) => toast.error(e.message),
    })

    return { update: mutateAsync, loading: isPending }
}
