"use client"

import { useState } from "react"
import { Download } from "lucide-react"
import { Button } from "@/components"
import { Section } from "@/shared/components/ui/section"
import { FormField } from "@/shared/components/ui/form-field"
import { Input } from "@/shared/components/ui/input"
import { formatCurrency } from "@/shared/lib/format"
import { PEDIDO_STATUSES, PEDIDO_STATUS_LABELS } from "@/features/pedidos/types"
import { FORMAS_PAGAMENTO, FORMA_PAGAMENTO_LABELS } from "@/features/pagamentos"
import { useDashboard } from "../hooks/use-dashboard"
import { buildDashboardCsv, buildExportFilename, downloadCsv } from "../export-csv"
import {
    DIA_SEMANA_LABELS,
    DIAS_SEMANA,
    type FaturamentoDia,
    type ItemMaisVendido,
    type PagamentoPorForma,
    type PedidosPorStatus,
    type VendaDiaSemana,
} from "../types"
import { ChartCard } from "./chart-card"

function formatDiaCurto(data: string) {
    const [, month, day] = data.split("-")
    return `${day}/${month}`
}

function KpiTile({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-lg border border-border bg-card p-4">
            <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</dt>
            <dd className="mt-1 text-2xl font-bold tracking-tight">{value}</dd>
        </div>
    )
}

function FaturamentoChart({ dias }: { dias: FaturamentoDia[] }) {
    if (dias.length === 0) {
        return <p className="text-sm text-muted-foreground">Nenhum pedido no período selecionado.</p>
    }

    const maxFaturamento = Math.max(...dias.map((dia) => Number(dia.faturamento)))

    return (
        <div className="flex items-end gap-3 overflow-x-auto pb-1">
            {dias.map((dia) => {
                const altura = maxFaturamento > 0 ? Math.max((Number(dia.faturamento) / maxFaturamento) * 100, 4) : 4
                return (
                    <div key={dia.data} className="flex w-14 shrink-0 flex-col items-center gap-1">
                        <span className="text-[10px] text-muted-foreground">{formatCurrency(dia.faturamento)}</span>
                        <div className="flex h-32 w-full items-end">
                            <div className="w-full rounded-t-sm bg-primary" style={{ height: `${altura}%` }} />
                        </div>
                        <span className="text-[10px] text-muted-foreground">{formatDiaCurto(dia.data)}</span>
                        <span className="text-[10px] text-muted-foreground">{dia.pedidos} ped.</span>
                    </div>
                )
            })}
        </div>
    )
}

function VendasPorDiaSemanaChart({ vendas }: { vendas: VendaDiaSemana[] }) {
    const porDia = new Map(vendas.map((venda) => [venda.diaSemana, venda]))
    const maxFaturamento = Math.max(...vendas.map((venda) => Number(venda.faturamento)), 0)

    return (
        <div className="flex items-end gap-2 sm:gap-3">
            {DIAS_SEMANA.map((diaSemana) => {
                const venda = porDia.get(diaSemana)
                const faturamento = Number(venda?.faturamento ?? 0)
                const altura = maxFaturamento > 0 ? Math.max((faturamento / maxFaturamento) * 100, 4) : 4
                return (
                    <div key={diaSemana} className="flex flex-1 flex-col items-center gap-1">
                        <span className="text-[10px] font-medium text-foreground">{venda?.pedidos ?? 0}×</span>
                        <span className="text-[9px] text-muted-foreground">{formatCurrency(venda?.faturamento ?? 0)}</span>
                        <div className="flex h-20 w-full items-end sm:h-24">
                            <div className="w-full rounded-t-sm bg-primary" style={{ height: `${altura}%` }} />
                        </div>
                        <span className="text-[10px] text-muted-foreground">{DIA_SEMANA_LABELS[diaSemana].slice(0, 3)}</span>
                        <span className="text-[9px] text-muted-foreground">tkt {formatCurrency(venda?.ticketMedio ?? 0)}</span>
                    </div>
                )
            })}
        </div>
    )
}

