"use client"

import { useState } from "react"
import { Maximize2 } from "lucide-react"
import { Button } from "@/components"
import { Modal } from "@/shared/components/ui/modal"

interface ChartCardProps {
    title: string
    children: React.ReactNode
    expandedContent?: React.ReactNode
}

export function ChartCard({ title, children, expandedContent }: ChartCardProps) {
    const [expanded, setExpanded] = useState(false)

    return (
        <>
            <section className="flex flex-col gap-3 rounded-lg border border-border bg-card p-5">
                <div className="flex items-center justify-between gap-2">
                    <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">{title}</h2>
                    <Button variant="icon" icon={Maximize2} label={`Expandir ${title}`} onClick={() => setExpanded(true)} />
                </div>
                {children}
            </section>

            {expanded && (
                <Modal title={title} open onClose={() => setExpanded(false)}>
                    {expandedContent ?? children}
                </Modal>
            )}
        </>
    )
}
