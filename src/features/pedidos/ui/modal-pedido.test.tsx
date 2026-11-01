import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { ModalPedido } from "./modal-pedido"

vi.mock("@/shared/hooks/use-debounce", () => ({
    useDebounce: (value: string) => value,
}))

const clientes = [
    {
        id: 1, nome: "Beatriz Souza", telefone: "13991112222", obs: null,
        cep: null, logradouro: "Rua B", numero: "20", complemento: null, bairro: "Pitangueiras", cidade: "Guarujá", uf: "SP",
        createdAt: "2026-01-01T00:00:00.000Z",
    },
]

vi.mock("@/features/clientes/hooks/use-clientes", () => ({
    useClientes: () => ({ clientes, loading: false, stale: false }),
}))

vi.mock("@/features/clientes/hooks/use-create-cliente", () => ({
    useCreateCliente: () => ({ create: vi.fn(), loading: false }),
}))

vi.mock("@/features/cardapio/hooks/use-cardapio", () => ({
    useCardapio: () => ({
        itens: [{ id: 1, nome: "Picanha na chapa", preco: "59.90", disponivel: true }],
        loading: false,
    }),
}))

vi.mock("../hooks/use-create-pedido", () => ({
    useCreatePedido: () => ({ create: vi.fn(), loading: false }),
}))

describe("ModalPedido", () => {
    it("should focus the visible cliente search field on submit when no cliente was selected", async () => {
        render(<ModalPedido open onClose={vi.fn()} />)

        await userEvent.click(screen.getByRole("button", { name: /Registrar pedido/ }))

        expect(await screen.findByText("Selecione o cliente")).toBeInTheDocument()
        expect(screen.getByLabelText("Buscar por telefone ou endereço")).toHaveFocus()
    })

    it("should focus the Controller-wrapped quantidade field when it is the only field that fails validation on submit", async () => {
        render(<ModalPedido open onClose={vi.fn()} />)

        await userEvent.type(screen.getByLabelText("Buscar por telefone ou endereço"), "13")
        await userEvent.click(screen.getByText("Beatriz Souza"))
        await userEvent.selectOptions(screen.getByLabelText("Item 1"), "1")
        const quantidadeInput = screen.getByLabelText("Quantidade do item 1")
        await userEvent.clear(quantidadeInput)

        await userEvent.click(screen.getByRole("button", { name: /Registrar pedido/ }))

        expect(await screen.findByText("Informe a quantidade")).toBeInTheDocument()
        expect(quantidadeInput).toHaveFocus()
    })
})
