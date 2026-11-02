"use client"

import { useState } from "react"
import { Button } from "@/components"
import { Section, Row } from "@/shared/components/ui/section"
import { FormField } from "@/shared/components/ui/form-field"
import { Select } from "@/shared/components/ui/input"
import { formatCurrency, formatDateTime } from "@/shared/lib/format"
import { usePagamento } from "../hooks/use-pagamento"
import { useCreatePagamento } from "../hooks/use-create-pagamento"
import { useUpdatePagamentoStatus } from "../hooks/use-update-pagamento-status"
import { useUpdatePagamentoForma } from "../hooks/use-update-pagamento-forma"
import { FORMAS_PAGAMENTO, FORMA_PAGAMENTO_LABELS, STATUS_PAGAMENTO_LABELS, type FormaPagamento } from "../types"

export function PagamentoSection({ pedidoId }: { pedidoId: number }) {
    const { pagamento, loading } = usePagamento(pedidoId)
    const { create, loading: creating } = useCreatePagamento()
    const { update: updateStatus, loading: updatingStatus } = useUpdatePagamentoStatus(pedidoId)
    const { update: updateForma, loading: updatingForma } = useUpdatePagamentoForma(pedidoId)
    const [forma, setForma] = useState<FormaPagamento>("PIX")

    if (loading) return null

    return (
        <Section title="Pagamento">
            {pagamento ? (
                <div className="flex flex-col gap-3">
                    <dl className="flex flex-col gap-3">
                        <Row
                            label="Forma"
                            value={
                                <Select
                                    value={pagamento.forma}
                                    onChange={(event) => updateForma(event.target.value as FormaPagamento)}
                                    disabled={updatingForma}
                                    aria-label="Forma de pagamento"
                                    className="h-8 w-44 py-1 text-right"
                                >
                                    {FORMAS_PAGAMENTO.map((value) => (
                                        <option key={value} value={value}>
                                            {FORMA_PAGAMENTO_LABELS[value]}
                                        </option>
                                    ))}
                                </Select>
                            }
                        />
                        <Row label="Status" value={STATUS_PAGAMENTO_LABELS[pagamento.status]} />
                        <Row label="Valor" value={formatCurrency(pagamento.valor)} />
                        {pagamento.dataPagamento && <Row label="Pago em" value={formatDateTime(pagamento.dataPagamento)} />}
                    </dl>
                    {pagamento.status === "PENDENTE" && (
                        <Button
                            label="Marcar como pago"
                            onClick={() => updateStatus("PAGO")}
                            disabled={updatingStatus}
                            className="self-start"
                        />
                    )}
                    {pagamento.status === "PAGO" && (
                        <Button
                            label="Marcar como estornado"
                            onClick={() => updateStatus("ESTORNADO")}
                            disabled={updatingStatus}
                            className="self-start bg-transparent text-destructive ring-1 ring-destructive/40 hover:bg-destructive/10"
                        />
                    )}
                    {pagamento.status === "ESTORNADO" && (
                        <Button
                            label="Desfazer estorno (marcar como pago)"
                            onClick={() => updateStatus("PAGO")}
                            disabled={updatingStatus}
                            className="self-start"
                        />
                    )}
                </div>
            ) : (
                <div className="flex flex-wrap items-end gap-3">
                    <FormField label="Forma de pagamento">
                        <Select
                            value={forma}
                            onChange={(event) => setForma(event.target.value as FormaPagamento)}
                            className="w-52"
                        >
                            {FORMAS_PAGAMENTO.map((value) => (
                                <option key={value} value={value}>
                                    {FORMA_PAGAMENTO_LABELS[value]}
                                </option>
                            ))}
                        </Select>
                    </FormField>
                    <Button
                        label="Registrar pagamento"
                        onClick={() => create({ pedidoId, forma })}
                        disabled={creating}
                    />
                </div>
            )}
        </Section>
    )
}
