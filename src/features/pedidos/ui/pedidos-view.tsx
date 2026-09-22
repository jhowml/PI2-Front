"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronRight, Plus } from "lucide-react"
import { CardList, ListPageLayout } from "@/components"
import { FormField } from "@/shared/components/ui/form-field"
import { Select } from "@/shared/components/ui/input"
import { Pagination } from "@/shared/components/ui/pagination"
import { formatCurrency, formatDateTime } from "@/shared/lib/format"
import { usePedidos } from "../hooks/use-pedidos"
import { PEDIDO_STATUSES, PEDIDO_STATUS_LABELS, TIPO_ENTREGA_LABELS, type PedidoStatus } from "../types"
import { ModalPedido } from "./modal-pedido"
import { StatusBadge } from "./status-badge"

export function PedidosView({ openNew = false }: { openNew?: boolean }) {
    const [modalOpen, setModalOpen] = useState(openNew)
    const [status, setStatus] = useState<PedidoStatus | "">("")
    const [page, setPage] = useState(1)
    const { pedidos, meta, loading, error } = usePedidos({ page, status: status || undefined })

    return (
        <>
            <ModalPedido open={modalOpen} onClose={() => setModalOpen(false)} />
            <ListPageLayout
                title="Pedidos"
                description="Pedidos mais recentes primeiro. Clique em um pedido para ver os detalhes."
                headerAction={{ label: "Novo pedido", icon: Plus, onClick: () => setModalOpen(true) }}
            >
                <div className="sm:w-60">
                    <FormField label="Filtrar por status">
                        <Select
                            value={status}
                            onChange={(e) => {
                                setStatus(e.target.value as PedidoStatus | "")
                                setPage(1)
                            }}
                        >
                            <option value="">Todos</option>
                            {PEDIDO_STATUSES.map((s) => <option key={s} value={s}>{PEDIDO_STATUS_LABELS[s]}</option>)}
                        </Select>
                    </FormField>
                </div>
                <CardList
                    items={pedidos}
                    getKey={(pedido) => pedido.id}
                    empty={
                        <p className="text-base font-medium text-muted-foreground" role="status">
                            {loading ? "Carregando..." : error ?? "Nenhum pedido encontrado"}
                        </p>
                    }
                    renderItem={(pedido) => (
                        <Link
                            href={`/pedidos/${pedido.id}`}
                            className="flex items-center gap-4 bg-card px-4 py-4 transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring md:px-6"
                        >
                            <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                                <span className="flex flex-wrap items-center gap-2">
                                    <span className="text-base font-semibold text-foreground">Pedido #{pedido.id}</span>
                                    <StatusBadge status={pedido.status} />
                                </span>
                                <span className="text-sm text-foreground">{pedido.cliente.nome}</span>
                                <span className="truncate text-sm text-muted-foreground">
                                    {pedido.itens.map((item) => `${item.quantidade}× ${item.cardapio.nome}`).join(", ")}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                    {formatDateTime(pedido.dataPedido)} · {TIPO_ENTREGA_LABELS[pedido.tipoEntrega]}
                                </span>
                            </span>
                            <span className="shrink-0 text-right font-semibold text-foreground">{formatCurrency(pedido.valorTotal)}</span>
                            <ChevronRight className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                        </Link>
                    )}
                />
                <Pagination meta={meta} onPageChange={setPage} />
            </ListPageLayout>
        </>
    )
}
