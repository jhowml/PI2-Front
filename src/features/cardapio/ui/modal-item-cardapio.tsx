"use client"

import { useId } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Modal } from "@/shared/components/ui/modal"
import { FormField } from "@/shared/components/ui/form-field"
import { Input, TextArea } from "@/shared/components/ui/input"
import { Button } from "@/components"
import { moneyToNumber, toMoneyInput } from "@/shared/lib/money"
import { useCreateItemCardapio } from "../hooks/use-create-item-cardapio"
import { useUpdateItemCardapio } from "../hooks/use-update-item-cardapio"
import { itemCardapioSchema, ItemCardapioFormData } from "../schema"
import type { ItemCardapio } from "../types"

const CATEGORIAS_SUGERIDAS = ["Pratos", "Porções", "Lanches", "Bebidas", "Sobremesas"]

const DEFAULT_VALUES: ItemCardapioFormData = { nome: "", descricao: "", preco: "", categoria: "", disponivel: true }

function toFormValues(item: ItemCardapio): ItemCardapioFormData {
    return {
        nome: item.nome,
        descricao: item.descricao ?? "",
        preco: toMoneyInput(item.preco),
        categoria: item.categoria,
        disponivel: item.disponivel,
    }
}

interface ModalItemCardapioProps {
    open: boolean
    onClose: () => void
    item?: ItemCardapio
}

export function ModalItemCardapio({ open, onClose, item }: ModalItemCardapioProps) {
    const formId = useId()
    const categoriasListId = useId()
    const { create, loading: creating } = useCreateItemCardapio()
    const { update, loading: updating } = useUpdateItemCardapio(item?.id ?? 0)
    const loading = item ? updating : creating

    const { register, handleSubmit, reset, formState: { errors } } = useForm<ItemCardapioFormData>({
        resolver: zodResolver(itemCardapioSchema),
        defaultValues: item ? toFormValues(item) : DEFAULT_VALUES,
    })

    function handleClose() {
        reset(item ? toFormValues(item) : DEFAULT_VALUES)
        onClose()
    }

    async function onSubmit(data: ItemCardapioFormData) {
        try {
            const payload = {
                nome: data.nome,
                descricao: data.descricao || undefined,
                preco: moneyToNumber(data.preco),
                categoria: data.categoria,
                disponivel: data.disponivel,
            }
            if (item) await update(payload)
            else await create(payload)
            handleClose()
        } catch {
            // error toast already shown by the hook
        }
    }

    return (
        <Modal
            title={item ? "Editar item do cardápio" : "Novo item do cardápio"}
            open={open}
            onClose={handleClose}
            footer={<Button label={loading ? "Salvando..." : "Salvar"} className="w-full" type="submit" form={formId} disabled={loading} />}
        >
            <form id={formId} onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
                <FormField label="Nome" required error={errors.nome?.message}>
                    <Input {...register("nome")} placeholder="Ex.: Picanha na chapa" maxLength={100} />
                </FormField>
                <div className="grid gap-4 sm:grid-cols-2">
                    <FormField label="Preço (R$)" required error={errors.preco?.message}>
                        <Input {...register("preco")} inputMode="decimal" placeholder="Ex.: 34,90" />
                    </FormField>
                    <FormField label="Categoria" required error={errors.categoria?.message}>
                        <Input {...register("categoria")} list={categoriasListId} placeholder="Ex.: Pratos" maxLength={50} />
                    </FormField>
                </div>
                <datalist id={categoriasListId}>
                    {CATEGORIAS_SUGERIDAS.map((categoria) => <option key={categoria} value={categoria} />)}
                </datalist>
                <FormField label="Descrição" error={errors.descricao?.message}>
                    <TextArea {...register("descricao")} placeholder="Ex.: Acompanha arroz, farofa e vinagrete" maxLength={255} />
                </FormField>
                <label className="flex items-center gap-2 text-sm font-medium">
                    <input type="checkbox" {...register("disponivel")} className="size-4 accent-primary" />
                    Disponível para venda
                </label>
            </form>
        </Modal>
    )
}
