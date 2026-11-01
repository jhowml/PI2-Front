import { apiClient, ApiRoute } from "@/shared/lib/api-client"
import type { FormaPagamento, Pagamento, StatusPagamento } from "./types"

export interface CreatePagamentoPayload {
    pedidoId: number
    forma: FormaPagamento
}

export function getPagamento(pedidoId: number) {
    return apiClient.getById<Pagamento>(ApiRoute.Pagamentos, pedidoId)
}

export function createPagamento(payload: CreatePagamentoPayload) {
    return apiClient.post<Pagamento>(ApiRoute.Pagamentos, payload)
}

export function updatePagamentoStatus(pedidoId: number, status: Extract<StatusPagamento, "PAGO" | "ESTORNADO">) {
    return apiClient.patch<Pagamento>(ApiRoute.Pagamentos, pedidoId, { status })
}

export function updatePagamentoForma(pedidoId: number, forma: FormaPagamento) {
    return apiClient.patchAction<Pagamento>(ApiRoute.Pagamentos, pedidoId, "forma", { forma })
}
