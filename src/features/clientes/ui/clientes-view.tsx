"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronRight, Plus } from "lucide-react"
import { CardList, ListPageLayout } from "@/components"
import { FormField } from "@/shared/components/ui/form-field"
import { Input } from "@/shared/components/ui/input"
import { Pagination } from "@/shared/components/ui/pagination"
import { useDebounce } from "@/shared/hooks/use-debounce"
import { formatPhone } from "@/shared/lib/format"
import { useClientes } from "../hooks/use-clientes"
import { formatEndereco } from "../utils"
import { ModalCliente } from "./modal-cliente"

export function ClientesView() {
    const [modalOpen, setModalOpen] = useState(false)
    const [search, setSearch] = useState("")
    const [page, setPage] = useState(1)
    const debouncedSearch = useDebounce(search)
    const { clientes, meta, loading, error } = useClientes({ page, search: debouncedSearch || undefined })

    return (
        <>
            <ModalCliente open={modalOpen} onClose={() => setModalOpen(false)} />
            <ListPageLayout
                title="Clientes"
                description="Cadastro de clientes com endereço para entrega."
                headerAction={{ label: "Novo cliente", icon: Plus, onClick: () => setModalOpen(true) }}
            >
                <FormField label="Buscar clientes" hideLabel>
                    <Input
                        type="search"
                        placeholder="Buscar por telefone, endereço ou nome..."
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value)
                            setPage(1)
                        }}
                    />
                </FormField>
                <CardList
                    items={clientes}
                    getKey={(cliente) => cliente.id}
                    empty={
                        <p className="text-base font-medium text-muted-foreground" role="status">
                            {loading ? "Carregando..." : error ?? "Nenhum cliente encontrado"}
                        </p>
                    }
                    renderItem={(cliente) => (
                        <Link
                            href={`/clientes/${cliente.id}`}
                            className="flex items-center gap-4 bg-card px-4 py-4 transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring md:px-6"
                        >
                            <span className="flex min-w-0 flex-1 flex-col">
                                <span className="text-base font-medium text-foreground">{cliente.nome}</span>
                                <span className="text-sm text-muted-foreground">{formatPhone(cliente.telefone)}</span>
                                <span className="truncate text-sm text-muted-foreground">
                                    {formatEndereco(cliente) ?? "Sem endereço (retirada)"}
                                </span>
                            </span>
                            <ChevronRight className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                        </Link>
                    )}
                />
                <Pagination meta={meta} onPageChange={setPage} />
            </ListPageLayout>
        </>
    )
}
