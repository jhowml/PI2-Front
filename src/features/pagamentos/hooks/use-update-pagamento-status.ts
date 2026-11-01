"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { updatePagamentoStatus } from "../services"
import { pagamentoQueryKey } from "./use-pagamento"
import type { StatusPagamento } from "../types"

export function useUpdatePagamentoStatus(pedidoId: number) {
    const queryClient = useQueryClient()

    const { mutateAsync, isPending } = useMutation({
        mutationFn: (status: Extract<StatusPagamento, "PAGO" | "ESTORNADO">) => updatePagamentoStatus(pedidoId, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: pagamentoQueryKey(pedidoId) })
            toast.success("Status do pagamento atualizado.")
        },
        onError: (e: Error) => toast.error(e.message),
    })

    return { update: mutateAsync, loading: isPending }
}
