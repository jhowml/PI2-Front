import { apiClient, ApiRoute } from "@/shared/lib/api-client"
import type { PaginatedResponse } from "@/shared/types/pagination"
import type { ItemCardapio } from "./types"

export interface ListCardapioParams {
    page: number
    pageSize: number
    search?: string
}

export interface CreateItemCardapioPayload {
    nome: string
    descricao?: string
    preco: number
    categoria: string
    disponivel: boolean
}

export function listCardapio(params: ListCardapioParams) {
    return apiClient.get<PaginatedResponse<ItemCardapio>>(ApiRoute.Cardapio, { ...params })
}

export function createItemCardapio(payload: CreateItemCardapioPayload) {
    return apiClient.post<ItemCardapio>(ApiRoute.Cardapio, payload)
}
