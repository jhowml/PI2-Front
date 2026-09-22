"use client"

import { useState } from "react"
import { ArrowLeft } from "lucide-react"
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Plus, Trash2 } from "lucide-react"
import { Modal } from "@/shared/components/ui/modal"
import { FormField } from "@/shared/components/ui/form-field"
import { Input, Select, TextArea } from "@/shared/components/ui/input"
import { Button } from "@/components"
import { formatCents, formatCurrency, formatPhone } from "@/shared/lib/format"
import { moneyToNumber } from "@/shared/lib/money"
import { cn } from "@/shared/lib/cn"
import type { Cliente } from "@/features/clientes"
import { useCreateCliente } from "@/features/clientes/hooks/use-create-cliente"
import type { CreateClientePayload } from "@/features/clientes/services"
import { ClienteForm } from "@/features/clientes/ui/cliente-form"
import { useCardapio } from "@/features/cardapio/hooks/use-cardapio"
import { useCreatePedido } from "../hooks/use-create-pedido"
import { pedidoSchema, PedidoFormData } from "../schema"
import { calculatePedidoTotals } from "../totals"
import { TIPO_ENTREGA_LABELS, TIPOS_ENTREGA } from "../types"
import { ClienteSelector } from "./cliente-selector"

const DEFAULT_VALUES: PedidoFormData = {
    clienteId: "",
    tipoEntrega: "ENTREGA",
    taxaEntrega: "",
    desconto: "",
    obs: "",
    itens: [{ cardapioId: "", quantidade: 1 }],
}

interface ModalPedidoProps {
    open: boolean
    onClose: () => void
}

