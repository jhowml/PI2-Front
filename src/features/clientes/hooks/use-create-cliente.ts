"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { createCliente, CreateClientePayload } from "../services"
import { clientesQueryKey } from "./use-clientes"

export function useCreateCliente() {
    const queryClient = useQueryClient()

    const { mutateAsync, isPending } = useMutation({
        mutationFn: (payload: CreateClientePayload) => createCliente(payload),
        onSuccess: (cliente) => {
            queryClient.invalidateQueries({ queryKey: clientesQueryKey })
            toast.success(`Cliente "${cliente.nome}" cadastrado`)
        },
        onError: (e: Error) => toast.error(e.message),
    })

    return { create: mutateAsync, loading: isPending }
}
