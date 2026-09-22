import { apiClient, ApiRoute } from "@/shared/lib/api-client"
import type { PaginatedResponse } from "@/shared/types/pagination"
import type { Cliente } from "./types"

export interface ListClientesParams {
    page: number
    pageSize: number
    search?: string
}

export interface CreateClientePayload {
    nome: string
    telefone: string
    obs?: string
    cep?: string
    logradouro?: string
    numero?: string
    complemento?: string
    bairro?: string
    cidade?: string
    uf?: string
}

export function listClientes(params: ListClientesParams) {
    return apiClient.get<PaginatedResponse<Cliente>>(ApiRoute.Clientes, { ...params })
}

export function getCliente(id: number) {
    return apiClient.getById<Cliente>(ApiRoute.Clientes, id)
}

export function createCliente(payload: CreateClientePayload) {
    return apiClient.post<Cliente>(ApiRoute.Clientes, payload)
}
