"use client"

import { useQuery } from "@tanstack/react-query"
import { getPedido } from "../services"
import { pedidosQueryKey } from "./use-pedidos"

export function usePedido(id: number) {
    const { data, isLoading, error } = useQuery({
        queryKey: [...pedidosQueryKey, id],
        queryFn: () => getPedido(id),
        enabled: Number.isInteger(id) && id > 0,
    })

    return { pedido: data ?? null, loading: isLoading, error: error?.message ?? null }
}
