"use client"

import { useCallback, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Search } from "lucide-react"
import { FormField } from "@/shared/components/ui/form-field"
import { Input, TextArea } from "@/shared/components/ui/input"
import { Button } from "@/components"
import { formatCep, formatPhone } from "@/shared/lib/format"
import { useCepLookup } from "@/features/cep/use-cep-lookup"
import type { Endereco } from "@/features/cep/types"
import type { CreateClientePayload } from "../services"
import { clienteSchema, ClienteFormData, ClienteFormInput } from "../schema"

export const EMPTY_CLIENTE_FORM: ClienteFormInput = {
    nome: "", telefone: "", obs: "", cep: "", logradouro: "", numero: "", complemento: "", bairro: "", cidade: "", uf: "",
}

const emptyToUndefined = (value: string) => (value === "" ? undefined : value)

function toPayload(data: ClienteFormData): CreateClientePayload {
    return {
        nome: data.nome,
        telefone: data.telefone,
        obs: emptyToUndefined(data.obs),
        cep: emptyToUndefined(data.cep.replace("-", "")),
        logradouro: emptyToUndefined(data.logradouro),
        numero: emptyToUndefined(data.numero),
        complemento: emptyToUndefined(data.complemento),
        bairro: emptyToUndefined(data.bairro),
        cidade: emptyToUndefined(data.cidade),
        uf: emptyToUndefined(data.uf.toUpperCase()),
    }
}

interface ClienteFormProps {
    formId: string
    initialValues?: Partial<ClienteFormInput>
    autoFocus?: boolean
    onSubmit: (payload: CreateClientePayload) => Promise<void>
}

export function ClienteForm({ formId, initialValues, autoFocus, onSubmit }: ClienteFormProps) {
    const { register, handleSubmit, setValue, setFocus, getValues, formState: { errors } } = useForm<ClienteFormInput, unknown, ClienteFormData>({
        resolver: zodResolver(clienteSchema),
        defaultValues: { ...EMPTY_CLIENTE_FORM, ...initialValues },
    })

    useEffect(() => {
        if (autoFocus) setFocus("telefone")
    }, [autoFocus, setFocus])

    const fillEndereco = useCallback((endereco: Endereco) => {
        setValue("logradouro", endereco.logradouro, { shouldValidate: true })
        setValue("bairro", endereco.bairro, { shouldValidate: true })
        setValue("cidade", endereco.cidade, { shouldValidate: true })
        setValue("uf", endereco.uf, { shouldValidate: true })
        setFocus("numero")
    }, [setValue, setFocus])

    const { status: cepStatus, lookup } = useCepLookup(fillEndereco)

    function handleCepChange(value: string) {
        const masked = formatCep(value)
        setValue("cep", masked)
        if (masked.replace(/\D/g, "").length === 8) lookup(masked)
    }

    const cepField = register("cep")

    return (
        <form id={formId} onSubmit={handleSubmit((data) => onSubmit(toPayload(data)))} noValidate className="flex flex-col gap-4">
            <FormField label="Telefone / celular" required error={errors.telefone?.message}>
                <Input
                    {...register("telefone", { onChange: (e) => setValue("telefone", formatPhone(e.target.value)) })}
                    type="tel"
                    inputMode="numeric"
                    placeholder="(13) 99999-9999"
                    autoComplete="tel"
                />
            </FormField>

            <fieldset className="flex flex-col gap-4 rounded-lg border border-border p-4">
                <legend className="px-1 text-sm font-semibold">Endereço (opcional para retirada)</legend>
                <div className="flex items-end gap-2">
                    <div className="flex-1">
                        <FormField
                            label="CEP"
                            error={errors.cep?.message}
                            hint="Ao digitar os 8 dígitos, o endereço é preenchido automaticamente."
                        >
                            <Input
                                {...cepField}
                                onChange={(e) => handleCepChange(e.target.value)}
                                inputMode="numeric"
                                placeholder="11410-000"
                                autoComplete="postal-code"
                            />
                        </FormField>
                    </div>
                    <Button
                        variant="icon"
                        icon={Search}
                        label="Buscar endereço pelo CEP"
                        className="mb-6 border border-border"
                        disabled={cepStatus.state === "loading"}
                        onClick={() => lookup(getValues("cep"))}
                    />
                </div>
                <p aria-live="polite" className="-mt-2 min-h-4 text-xs">
                    {cepStatus.state === "loading" && <span className="text-muted-foreground">Buscando endereço...</span>}
                    {cepStatus.state === "found" && <span className="text-success">Endereço preenchido. Confira e informe o número.</span>}
                    {cepStatus.state === "error" && <span className="font-medium text-destructive">{cepStatus.message}</span>}
                </p>
                <FormField label="Logradouro" error={errors.logradouro?.message}>
                    <Input {...register("logradouro")} maxLength={150} autoComplete="address-line1" />
                </FormField>
                <div className="grid grid-cols-2 gap-4">
                    <FormField label="Número" error={errors.numero?.message}>
                        <Input {...register("numero")} maxLength={10} />
                    </FormField>
                    <FormField label="Complemento" error={errors.complemento?.message}>
                        <Input {...register("complemento")} maxLength={60} placeholder="Apto, bloco..." autoComplete="address-line2" />
                    </FormField>
                </div>
                <FormField label="Bairro" error={errors.bairro?.message}>
                    <Input {...register("bairro")} maxLength={80} />
                </FormField>
                <div className="grid grid-cols-[1fr_5rem] gap-4">
                    <FormField label="Cidade" error={errors.cidade?.message}>
                        <Input {...register("cidade")} maxLength={80} autoComplete="address-level2" />
                    </FormField>
                    <FormField label="UF" error={errors.uf?.message}>
                        <Input {...register("uf")} maxLength={2} className="uppercase" autoComplete="address-level1" />
                    </FormField>
                </div>
            </fieldset>

            <FormField label="Nome" required error={errors.nome?.message}>
                <Input {...register("nome")} placeholder="Ex.: Maria Aparecida Santos" maxLength={100} autoComplete="name" />
            </FormField>

            <FormField label="Observação" error={errors.obs?.message}>
                <TextArea {...register("obs")} maxLength={255} placeholder="Ex.: Interfone quebrado, ligar ao chegar" />
            </FormField>
        </form>
    )
}
