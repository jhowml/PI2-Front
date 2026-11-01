import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { ModalEditarPedido } from "./modal-editar-pedido"
import type { Pedido } from "../types"

vi.mock("@/features/cardapio/hooks/use-cardapio", () => ({
    useCardapio: () => ({
        itens: [
            { id: 1, nome: "Picanha na chapa", descricao: null, preco: "82.90", categoria: "Pratos", disponivel: true, createdAt: "", deletedAt: null },
        ],
        meta: null,
        loading: false,
        error: null,
    }),
}))

vi.mock("../hooks/use-update-pedido", () => ({
    useUpdatePedido: () => ({ update: vi.fn(), loading: false }),
}))

const pedido: Pedido = {
    id: 1,
    dataPedido: "2026-10-01T12:00:00.000Z",
    status: "CONFIRMADO",
    tipoEntrega: "ENTREGA",
    taxaEntrega: "8.00",
    desconto: "0",
    valorTotal: "90.90",
    obs: null,
    clienteId: 1,
    cliente: {
        id: 1, nome: "Maria Aparecida", telefone: "13991234567", obs: null,
        cep: null, logradouro: null, numero: null, complemento: null, bairro: null, cidade: null, uf: null,
        createdAt: "2026-01-01T00:00:00.000Z",
    },
    itens: [
        {
            id: 1, quantidade: 1, precoUnitario: "82.90", pedidoId: 1, cardapioId: 1,
            cardapio: { id: 1, nome: "Picanha na chapa", descricao: null, preco: "82.90", categoria: "Pratos", disponivel: true, createdAt: "", deletedAt: null },
        },
    ],
}

describe("ModalEditarPedido", () => {
    it("should pre-fill the taxaEntrega field with the pedido's current value when it is ENTREGA", () => {
        render(<ModalEditarPedido pedido={pedido} open onClose={vi.fn()} />)

        const taxaInput = screen.getByLabelText("Taxa de entrega (R$)") as HTMLInputElement

        expect(taxaInput.value).toBe("8,00")
        expect(taxaInput).not.toBeDisabled()
    })

    it("should pre-fill desconto and preco-like money fields in pt-BR comma format, not the raw API decimal", () => {
        render(<ModalEditarPedido pedido={pedido} open onClose={vi.fn()} />)

        expect((screen.getByLabelText("Desconto (R$)") as HTMLInputElement).value).toBe("0,00")
    })

    it("should show the full valorTotal (itens + taxaEntrega) in the save button", () => {
        render(<ModalEditarPedido pedido={pedido} open onClose={vi.fn()} />)

        expect(screen.getByRole("button", { name: /salvar alterações/i })).toHaveTextContent("R$ 90,90")
    })

    it("should keep taxaEntrega untouched when the user never switches tipoEntrega", async () => {
        const user = userEvent.setup()
        render(<ModalEditarPedido pedido={pedido} open onClose={vi.fn()} />)

        // toca em outro campo (ex.: observação), sem nunca clicar nos rádios de tipo de entrega
        await user.click(screen.getByLabelText("Observação"))
        await user.type(screen.getByLabelText("Observação"), "x")

        const taxaInput = screen.getByLabelText("Taxa de entrega (R$)") as HTMLInputElement
        expect(taxaInput.value).not.toBe("")
        expect(screen.getByRole("button", { name: /salvar alterações/i })).toHaveTextContent("R$ 90,90")
    })

    it("should clear taxaEntrega only when the user actively switches to RETIRADA", async () => {
        const user = userEvent.setup()
        render(<ModalEditarPedido pedido={pedido} open onClose={vi.fn()} />)

        await user.click(screen.getByRole("radio", { name: "Retirada no balcão" }))

        const taxaInput = screen.getByLabelText("Taxa de entrega (R$)") as HTMLInputElement
        expect(taxaInput.value).toBe("")
        expect(taxaInput).toBeDisabled()
    })
})
