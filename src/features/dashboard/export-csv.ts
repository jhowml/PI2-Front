import { PEDIDO_STATUSES, PEDIDO_STATUS_LABELS } from "@/features/pedidos/types"
import { FORMAS_PAGAMENTO, FORMA_PAGAMENTO_LABELS } from "@/features/pagamentos"
import { DIA_SEMANA_LABELS, DIAS_SEMANA, type DashboardIndicadores } from "./types"

function csvEscape(value: string | number) {
    const str = String(value)
    return /[;"\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str
}

function row(values: (string | number)[]) {
    return values.map(csvEscape).join(";")
}

export function buildDashboardCsv(dashboard: DashboardIndicadores): string {
    const lines: string[] = []

    lines.push("Resumo")
    lines.push(row(["Faturamento total", "Ticket médio"]))
    lines.push(row([dashboard.faturamentoTotal, dashboard.ticketMedio]))
    lines.push("")

    lines.push("Faturamento por período")
    lines.push(row(["Data", "Pedidos", "Faturamento"]))
    dashboard.faturamentoPorPeriodo.forEach((dia) => lines.push(row([dia.data, dia.pedidos, dia.faturamento])))
    lines.push("")

    lines.push("Vendas por dia da semana")
    lines.push(row(["Dia da semana", "Pedidos", "Faturamento", "Ticket médio"]))
    DIAS_SEMANA.forEach((diaSemana) => {
        const dia = dashboard.vendasPorDiaSemana.find((item) => item.diaSemana === diaSemana)
        lines.push(row([DIA_SEMANA_LABELS[diaSemana], dia?.pedidos ?? 0, dia?.faturamento ?? "0", dia?.ticketMedio ?? "0"]))
    })
    lines.push("")

    lines.push("Pedidos por status")
    lines.push(row(["Status", "Quantidade"]))
    PEDIDO_STATUSES.forEach((status) => lines.push(row([PEDIDO_STATUS_LABELS[status], dashboard.pedidosPorStatus[status]])))
    lines.push("")

    lines.push("Itens mais vendidos")
    lines.push(row(["Item", "Quantidade"]))
    dashboard.itensMaisVendidos.forEach((item) => lines.push(row([item.nome, item.quantidade])))
    lines.push("")

    lines.push("Pagamentos por forma")
    lines.push(row(["Forma", "Quantidade", "Valor"]))
    FORMAS_PAGAMENTO.forEach((forma) => {
        const pagamento = dashboard.pagamentosPorForma.find((item) => item.forma === forma)
        lines.push(row([FORMA_PAGAMENTO_LABELS[forma], pagamento?.quantidade ?? 0, pagamento?.valor ?? "0"]))
    })

    return lines.join("\n")
}

function pad(value: number) {
    return String(value).padStart(2, "0")
}

export function buildExportFilename() {
    const now = new Date()
    const data = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`
    const hora = `${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}`
    return `indicadores_${data}_${hora}.csv`
}

export function downloadCsv(filename: string, content: string) {
    const blob = new Blob([`﻿${content}`], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
}
