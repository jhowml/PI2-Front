import { apiClient, ApiRoute } from "@/shared/lib/api-client"
import type { PaginatedResponse } from "@/shared/types/pagination"
import type { Pedido, PedidoStatus, TipoEntrega } from "./types"

export interface ListPedidosParams {
    page: number
    pageSize: number
    status?: PedidoStatus
}

export interface CreatePedidoPayload {
    clienteId: number
    tipoEntrega: TipoEntrega
    taxaEntrega: number
    desconto: number
    itens: { cardapioId: number; quantidade: number }[]
    obs?: string
}

export function listPedidos(params: ListPedidosParams) {
    return apiClient.get<PaginatedResponse<Pedido>>(ApiRoute.Pedidos, { ...params })
}

export function getPedido(id: number) {
    return apiClient.getById<Pedido>(ApiRoute.Pedidos, id)
}

export function createPedido(payload: CreatePedidoPayload) {
    return apiClient.post<Pedido>(ApiRoute.Pedidos, payload)
}
