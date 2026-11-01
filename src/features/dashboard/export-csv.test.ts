import { describe, expect, it, vi } from "vitest"
import { buildDashboardCsv, buildExportFilename } from "./export-csv"
import type { DashboardIndicadores } from "./types"

const baseDashboard: DashboardIndicadores = {
    faturamentoTotal: "100.00",
    ticketMedio: "50.00",
    faturamentoPorPeriodo: [{ data: "2026-10-01", pedidos: 2, faturamento: "100.00" }],
    vendasPorDiaSemana: [{ diaSemana: "QUINTA", pedidos: 2, faturamento: "100.00", ticketMedio: "50.00" }],
    pedidosPorStatus: { CONFIRMADO: 1, PREPARANDO: 0, ENTREGUE: 1, CANCELADO: 0 },
    itensMaisVendidos: [{ cardapioId: 1, nome: "Marmita", quantidade: 5 }],
    pagamentosPorForma: [{ forma: "PIX", quantidade: 2, valor: "100.00" }],
}

describe("buildDashboardCsv", () => {
    it("includes the resumo with faturamentoTotal and ticketMedio", () => {
        const csv = buildDashboardCsv(baseDashboard)

        expect(csv).toContain("Resumo")
        expect(csv).toContain("100.00;50.00")
    })

    it("lists all 7 weekdays even when only one has data, including ticketMedio", () => {
        const csv = buildDashboardCsv(baseDashboard)
        const lines = csv.split("\n")
        const start = lines.indexOf("Vendas por dia da semana") + 2
        const weekdayLines = lines.slice(start, start + 7)

        expect(weekdayLines).toEqual([
            "Segunda;0;0;0",
            "Terça;0;0;0",
            "Quarta;0;0;0",
            "Quinta;2;100.00;50.00",
            "Sexta;0;0;0",
            "Sábado;0;0;0",
            "Domingo;0;0;0",
        ])
    })

    it("lists all 4 pedido statuses", () => {
        const csv = buildDashboardCsv(baseDashboard)

        expect(csv).toContain("Confirmado;1")
        expect(csv).toContain("Entregue;1")
        expect(csv).toContain("Cancelado;0")
    })

    it("lists all 4 formas de pagamento even when only one has data", () => {
        const csv = buildDashboardCsv(baseDashboard)
        const lines = csv.split("\n")
        const start = lines.indexOf("Pagamentos por forma") + 2
        const formaLines = lines.slice(start, start + 4)

        expect(formaLines).toEqual([
            "Dinheiro;0;0",
            "Pix;2;100.00",
            "Cartão de crédito;0;0",
            "Cartão de débito;0;0",
        ])
    })

    it("escapes values containing the field separator", () => {
        const dashboard: DashboardIndicadores = {
            ...baseDashboard,
            itensMaisVendidos: [{ cardapioId: 1, nome: "Arroz; feijão", quantidade: 3 }],
        }

        const csv = buildDashboardCsv(dashboard)

        expect(csv).toContain('"Arroz; feijão";3')
    })
})

describe("buildExportFilename", () => {
    it("follows the indicadores_<data>_<hora>.csv pattern", () => {
        vi.setSystemTime(new Date(2026, 10, 1, 9, 5, 3))

        expect(buildExportFilename()).toBe("indicadores_2026-11-01_09-05-03.csv")

        vi.useRealTimers()
    })
})
