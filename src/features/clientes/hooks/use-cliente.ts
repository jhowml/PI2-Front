"use client"

import { useQuery } from "@tanstack/react-query"
import { getCliente } from "../services"
import { clientesQueryKey } from "./use-clientes"

export function useCliente(id: number) {
    const { data, isLoading, error } = useQuery({
        queryKey: [...clientesQueryKey, id],
        queryFn: () => getCliente(id),
        enabled: Number.isInteger(id) && id > 0,
    })

    return { cliente: data ?? null, loading: isLoading, error: error?.message ?? null }
}
