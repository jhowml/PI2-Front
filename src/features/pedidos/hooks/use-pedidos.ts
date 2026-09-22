"use client"

import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { listPedidos, ListPedidosParams } from "../services"

export const pedidosQueryKey = ["pedidos"] as const

export function usePedidos({ page = 1, pageSize = 20, status }: Partial<ListPedidosParams> = {}) {
    const { data, isLoading, error } = useQuery({
        queryKey: [...pedidosQueryKey, { page, pageSize, status }],
        queryFn: () => listPedidos({ page, pageSize, status }),
        placeholderData: keepPreviousData,
    })

    return {
        pedidos: data?.data ?? [],
        meta: data?.meta ?? null,
        loading: isLoading,
        error: error?.message ?? null,
    }
}
