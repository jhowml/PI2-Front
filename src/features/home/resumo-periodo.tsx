"use client"

import { useId } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { formatCurrency } from "@/shared/lib/format"
import { useDashboard } from "@/features/dashboard"

function Tile({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-lg border border-border bg-card p-4">
            <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</dt>
            <dd className="mt-1 text-xl font-bold tracking-tight">{value}</dd>
        </div>
    )
}

interface ResumoPeriodoProps {
    titulo: string
    from: string
    to: string
}

export function ResumoPeriodo({ titulo, from, to }: ResumoPeriodoProps) {
    const titleId = useId()
    const { dashboard, loading, error } = useDashboard({ from, to })

    const totalPedidos = dashboard
        ? Object.values(dashboard.pedidosPorStatus).reduce((sum, value) => sum + value, 0)
        : 0

    return (
        <section aria-labelledby={titleId} className="flex flex-col gap-3">
            <div className="flex items-center justify-between gap-4">
                <h2 id={titleId} className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                    {titulo}
                </h2>
                <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                    Ver indicadores completos
                    <ArrowRight className="size-3.5" aria-hidden="true" />
                </Link>
            </div>

            {loading && <p className="text-sm text-muted-foreground" role="status">Carregando...</p>}
            {error && <p className="text-sm font-medium text-destructive" role="alert">{error}</p>}

            {dashboard && (
                <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <Tile label="Faturamento" value={formatCurrency(dashboard.faturamentoTotal)} />
                    <Tile label="Pedidos" value={String(totalPedidos)} />
                    <Tile label="Ticket médio" value={formatCurrency(dashboard.ticketMedio)} />
                    <Tile label="Confirmados" value={String(dashboard.pedidosPorStatus.CONFIRMADO)} />
                </dl>
            )}
        </section>
    )
}
