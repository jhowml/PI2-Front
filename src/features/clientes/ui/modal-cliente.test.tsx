import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import { ModalCliente } from "./modal-cliente"
import type { Cliente } from "../types"

vi.mock("../hooks/use-create-cliente", () => ({
    useCreateCliente: () => ({ create: vi.fn(), loading: false }),
}))

vi.mock("../hooks/use-update-cliente", () => ({
    useUpdateCliente: () => ({ update: vi.fn(), loading: false }),
}))

const cliente: Cliente = {
    id: 1, nome: "Carlos Eduardo Lima", telefone: "13997654321", obs: null,
    cep: null, logradouro: null, numero: null, complemento: null, bairro: null, cidade: null, uf: null,
    createdAt: "2026-01-01T00:00:00.000Z",
}

describe("ModalCliente (editar)", () => {
    it("should pre-fill telefone with the (DD) 9XXXX-XXXX mask, not the raw digits", () => {
        render(<ModalCliente open cliente={cliente} onClose={vi.fn()} />)

        expect(screen.getByLabelText(/Telefone/)).toHaveValue("(13) 99765-4321")
    })
})
