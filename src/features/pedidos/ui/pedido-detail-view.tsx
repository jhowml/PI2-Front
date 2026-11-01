"use client"

import { useState } from "react"
import { Pencil } from "lucide-react"
import { BackLink } from "@/shared/components/ui/back-link"
import { Row, Section } from "@/shared/components/ui/section"
import { Button } from "@/components"
import { formatCents, formatCurrency, formatDateTime, formatPhone } from "@/shared/lib/format"
import { useDocumentTitle } from "@/shared/hooks/use-document-title"
import { formatEndereco } from "@/features/clientes/utils"
import { PagamentoSection, usePagamento } from "@/features/pagamentos"
import { usePedido } from "../hooks/use-pedido"
import { calculatePedidoTotals } from "../totals"
import { TIPO_ENTREGA_LABELS } from "../types"
import { StatusBadge } from "./status-badge"
import { StatusActions } from "./status-actions"
import { ModalEditarPedido } from "./modal-editar-pedido"

const STATUS_EDITAVEIS = ["CONFIRMADO"]

export function PedidoDetailView({ id }: { id: number }) {
    const { pedido, loading, error } = usePedido(id)
    const { pagamento } = usePagamento(pedido?.id ?? 0)
    const pagamentoPago = pagamento?.status === "PAGO"
    const [editando, setEditando] = useState(false)
    useDocumentTitle(pedido ? `Pedido #${pedido.id}` : undefined)
    const subtotal = pedido ? calculatePedidoTotals(pedido.itens, 0, 0).subtotalCents : 0

    return (
        <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 p-4 md:p-8">
            <BackLink href="/pedidos" label="Voltar para pedidos" />

            {loading && <p className="text-sm text-muted-foreground" role="status">Carregando...</p>}
            {error && <p className="text-sm font-medium text-destructive" role="alert">{error}</p>}

            {pedido && (
                <>
                    <header className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-semibold tracking-tight">Pedido #{pedido.id}</h1>
                            <p className="mt-0.5 text-sm text-muted-foreground">Registrado em {formatDateTime(pedido.dataPedido)}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            {STATUS_EDITAVEIS.includes(pedido.status) && (
                                <Button
                                    variant="icon"
                                    icon={Pencil}
                                    label={`Editar pedido #${pedido.id}`}
                                    title={pagamentoPago ? "Estorne o pagamento antes de editar o pedido." : undefined}
                                    disabled={pagamentoPago}
                                    onClick={() => setEditando(true)}
                                />
                            )}
                            <StatusBadge status={pedido.status} className="px-3 py-1 text-sm" />
                        </div>
                    </header>
                    {STATUS_EDITAVEIS.includes(pedido.status) && pagamentoPago && (
                        <p className="-mt-4 text-xs text-muted-foreground" role="note">
                            Pagamento já recebido — estorne-o na seção &quot;Pagamento&quot; abaixo para poder editar o pedido.
                        </p>
                    )}

                    <StatusActions pedido={pedido} pagamentoPago={pagamentoPago} />

                    <Section title="Cliente">
                        <dl className="flex flex-col gap-3">
                            <Row label="Nome" value={pedido.cliente.nome} />
                            <Row label="Telefone" value={formatPhone(pedido.cliente.telefone)} />
                            <Row label="Tipo" value={TIPO_ENTREGA_LABELS[pedido.tipoEntrega]} />
                            {pedido.tipoEntrega === "ENTREGA" && (
                                <Row label="Endereço" value={formatEndereco(pedido.cliente) ?? "Cliente sem endereço cadastrado"} />
                            )}
                        </dl>
                    </Section>

                    <Section title="Itens">
                        <ul className="flex flex-col gap-2">
                            {pedido.itens.map((item) => (
                                <li key={item.id} className="flex justify-between gap-4 text-sm">
                                    <span>
                                        {item.quantidade}× {item.cardapio.nome}
                                        <span className="text-muted-foreground"> · {formatCurrency(item.precoUnitario)} un.</span>
                                    </span>
                                    <span className="whitespace-nowrap font-medium">
                                        {formatCurrency(Number(item.precoUnitario) * item.quantidade)}
                                    </span>
                                </li>
                            ))}
                        </ul>
                        <dl className="flex flex-col gap-1 border-t border-border pt-3 text-sm">
                            <Row label="Itens" value={formatCents(subtotal)} />
                            <Row label="Taxa de entrega" value={`+ ${formatCurrency(pedido.taxaEntrega)}`} />
                            <Row label="Desconto" value={`− ${formatCurrency(pedido.desconto)}`} />
                            <div className="mt-1 flex justify-between border-t border-border pt-2 text-base font-semibold">
                                <dt>Total</dt>
                                <dd>{formatCurrency(pedido.valorTotal)}</dd>
                            </div>
                        </dl>
                    </Section>

                    {pedido.status !== "CANCELADO" && <PagamentoSection pedidoId={pedido.id} />}

                    {pedido.obs && (
                        <Section title="Observação">
                            <p className="text-sm">{pedido.obs}</p>
                        </Section>
                    )}

                    {editando && (
                        <ModalEditarPedido pedido={pedido} open={editando} onClose={() => setEditando(false)} />
                    )}
                </>
            )}
        </div>
    )
}
