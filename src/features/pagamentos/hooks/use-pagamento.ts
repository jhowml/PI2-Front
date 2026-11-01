"use client"

import { useQuery } from "@tanstack/react-query"
import { ApiError } from "@/shared/lib/api-client"
import { getPagamento } from "../services"

export const pagamentoQueryKey = (pedidoId: number) => ["pagamentos", pedidoId]

export function usePagamento(pedidoId: number) {
    const { data, isLoading, error } = useQuery({
        queryKey: pagamentoQueryKey(pedidoId),
        queryFn: async () => {
            try {
                return await getPagamento(pedidoId)
            } catch (err) {
                if (err instanceof ApiError && err.status === 404) return null
                throw err
            }
        },
        enabled: Number.isInteger(pedidoId) && pedidoId > 0,
    })

    return { pagamento: data ?? null, loading: isLoading, error: error?.message ?? null }
}
