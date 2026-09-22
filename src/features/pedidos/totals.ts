import { moneyToCents } from "@/shared/lib/money"

export type TotalsItem = { quantidade: number; precoUnitario: string | number }

export type PedidoTotals = {
    subtotalCents: number
    taxaEntregaCents: number
    descontoCents: number
    totalCents: number
}

// Mirrors the API rule (Σ quantidade × precoUnitario + taxaEntrega − desconto) only for the
// on-screen preview; the persisted valorTotal is always the one computed by the API.
export function calculatePedidoTotals(
    itens: TotalsItem[],
    taxaEntrega: string | number,
    desconto: string | number,
): PedidoTotals {
    const subtotalCents = itens.reduce((total, item) => total + moneyToCents(item.precoUnitario) * item.quantidade, 0)
    const taxaEntregaCents = moneyToCents(taxaEntrega)
    const descontoCents = moneyToCents(desconto)
    return {
        subtotalCents,
        taxaEntregaCents,
        descontoCents,
        totalCents: subtotalCents + taxaEntregaCents - descontoCents,
    }
}
