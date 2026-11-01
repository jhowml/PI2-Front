import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import { ModalItemCardapio } from "./modal-item-cardapio"
import type { ItemCardapio } from "../types"

vi.mock("../hooks/use-create-item-cardapio", () => ({
    useCreateItemCardapio: () => ({ create: vi.fn(), loading: false }),
}))

vi.mock("../hooks/use-update-item-cardapio", () => ({
    useUpdateItemCardapio: () => ({ update: vi.fn(), loading: false }),
}))

const item: ItemCardapio = {
    id: 1, nome: "Frango grelhado", descricao: "Com arroz e feijão", preco: "69.9",
    categoria: "Pratos", disponivel: true, createdAt: "2026-01-01T00:00:00.000Z", deletedAt: null,
}

describe("ModalItemCardapio", () => {
    it("should pre-fill preco in pt-BR comma format, not the raw API decimal", () => {
        render(<ModalItemCardapio item={item} open onClose={vi.fn()} />)

        expect(screen.getByLabelText(/Preço \(R\$\)/)).toHaveValue("69,90")
    })
})
