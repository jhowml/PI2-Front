import { describe, expect, it } from "vitest"
import { calculatePedidoTotals } from "./totals"

describe("calculatePedidoTotals", () => {
    it("applies itens + taxaEntrega − desconto (2 × 15,00 + 1 × 6,00 + 5,00 − 2,00 = 39,00)", () => {
        const totals = calculatePedidoTotals(
            [
                { quantidade: 2, precoUnitario: "15.00" },
                { quantidade: 1, precoUnitario: "6" },
            ],
            "5,00",
            "2,00",
        )

        expect(totals).toEqual({ subtotalCents: 3600, taxaEntregaCents: 500, descontoCents: 200, totalCents: 3900 })
    })

    it("keeps cents exact (0,10 + 0,20 = 0,30)", () => {
        const totals = calculatePedidoTotals(
            [
                { quantidade: 1, precoUnitario: "0.1" },
                { quantidade: 1, precoUnitario: "0.2" },
            ],
            "",
            "",
        )

        expect(totals.totalCents).toBe(30)
    })

    it("reports a negative total when the desconto is too high", () => {
        const totals = calculatePedidoTotals([{ quantidade: 1, precoUnitario: "10" }], "0", "10,01")

        expect(totals.totalCents).toBe(-1)
    })
})
