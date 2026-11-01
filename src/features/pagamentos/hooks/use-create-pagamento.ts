"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { createPagamento, CreatePagamentoPayload } from "../services"
import { pagamentoQueryKey } from "./use-pagamento"

export function useCreatePagamento() {
    const queryClient = useQueryClient()

    const { mutateAsync, isPending } = useMutation({
        mutationFn: (payload: CreatePagamentoPayload) => createPagamento(payload),
        onSuccess: (pagamento) => {
            queryClient.invalidateQueries({ queryKey: pagamentoQueryKey(pagamento.pedidoId) })
            toast.success("Pagamento registrado.")
        },
        onError: (e: Error) => toast.error(e.message),
    })

    return { create: mutateAsync, loading: isPending }
}
