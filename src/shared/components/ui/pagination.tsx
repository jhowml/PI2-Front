import { ChevronLeft, ChevronRight } from "lucide-react"
import type { PaginatedMeta } from "@/shared/types/pagination"

interface PaginationProps {
    meta: PaginatedMeta | null
    onPageChange: (page: number) => void
}

const BUTTON_CLASS =
    "inline-flex h-9 items-center gap-1 rounded-md border border-border bg-card px-3 text-sm font-medium transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"

export function Pagination({ meta, onPageChange }: PaginationProps) {
    if (!meta || meta.totalPages <= 1) return null

    return (
        <nav aria-label="Paginação" className="flex items-center justify-between gap-3">
            <button
                type="button"
                className={BUTTON_CLASS}
                disabled={!meta.hasPreviousPage}
                onClick={() => onPageChange(meta.page - 1)}
            >
                <ChevronLeft className="size-4" aria-hidden="true" /> Anterior
            </button>
            <span className="text-sm text-muted-foreground" aria-live="polite">
                Página {meta.page} de {meta.totalPages} · {meta.total} registros
            </span>
            <button
                type="button"
                className={BUTTON_CLASS}
                disabled={!meta.hasNextPage}
                onClick={() => onPageChange(meta.page + 1)}
            >
                Próxima <ChevronRight className="size-4" aria-hidden="true" />
            </button>
        </nav>
    )
}
