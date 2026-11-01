"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { updateCliente, CreateClientePayload } from "../services"
import { clientesQueryKey } from "./use-clientes"

export function useUpdateCliente(id: number) {
    const queryClient = useQueryClient()

    const { mutateAsync, isPending } = useMutation({
        mutationFn: (payload: CreateClientePayload) => updateCliente(id, payload),
        onSuccess: (cliente) => {
            queryClient.invalidateQueries({ queryKey: clientesQueryKey })
            toast.success(`Cliente "${cliente.nome}" atualizado`)
        },
        onError: (e: Error) => toast.error(e.message),
    })

    return { update: mutateAsync, loading: isPending }
}
