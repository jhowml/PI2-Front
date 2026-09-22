"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Modal } from "@/shared/components/ui/modal"
import { FormField } from "@/shared/components/ui/form-field"
import { Input, TextArea } from "@/shared/components/ui/input"
import { Button } from "@/components"
import { moneyToNumber } from "@/shared/lib/money"
import { useCreateItemCardapio } from "../hooks/use-create-item-cardapio"
import { itemCardapioSchema, ItemCardapioFormData } from "../schema"

const CATEGORIAS_SUGERIDAS = ["Pratos", "Porções", "Lanches", "Bebidas", "Sobremesas"]

const DEFAULT_VALUES: ItemCardapioFormData = { nome: "", descricao: "", preco: "", categoria: "", disponivel: true }

interface ModalItemCardapioProps {
    open: boolean
    onClose: () => void
}

export function ModalItemCardapio({ open, onClose }: ModalItemCardapioProps) {
    const { create, loading } = useCreateItemCardapio()
    const { register, handleSubmit, reset, formState: { errors } } = useForm<ItemCardapioFormData>({
        resolver: zodResolver(itemCardapioSchema),
        defaultValues: DEFAULT_VALUES,
    })

    function handleClose() {
        reset(DEFAULT_VALUES)
        onClose()
    }

    async function onSubmit(data: ItemCardapioFormData) {
        try {
            await create({
                nome: data.nome,
                descricao: data.descricao || undefined,
                preco: moneyToNumber(data.preco),
                categoria: data.categoria,
                disponivel: data.disponivel,
            })
            handleClose()
        } catch {
            // error toast already shown by the hook
        }
    }

    return (
        <Modal
            title="Novo item do cardápio"
            open={open}
            onClose={handleClose}
            footer={<Button label={loading ? "Salvando..." : "Salvar"} className="w-full" type="submit" form="form-item-cardapio" disabled={loading} />}
        >
            <form id="form-item-cardapio" onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
                <FormField label="Nome" required error={errors.nome?.message}>
                    <Input {...register("nome")} placeholder="Ex.: Picanha na chapa" maxLength={100} />
                </FormField>
                <div className="grid gap-4 sm:grid-cols-2">
                    <FormField label="Preço (R$)" required error={errors.preco?.message}>
                        <Input {...register("preco")} inputMode="decimal" placeholder="Ex.: 34,90" />
                    </FormField>
                    <FormField label="Categoria" required error={errors.categoria?.message}>
                        <Input {...register("categoria")} list="categorias-cardapio" placeholder="Ex.: Pratos" maxLength={50} />
                    </FormField>
                </div>
                <datalist id="categorias-cardapio">
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
