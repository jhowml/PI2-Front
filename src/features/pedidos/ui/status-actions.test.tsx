import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import { StatusActions } from "./status-actions"
import type { Pedido } from "../types"

vi.mock("../hooks/use-update-pedido-status", () => ({
    useUpdatePedidoStatus: () => ({ update: vi.fn(), loading: false }),
}))

const pedido = { id: 1, status: "CONFIRMADO" } as Pedido

describe("StatusActions", () => {
    it("should allow cancelling when there is no pagamento registered yet", () => {
        render(<StatusActions pedido={pedido} pagamentoPago={false} />)

        expect(screen.getByRole("button", { name: "Cancelar pedido" })).toBeEnabled()
    })

    it("should disable cancelling and explain why when the pagamento is PAGO", () => {
        render(<StatusActions pedido={pedido} pagamentoPago />)

        expect(screen.getByRole("button", { name: "Cancelar pedido" })).toBeDisabled()
        expect(screen.getByRole("note")).toHaveTextContent(/estorne/i)
    })

    it("should still allow advancing the status (iniciar preparo) even when the pagamento is PAGO", () => {
        render(<StatusActions pedido={pedido} pagamentoPago />)

        expect(screen.getByRole("button", { name: "Iniciar preparo" })).toBeEnabled()
    })
})
