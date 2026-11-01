import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { axe } from "vitest-axe"
import { ClienteSelector } from "./cliente-selector"
import type { Cliente } from "@/features/clientes"

vi.mock("@/shared/hooks/use-debounce", () => ({
    useDebounce: (value: string) => value,
}))

const clientes: Cliente[] = [
    {
        id: 1, nome: "Carlos Eduardo Lima", telefone: "13997654321", obs: null,
        cep: null, logradouro: "Rua A", numero: "10", complemento: null, bairro: "Centro", cidade: "Guarujá", uf: "SP",
        createdAt: "2026-01-01T00:00:00.000Z",
    },
    {
        id: 2, nome: "Beatriz Souza", telefone: "13991112222", obs: null,
        cep: null, logradouro: "Rua B", numero: "20", complemento: null, bairro: "Pitangueiras", cidade: "Guarujá", uf: "SP",
        createdAt: "2026-01-01T00:00:00.000Z",
    },
]

vi.mock("@/features/clientes/hooks/use-clientes", () => ({
    useClientes: () => ({ clientes, loading: false, stale: false }),
}))

function renderSelector() {
    const onSelect = vi.fn()
    const result = render(
        <ClienteSelector selected={null} tipoEntrega="RETIRADA" onSelect={onSelect} onRequestNew={vi.fn()} />,
    )
    return { onSelect, container: result.container }
}

describe("ClienteSelector (combobox)", () => {
    it("should expose combobox/listbox roles and open the listbox once there are results", async () => {
        renderSelector()
        const combobox = screen.getByRole("combobox")
        expect(combobox).toHaveAttribute("aria-expanded", "false")

        await userEvent.type(combobox, "13")

        expect(combobox).toHaveAttribute("aria-expanded", "true")
        const listbox = screen.getByRole("listbox")
        expect(combobox).toHaveAttribute("aria-controls", listbox.id)
        expect(screen.getAllByRole("option")).toHaveLength(2)
    })

    it("should move aria-activedescendant through the options with ArrowDown/ArrowUp", async () => {
        renderSelector()
        const combobox = screen.getByRole("combobox")
        await userEvent.type(combobox, "13")
        const [firstOption, secondOption] = screen.getAllByRole("option")

        await userEvent.keyboard("{ArrowDown}")
        expect(combobox).toHaveAttribute("aria-activedescendant", firstOption.id)

        await userEvent.keyboard("{ArrowDown}")
        expect(combobox).toHaveAttribute("aria-activedescendant", secondOption.id)

        await userEvent.keyboard("{ArrowUp}")
        expect(combobox).toHaveAttribute("aria-activedescendant", firstOption.id)
    })

    it("should select the active option on Enter", async () => {
        const { onSelect } = renderSelector()
        const combobox = screen.getByRole("combobox")
        await userEvent.type(combobox, "13")

        await userEvent.keyboard("{ArrowDown}{Enter}")

        expect(onSelect).toHaveBeenCalledWith(clientes[0])
    })

    it("should close the listbox on Escape without clearing the search text", async () => {
        renderSelector()
        const combobox = screen.getByRole("combobox")
        await userEvent.type(combobox, "13")
        expect(combobox).toHaveAttribute("aria-expanded", "true")

        await userEvent.keyboard("{Escape}")

        expect(combobox).toHaveAttribute("aria-expanded", "false")
        expect(screen.queryByRole("listbox")).not.toBeInTheDocument()
        expect(combobox).toHaveValue("13")
    })

    it("should have no axe violations with the listbox open", async () => {
        const { container } = renderSelector()
        await userEvent.type(screen.getByRole("combobox"), "13")

        expect(await axe(container)).toHaveNoViolations()
    })
})