export function ModalPedido({ open, onClose }: ModalPedidoProps) {
    const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null)
    const [novoCliente, setNovoCliente] = useState<{ telefone: string } | null>(null)
    const { create: createCliente, loading: savingCliente } = useCreateCliente()
    const { itens: cardapio } = useCardapio({ pageSize: 100 })
    const disponiveis = cardapio.filter((item) => item.disponivel)
    const { create, loading } = useCreatePedido()

    const { register, control, handleSubmit, reset, setValue, formState: { errors } } = useForm<PedidoFormData>({
        resolver: zodResolver(pedidoSchema),
        defaultValues: DEFAULT_VALUES,
    })
    const { fields, append, remove } = useFieldArray({ control, name: "itens" })
    const [itensForm, tipoEntrega, taxaEntrega, desconto] = useWatch({
        control,
        name: ["itens", "tipoEntrega", "taxaEntrega", "desconto"],
    })

    const precoById = new Map(cardapio.map((item) => [String(item.id), item.preco]))
    const totals = calculatePedidoTotals(
        (itensForm ?? [])
            .filter((item) => precoById.has(item.cardapioId) && Number.isInteger(item.quantidade) && item.quantidade > 0)
            .map((item) => ({ quantidade: item.quantidade, precoUnitario: precoById.get(item.cardapioId)! })),
        tipoEntrega === "RETIRADA" ? "0" : taxaEntrega,
        desconto,
    )
    const totalNegativo = totals.totalCents < 0

    function handleClose() {
        reset(DEFAULT_VALUES)
        setSelectedCliente(null)
        setNovoCliente(null)
        onClose()
    }

    function selectCliente(cliente: Cliente | null) {
        setSelectedCliente(cliente)
        setValue("clienteId", cliente ? String(cliente.id) : "", { shouldValidate: cliente !== null })
    }

    function startNovoCliente(search: string) {
        const digits = search.replace(/\D/g, "")
        setNovoCliente({ telefone: digits.length >= 10 && digits.length === search.replace(/[\s()-]/g, "").length ? formatPhone(digits) : "" })
    }

    async function saveNovoCliente(payload: CreateClientePayload) {
        try {
            const cliente = await createCliente(payload)
            selectCliente(cliente)
            setNovoCliente(null)
        } catch {
            // error toast already shown by the hook
        }
    }

    async function onSubmit(data: PedidoFormData) {
        if (totalNegativo) return
        try {
            await create({
                clienteId: Number(data.clienteId),
                tipoEntrega: data.tipoEntrega,
                taxaEntrega: data.tipoEntrega === "RETIRADA" ? 0 : moneyToNumber(data.taxaEntrega),
                desconto: moneyToNumber(data.desconto),
                obs: data.obs || undefined,
                itens: data.itens.map((item) => ({ cardapioId: Number(item.cardapioId), quantidade: item.quantidade })),
            })
            handleClose()
        } catch {
            // error toast already shown by the hook
        }
    }

    return (
        <Modal
            title="Novo pedido"
            open={open}
            onClose={handleClose}
            footer={
                novoCliente ? (
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={() => setNovoCliente(null)}
                            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-md border border-border bg-card px-4 py-2 text-sm font-medium transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                            <ArrowLeft className="size-4" aria-hidden="true" /> Voltar ao pedido
                        </button>
                        <Button
                            label={savingCliente ? "Salvando..." : "Salvar cliente e continuar"}
                            className="flex-1"
                            type="submit"
                            form="form-novo-cliente-pedido"
                            disabled={savingCliente}
                        />
                    </div>
                ) : (
                    <Button
                        label={loading ? "Registrando..." : `Registrar pedido · ${formatCents(Math.max(totals.totalCents, 0))}`}
                        className="w-full"
                        type="submit"
                        form="form-pedido"
                        disabled={loading || totalNegativo}
                    />
                )
            }
        >
            {novoCliente && (
                <section aria-labelledby="titulo-novo-cliente" className="flex flex-col gap-3">
                    <div className="rounded-md bg-accent px-3 py-2 text-sm text-accent-foreground">
                        <h3 id="titulo-novo-cliente" className="font-semibold">Cadastrar novo cliente</h3>
                        <p>Os itens do pedido ficam guardados. Ao salvar, o cliente já volta selecionado.</p>
                    </div>
                    <ClienteForm
                        formId="form-novo-cliente-pedido"
                        initialValues={{ telefone: novoCliente.telefone }}
                        autoFocus
                        onSubmit={saveNovoCliente}
                    />
                </section>
            )}
            <form id="form-pedido" hidden={novoCliente !== null} onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
                <ClienteSelector
                    selected={selectedCliente}
                    tipoEntrega={tipoEntrega}
                    error={errors.clienteId?.message}
                    onSelect={selectCliente}
                    onRequestNew={startNovoCliente}
                />
                <input type="hidden" {...register("clienteId")} />

                <fieldset className="flex flex-col gap-2">
                    <legend className="mb-1 text-sm font-semibold">Tipo de entrega <span aria-hidden="true" className="text-primary">*</span></legend>
                    <div className="grid grid-cols-2 gap-2">
                        {TIPOS_ENTREGA.map((tipo) => (
                            <label
                                key={tipo}
                                className={cn(
                                    "flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring",
                                    tipoEntrega === tipo ? "border-primary bg-primary/5 text-primary" : "border-border bg-card",
                                )}
                            >
                                <input
                                    type="radio"
                                    value={tipo}
                                    className="accent-primary"
                                    {...register("tipoEntrega", {
                                        onChange: (e) => {
                                            if (e.target.value === "RETIRADA") setValue("taxaEntrega", "", { shouldValidate: true })
                                        },
                                    })}
                                />
                                {TIPO_ENTREGA_LABELS[tipo]}
                            </label>
                        ))}
                    </div>
                </fieldset>

                <fieldset className="flex flex-col gap-3">
                    <legend className="mb-1 text-sm font-semibold">Itens <span aria-hidden="true" className="text-primary">*</span></legend>
                    {errors.itens?.root?.message && <p role="alert" className="text-xs font-medium text-destructive">{errors.itens.root.message}</p>}
                    {errors.itens?.message && <p role="alert" className="text-xs font-medium text-destructive">{errors.itens.message}</p>}
                    {fields.map((field, index) => (
                        <div key={field.id} className="flex items-start gap-2">
                            <div className="flex-1">
                                <FormField label={`Item ${index + 1}`} hideLabel error={errors.itens?.[index]?.cardapioId?.message}>
                                    <Select {...register(`itens.${index}.cardapioId`)}>
                                        <option value="">Selecione um item do cardápio</option>
                                        {disponiveis.map((item) => (
                                            <option key={item.id} value={item.id}>
                                                {item.nome} · {formatCurrency(item.preco)}
                                            </option>
                                        ))}
                                    </Select>
                                </FormField>
                            </div>
                            <div className="w-20">
                                <Controller
                                    control={control}
                                    name={`itens.${index}.quantidade`}
                                    render={({ field: quantidade }) => (
                                        <FormField label={`Quantidade do item ${index + 1}`} hideLabel error={errors.itens?.[index]?.quantidade?.message}>
                                            <Input
                                                type="number"
                                                min={1}
                                                max={999}
                                                inputMode="numeric"
                                                name={quantidade.name}
                                                ref={quantidade.ref}
                                                onBlur={quantidade.onBlur}
                                                value={Number.isNaN(quantidade.value) ? "" : quantidade.value}
                                                onChange={(e) => quantidade.onChange(e.target.valueAsNumber)}
                                            />
                                        </FormField>
                                    )}
                                />
                            </div>
                            <Button
                                variant="icon"
                                icon={Trash2}
                                label={`Remover item ${index + 1}`}
                                iconClassName="text-destructive"
                                disabled={fields.length === 1}
                                onClick={() => remove(index)}
                            />
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={() => append({ cardapioId: "", quantidade: 1 })}
                        className="inline-flex w-fit items-center gap-1 rounded-md text-sm font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                        <Plus className="size-4" aria-hidden="true" /> Adicionar item
                    </button>
                </fieldset>

                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        label="Taxa de entrega (R$)"
                        error={errors.taxaEntrega?.message}
                        hint={tipoEntrega === "RETIRADA" ? "Retirada não tem taxa." : undefined}
                    >
                        <Input {...register("taxaEntrega")} inputMode="decimal" placeholder="0,00" disabled={tipoEntrega === "RETIRADA"} />
                    </FormField>
                    <FormField label="Desconto (R$)" error={errors.desconto?.message}>
                        <Input {...register("desconto")} inputMode="decimal" placeholder="0,00" />
                    </FormField>
                </div>

                <FormField label="Observação" error={errors.obs?.message}>
                    <TextArea {...register("obs")} maxLength={255} placeholder="Ex.: Sem cebola" />
                </FormField>

                <section aria-labelledby="resumo-pedido" className="rounded-lg border border-border bg-muted p-4">
                    <h3 id="resumo-pedido" className="mb-2 text-sm font-semibold">Resumo (prévia)</h3>
                    <dl className="flex flex-col gap-1 text-sm" aria-live="polite">
                        <div className="flex justify-between"><dt>Itens</dt><dd>{formatCents(totals.subtotalCents)}</dd></div>
                        <div className="flex justify-between"><dt>Taxa de entrega</dt><dd>+ {formatCents(totals.taxaEntregaCents)}</dd></div>
                        <div className="flex justify-between"><dt>Desconto</dt><dd>− {formatCents(totals.descontoCents)}</dd></div>
                        <div className="mt-1 flex justify-between border-t border-border pt-2 text-base font-semibold">
                            <dt>Total</dt><dd>{formatCents(totals.totalCents)}</dd>
                        </div>
                    </dl>
                    {totalNegativo && (
                        <p role="alert" className="mt-2 text-xs font-medium text-destructive">
                            O desconto não pode ser maior que os itens somados à taxa de entrega.
                        </p>
                    )}
                    <p className="mt-2 text-xs text-muted-foreground">O valor final é calculado pela API com o preço atual do cardápio.</p>
                </section>
            </form>
        </Modal>
    )
}
