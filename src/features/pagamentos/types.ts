export const FORMAS_PAGAMENTO = ["DINHEIRO", "PIX", "CARTAO_CREDITO", "CARTAO_DEBITO"] as const
export type FormaPagamento = (typeof FORMAS_PAGAMENTO)[number]

export const FORMA_PAGAMENTO_LABELS: Record<FormaPagamento, string> = {
    DINHEIRO: "Dinheiro",
    PIX: "Pix",
    CARTAO_CREDITO: "Cartão de crédito",
    CARTAO_DEBITO: "Cartão de débito",
}

export const STATUS_PAGAMENTO = ["PENDENTE", "PAGO", "ESTORNADO"] as const
export type StatusPagamento = (typeof STATUS_PAGAMENTO)[number]

export const STATUS_PAGAMENTO_LABELS: Record<StatusPagamento, string> = {
    PENDENTE: "Pendente",
    PAGO: "Pago",
    ESTORNADO: "Estornado",
}

export type Pagamento = {
    id: number
    forma: FormaPagamento
    status: StatusPagamento
    valor: string
    dataPagamento: string | null
    pedidoId: number
}
