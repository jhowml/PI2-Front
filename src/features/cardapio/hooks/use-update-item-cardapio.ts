"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { updateItemCardapio, CreateItemCardapioPayload } from "../services"
import { cardapioQueryKey } from "./use-cardapio"

export function useUpdateItemCardapio(id: number) {
    const queryClient = useQueryClient()

    const { mutateAsync, isPending } = useMutation({
        mutationFn: (payload: CreateItemCardapioPayload) => updateItemCardapio(id, payload),
        onSuccess: (item) => {
            queryClient.invalidateQueries({ queryKey: cardapioQueryKey })
            toast.success(`"${item.nome}" atualizado`)
        },
        onError: (e: Error) => toast.error(e.message),
    })

    return { update: mutateAsync, loading: isPending }
}