function VendasPorDiaSemanaTable({ vendas }: { vendas: VendaDiaSemana[] }) {
    const porDia = new Map(vendas.map((venda) => [venda.diaSemana, venda]))

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                        <th scope="col" className="py-2 pr-3 font-semibold">Dia</th>
                        <th scope="col" className="px-3 py-2 text-right font-semibold">Pedidos</th>
                        <th scope="col" className="px-3 py-2 text-right font-semibold">Faturamento</th>
                        <th scope="col" className="py-2 pl-3 text-right font-semibold">Ticket médio</th>
                    </tr>
                </thead>
                <tbody>
                    {DIAS_SEMANA.map((diaSemana) => {
                        const venda = porDia.get(diaSemana)
                        return (
                            <tr key={diaSemana} className="border-b border-border last:border-0">
                                <th scope="row" className="py-2 pr-3 text-left font-medium">{DIA_SEMANA_LABELS[diaSemana]}</th>
                                <td className="px-3 py-2 text-right">{venda?.pedidos ?? 0}</td>
                                <td className="px-3 py-2 text-right">{formatCurrency(venda?.faturamento ?? 0)}</td>
                                <td className="py-2 pl-3 text-right">{formatCurrency(venda?.ticketMedio ?? 0)}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
}

function StatusDistribution({ porStatus }: { porStatus: PedidosPorStatus }) {
    const total = Object.values(porStatus).reduce((sum, value) => sum + value, 0)

    return (
        <ul className="flex flex-col gap-2">
            {PEDIDO_STATUSES.map((status) => {
                const count = porStatus[status]
                const percentual = total > 0 ? (count / total) * 100 : 0
                return (
                    <li key={status} className="flex items-center gap-3 text-sm">
                        <span className="w-28 shrink-0 text-muted-foreground">{PEDIDO_STATUS_LABELS[status]}</span>
                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                            <div className="h-full rounded-full bg-primary" style={{ width: `${percentual}%` }} />
                        </div>
                        <span className="w-8 shrink-0 text-right font-medium">{count}</span>
                    </li>
                )
            })}
        </ul>
    )
}

function ItensMaisVendidosList({ itens }: { itens: ItemMaisVendido[] }) {
    if (itens.length === 0) {
        return <p className="text-sm text-muted-foreground">Nenhum item vendido no período selecionado.</p>
    }

    const max = Math.max(...itens.map((item) => item.quantidade))

    return (
        <ul className="flex flex-col gap-2">
            {itens.map((item, index) => (
                <li key={item.cardapioId} className="flex items-center gap-3 text-sm">
                    <span className="w-6 shrink-0 text-muted-foreground">{index + 1}º</span>
                    <span className="w-32 shrink-0 truncate">{item.nome}</span>
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                        <div className="h-full rounded-full bg-primary" style={{ width: `${(item.quantidade / max) * 100}%` }} />
                    </div>
                    <span className="w-10 shrink-0 text-right font-medium">{item.quantidade}×</span>
                </li>
            ))}
        </ul>
    )
}

function PagamentosPorFormaDistribution({ pagamentos }: { pagamentos: PagamentoPorForma[] }) {
    const porForma = new Map(pagamentos.map((item) => [item.forma, item]))
    const total = pagamentos.reduce((sum, item) => sum + Number(item.valor), 0)

    return (
        <ul className="flex flex-col gap-2">
            {FORMAS_PAGAMENTO.map((forma) => {
                const item = porForma.get(forma)
                const valor = Number(item?.valor ?? 0)
                const percentual = total > 0 ? (valor / total) * 100 : 0
                return (
                    <li key={forma} className="flex items-center gap-3 text-sm">
                        <span className="w-32 shrink-0 text-muted-foreground">{FORMA_PAGAMENTO_LABELS[forma]}</span>
                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                            <div className="h-full rounded-full bg-primary" style={{ width: `${percentual}%` }} />
                        </div>
                        <span className="w-20 shrink-0 text-right font-medium">{formatCurrency(item?.valor ?? 0)}</span>
                    </li>
                )
            })}
        </ul>
    )
}

export function DashboardView() {
    const [from, setFrom] = useState("")
    const [to, setTo] = useState("")
    const { dashboard, loading, error } = useDashboard({ from: from || undefined, to: to || undefined })

    const totalPedidos = dashboard ? Object.values(dashboard.pedidosPorStatus).reduce((sum, value) => sum + value, 0) : 0

    function exportarCsv() {
        if (!dashboard) return
        downloadCsv(buildExportFilename(), buildDashboardCsv(dashboard))
    }

    return (
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 p-4 md:p-8">
            <header className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Indicadores</h1>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Faturamento, status dos pedidos, formas de pagamento e itens mais vendidos.
                    </p>
                </div>
                <Button
                    label="Exportar CSV"
                    icon={Download}
                    onClick={exportarCsv}
                    disabled={!dashboard}
                    className="bg-transparent text-foreground ring-1 ring-border hover:bg-muted"
                />
            </header>

            <Section title="Período">
                <div className="flex flex-wrap items-end gap-3">
                    <FormField label="De">
                        <Input type="date" value={from} onChange={(event) => setFrom(event.target.value)} className="w-40" />
                    </FormField>
                    <FormField label="Até">
                        <Input type="date" value={to} onChange={(event) => setTo(event.target.value)} className="w-40" />
                    </FormField>
                    {(from || to) && (
                        <Button
                            label="Limpar período"
                            onClick={() => { setFrom(""); setTo("") }}
                            className="bg-transparent text-foreground ring-1 ring-border hover:bg-muted"
                        />
                    )}
                </div>
            </Section>

            {loading && <p className="text-sm text-muted-foreground" role="status">Carregando...</p>}
            {error && <p className="text-sm font-medium text-destructive" role="alert">{error}</p>}

            {dashboard && (
                <>
                    <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                        <KpiTile label="Faturamento" value={formatCurrency(dashboard.faturamentoTotal)} />
                        <KpiTile label="Ticket médio" value={formatCurrency(dashboard.ticketMedio)} />
                        <KpiTile label="Pedidos" value={String(totalPedidos)} />
                    </dl>

                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                        <div className="lg:col-span-2">
                            <ChartCard title="Faturamento por período">
                                <FaturamentoChart dias={dashboard.faturamentoPorPeriodo} />
                            </ChartCard>
                        </div>

                        <div className="lg:col-span-2">
                            <ChartCard
                                title="Vendas por dia da semana"
                                expandedContent={<VendasPorDiaSemanaTable vendas={dashboard.vendasPorDiaSemana} />}
                            >
                                <VendasPorDiaSemanaChart vendas={dashboard.vendasPorDiaSemana} />
                            </ChartCard>
                        </div>

                        <ChartCard title="Pedidos por status">
                            <StatusDistribution porStatus={dashboard.pedidosPorStatus} />
                        </ChartCard>

                        <ChartCard title="Pagamentos por forma">
                            <PagamentosPorFormaDistribution pagamentos={dashboard.pagamentosPorForma} />
                        </ChartCard>

                        <ChartCard title="Itens mais vendidos">
                            <ItensMaisVendidosList itens={dashboard.itensMaisVendidos} />
                        </ChartCard>
                    </div>
                </>
            )}
        </div>
    )
}
