"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { CardList, ListPageLayout } from "@/components"
import { FormField } from "@/shared/components/ui/form-field"
import { Input } from "@/shared/components/ui/input"
import { Pagination } from "@/shared/components/ui/pagination"
import { useDebounce } from "@/shared/hooks/use-debounce"
import { formatCurrency } from "@/shared/lib/format"
import { useCardapio } from "../hooks/use-cardapio"
import type { ItemCardapio } from "../types"
import { ModalItemCardapio } from "./modal-item-cardapio"

function ItemCardapioRow({ item }: { item: ItemCardapio }) {
    return (
        <div className="flex w-full items-start gap-4 bg-card px-4 py-4 md:px-6">
            <div className="flex min-w-0 flex-1 flex-col">
                <span className="text-base font-medium text-foreground">{item.nome}</span>
                <span className="text-sm text-muted-foreground">{item.categoria}</span>
                {item.descricao && <span className="mt-1 line-clamp-2 text-sm text-muted-foreground">{item.descricao}</span>}
            </div>
            <div className="flex shrink-0 flex-col items-end gap-1">
                <span className="font-semibold text-foreground">{formatCurrency(item.preco)}</span>
                {item.disponivel ? (
                    <span className="rounded-full bg-success/10 px-2.5 py-0.5 text-xs font-semibold text-success">Disponível</span>
                ) : (
                    <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">Indisponível</span>
                )}
            </div>
        </div>
    )
}

export function CardapioView() {
    const [modalOpen, setModalOpen] = useState(false)
    const [search, setSearch] = useState("")
    const [page, setPage] = useState(1)
    const debouncedSearch = useDebounce(search)
    const { itens, meta, loading, error } = useCardapio({ page, search: debouncedSearch || undefined })

    return (
        <>
            <ModalItemCardapio open={modalOpen} onClose={() => setModalOpen(false)} />
            <ListPageLayout
                title="Cardápio"
                description="Itens vendidos pelo estabelecimento. Itens indisponíveis não podem ser adicionados a pedidos."
                headerAction={{ label: "Novo item", icon: Plus, onClick: () => setModalOpen(true) }}
            >
                <FormField label="Buscar no cardápio" hideLabel>
                    <Input
                        type="search"
                        placeholder="Buscar por nome..."
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value)
                            setPage(1)
                        }}
                    />
                </FormField>
                <CardList
                    items={itens}
                    getKey={(item) => item.id}
                    empty={
                        <p className="text-base font-medium text-muted-foreground" role="status">
                            {loading ? "Carregando..." : error ?? "Nenhum item encontrado"}
                        </p>
                    }
                    renderItem={(item) => <ItemCardapioRow item={item} />}
                />
                <Pagination meta={meta} onPageChange={setPage} />
            </ListPageLayout>
        </>
    )
}
