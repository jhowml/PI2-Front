"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { updatePagamentoForma } from "../services"
import { pagamentoQueryKey } from "./use-pagamento"
import type { FormaPagamento } from "../types"

export function useUpdatePagamentoForma(pedidoId: number) {
    const queryClient = useQueryClient()

    const { mutateAsync, isPending } = useMutation({
        mutationFn: (forma: FormaPagamento) => updatePagamentoForma(pedidoId, forma),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: pagamentoQueryKey(pedidoId) })
            toast.success("Forma de pagamento atualizada.")
        },
        onError: (e: Error) => toast.error(e.message),
    })

    return { update: mutateAsync, loading: isPending }
}
