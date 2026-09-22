import type { ItemCardapio } from "@/features/cardapio"
import type { Cliente } from "@/features/clientes"

export const PEDIDO_STATUSES = ["PENDENTE", "CONFIRMADO", "PREPARANDO", "ENTREGUE", "CANCELADO"] as const
export type PedidoStatus = (typeof PEDIDO_STATUSES)[number]

export const TIPOS_ENTREGA = ["ENTREGA", "RETIRADA"] as const
export type TipoEntrega = (typeof TIPOS_ENTREGA)[number]

export const PEDIDO_STATUS_LABELS: Record<PedidoStatus, string> = {
    PENDENTE: "Pendente",
    CONFIRMADO: "Confirmado",
    PREPARANDO: "Preparando",
    ENTREGUE: "Entregue",
    CANCELADO: "Cancelado",
}

export const TIPO_ENTREGA_LABELS: Record<TipoEntrega, string> = {
    ENTREGA: "Entrega",
    RETIRADA: "Retirada no balcão",
}

export type ItemPedido = {
    id: number
    quantidade: number
    precoUnitario: string
    pedidoId: number
    cardapioId: number
    cardapio: ItemCardapio
}

export type Pedido = {
    id: number
    dataPedido: string
    status: PedidoStatus
    tipoEntrega: TipoEntrega
    taxaEntrega: string
    desconto: string
    valorTotal: string
    obs: string | null
    clienteId: number
    cliente: Cliente
    itens: ItemPedido[]
}
