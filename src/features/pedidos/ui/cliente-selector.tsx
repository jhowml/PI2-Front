"use client"

import { useState } from "react"
import { MapPin, Phone, UserPlus } from "lucide-react"
import { FormField } from "@/shared/components/ui/form-field"
import { Input } from "@/shared/components/ui/input"
import { useDebounce } from "@/shared/hooks/use-debounce"
import { formatPhone } from "@/shared/lib/format"
import { cn } from "@/shared/lib/cn"
import { useClientes } from "@/features/clientes/hooks/use-clientes"
import { formatEndereco } from "@/features/clientes/utils"
import type { Cliente } from "@/features/clientes"
import type { TipoEntrega } from "../types"

const MIN_SEARCH_LENGTH = 2

interface ClienteSelectorProps {
    selected: Cliente | null
    tipoEntrega: TipoEntrega
    error?: string
    onSelect: (cliente: Cliente | null) => void
    onRequestNew: (search: string) => void
}

function ClienteSummary({ cliente }: { cliente: Cliente }) {
    return (
        <span className="flex min-w-0 flex-col gap-0.5 text-left">
            <span className="flex items-center gap-1.5 font-semibold text-foreground">
                <Phone className="size-3.5 shrink-0" aria-hidden="true" />
                {formatPhone(cliente.telefone)}
            </span>
            <span className="flex items-start gap-1.5 text-sm text-foreground">
                <MapPin className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
                {formatEndereco(cliente) ?? "Sem endereço cadastrado"}
            </span>
            <span className="text-sm text-muted-foreground">{cliente.nome}</span>
        </span>
    )
}

export function ClienteSelector({ selected, tipoEntrega, error, onSelect, onRequestNew }: ClienteSelectorProps) {
    const [search, setSearch] = useState("")
    const debouncedSearch = useDebounce(search.trim())
    const canSearch = debouncedSearch.length >= MIN_SEARCH_LENGTH
    const { clientes, loading: fetching, stale } = useClientes({ pageSize: 8, search: canSearch ? debouncedSearch : undefined })
    const loading = fetching || stale || search.trim() !== debouncedSearch
    const results = canSearch && !loading ? clientes : []

    if (selected) {
        return (
            <fieldset className="flex flex-col gap-2">
                <legend className="mb-1 text-sm font-semibold">Cliente</legend>
                <div className="flex items-start justify-between gap-3 rounded-lg border-2 border-primary bg-primary/5 p-3">
                    <ClienteSummary cliente={selected} />
                    <button
                        type="button"
                        onClick={() => onSelect(null)}
                        className="shrink-0 rounded-md px-2 py-1 text-sm font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                        Trocar cliente
                    </button>
                </div>
                {tipoEntrega === "ENTREGA" && !selected.logradouro && (
                    <p role="alert" className="text-xs font-medium text-destructive">
                        Este cliente não tem endereço cadastrado. Para entrega, confirme o endereço por telefone ou escolha retirada.
                    </p>
                )}
            </fieldset>
        )
    }

    return (
        <fieldset className="flex flex-col gap-3">
            <legend className="mb-1 text-sm font-semibold">
                Cliente <span aria-hidden="true" className="text-primary">*</span>
            </legend>
            <FormField
                label="Buscar por telefone ou endereço"
                error={error}
                hint="Ex.: 13 99123, dom pedro 350, enseada. Também encontra pelo nome."
            >
                <Input
                    type="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Telefone, rua, número ou bairro..."
                    autoComplete="off"
                />
            </FormField>

            {canSearch && (
                <div aria-live="polite" className="flex flex-col gap-2">
                    {loading && <p className="text-sm text-muted-foreground">Buscando clientes...</p>}
                    {!loading && results.length === 0 && (
                        <p className="text-sm text-muted-foreground">Nenhum cliente encontrado para “{debouncedSearch}”.</p>
                    )}
                    {results.length > 0 && (
                        <ul className="flex flex-col gap-2" aria-label="Clientes encontrados">
                            {results.map((cliente) => (
                                <li key={cliente.id}>
                                    <button
                                        type="button"
                                        onClick={() => onSelect(cliente)}
                                        className={cn(
                                            "flex w-full rounded-lg border border-border bg-card p-3 transition-colors hover:border-primary hover:bg-accent",
                                            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                                        )}
                                    >
                                        <span className="sr-only">Selecionar cliente: </span>
                                        <ClienteSummary cliente={cliente} />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}

            <button
                type="button"
                onClick={() => onRequestNew(search.trim())}
                className={cn(
                    "inline-flex w-fit items-center gap-1.5 rounded-md text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    canSearch && !loading && results.length === 0
                        ? "bg-primary px-3 py-2 text-primary-foreground hover:opacity-90"
                        : "text-primary hover:underline",
                )}
            >
                <UserPlus className="size-4" aria-hidden="true" />
                Cadastrar novo cliente
            </button>
        </fieldset>
    )
}
