"use client"

import { useState } from "react"
import { Maximize2 } from "lucide-react"
import { Button } from "@/components"
import { Modal } from "@/shared/components/ui/modal"

interface ChartCardProps {
    title: string
    /** Resumo textual dos dados, usado como aria-label do gráfico (role="img"). Ignorado quando scrollable. */
    summary?: string
    chart: React.ReactNode
    table: React.ReactNode
    /**
     * O próprio `chart` já define seu papel ARIA (role="region" + rolagem por teclado) —
     * usado só pelo gráfico de faturamento por período, que precisa de scroll horizontal.
     */
    scrollable?: boolean
}

export function ChartCard({ title, summary, chart, table, scrollable }: ChartCardProps) {
    const [showTable, setShowTable] = useState(false)
    const [expanded, setExpanded] = useState(false)

    const visual = scrollable ? chart : <div role="img" aria-label={summary}>{chart}</div>
    const content = showTable ? table : visual

    return (
        <>
            <section className="flex flex-col gap-3 rounded-lg border border-border bg-card p-5">
                <div className="flex items-center justify-between gap-2">
                    <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">{title}</h2>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => setShowTable((value) => !value)}
                            className="rounded-md text-xs font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                            {showTable ? "Ver como gráfico" : "Ver como tabela"}
                        </button>
                        <Button variant="icon" icon={Maximize2} label={`Expandir ${title}`} onClick={() => setExpanded(true)} />
                    </div>
                </div>
                {content}
            </section>

            {expanded && (
                <Modal title={title} open onClose={() => setExpanded(false)}>
                    {content}
                </Modal>
            )}
        </>
    )
}
