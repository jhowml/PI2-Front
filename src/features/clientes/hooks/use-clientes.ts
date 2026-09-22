"use client"

import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { listClientes, ListClientesParams } from "../services"

export const clientesQueryKey = ["clientes"] as const

export function useClientes({ page = 1, pageSize = 20, search }: Partial<ListClientesParams> = {}) {
    const { data, isLoading, error } = useQuery({
        queryKey: [...clientesQueryKey, { page, pageSize, search }],
        queryFn: () => listClientes({ page, pageSize, search }),
        placeholderData: keepPreviousData,
    })

    return {
        clientes: data?.data ?? [],
        meta: data?.meta ?? null,
        loading: isLoading,
        error: error?.message ?? null,
    }
}
