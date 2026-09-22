"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { createItemCardapio, CreateItemCardapioPayload } from "../services"
import { cardapioQueryKey } from "./use-cardapio"

export function useCreateItemCardapio() {
    const queryClient = useQueryClient()

    const { mutateAsync, isPending } = useMutation({
        mutationFn: (payload: CreateItemCardapioPayload) => createItemCardapio(payload),
        onSuccess: (item) => {
            queryClient.invalidateQueries({ queryKey: cardapioQueryKey })
            toast.success(`"${item.nome}" adicionado ao cardápio`)
        },
        onError: (e: Error) => toast.error(e.message),
    })

    return { create: mutateAsync, loading: isPending }
}
