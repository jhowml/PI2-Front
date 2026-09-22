"use client"

import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { listCardapio, ListCardapioParams } from "../services"

export const cardapioQueryKey = ["cardapio"] as const

export function useCardapio({ page = 1, pageSize = 20, search }: Partial<ListCardapioParams> = {}) {
    const { data, isLoading, error } = useQuery({
        queryKey: [...cardapioQueryKey, { page, pageSize, search }],
        queryFn: () => listCardapio({ page, pageSize, search }),
        placeholderData: keepPreviousData,
    })

    return {
        itens: data?.data ?? [],
        meta: data?.meta ?? null,
        loading: isLoading,
        error: error?.message ?? null,
    }
}
