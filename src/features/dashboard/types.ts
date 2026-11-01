import type { FormaPagamento } from "@/features/pagamentos"

export type FaturamentoDia = {
    data: string
    pedidos: number
    faturamento: string
}

export const DIAS_SEMANA = ["SEGUNDA", "TERCA", "QUARTA", "QUINTA", "SEXTA", "SABADO", "DOMINGO"] as const
export type DiaSemana = (typeof DIAS_SEMANA)[number]

export const DIA_SEMANA_LABELS: Record<DiaSemana, string> = {
    SEGUNDA: "Segunda",
    TERCA: "Terça",
    QUARTA: "Quarta",
    QUINTA: "Quinta",
    SEXTA: "Sexta",
    SABADO: "Sábado",
    DOMINGO: "Domingo",
}

export type VendaDiaSemana = {
    diaSemana: DiaSemana
    pedidos: number
    faturamento: string
    ticketMedio: string
}

export type PedidosPorStatus = {
    CONFIRMADO: number
    PREPARANDO: number
    ENTREGUE: number
    CANCELADO: number
}

export type ItemMaisVendido = {
    cardapioId: number
    nome: string
    quantidade: number
}

export type PagamentoPorForma = {
    forma: FormaPagamento
    quantidade: number
    valor: string
}

export type DashboardIndicadores = {
    faturamentoTotal: string
    ticketMedio: string
    faturamentoPorPeriodo: FaturamentoDia[]
    vendasPorDiaSemana: VendaDiaSemana[]
    pedidosPorStatus: PedidosPorStatus
    itensMaisVendidos: ItemMaisVendido[]
    pagamentosPorForma: PagamentoPorForma[]
}
