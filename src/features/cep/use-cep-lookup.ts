"use client"

import { useCallback, useState } from "react"
import { ApiError } from "@/shared/lib/api-client"
import { getEnderecoByCep } from "./services"
import type { Endereco } from "./types"

type CepLookupStatus =
    | { state: "idle" }
    | { state: "loading" }
    | { state: "found" }
    | { state: "error"; message: string }

export function cepErrorMessage(error: unknown) {
    if (error instanceof ApiError && error.status === 404) {
        return "CEP não encontrado. Preencha o endereço manualmente."
    }
    if (error instanceof ApiError && error.status === 422) {
        return "CEP inválido. Informe 8 dígitos."
    }
    return "Não foi possível consultar o CEP agora. Preencha o endereço manualmente."
}

export function useCepLookup(onFound: (endereco: Endereco) => void) {
    const [status, setStatus] = useState<CepLookupStatus>({ state: "idle" })

    const lookup = useCallback(async (cep: string) => {
        setStatus({ state: "loading" })
        try {
            const endereco = await getEnderecoByCep(cep)
            onFound(endereco)
            setStatus({ state: "found" })
        } catch (error) {
            setStatus({ state: "error", message: cepErrorMessage(error) })
        }
    }, [onFound])

    const reset = useCallback(() => setStatus({ state: "idle" }), [])

    return { status, lookup, reset }
}
