import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { Modal } from "./modal"

function renderModal(onClose = vi.fn()) {
    return render(
        <Modal open title="Exemplo" onClose={onClose}>
            <input placeholder="Primeiro campo" />
            <input placeholder="Segundo campo" />
        </Modal>,
    )
}

describe("Modal", () => {
    it("should close on Escape", async () => {
        const onClose = vi.fn()
        renderModal(onClose)

        await userEvent.keyboard("{Escape}")

        expect(onClose).toHaveBeenCalledOnce()
    })

    it("should trap Tab focus by wrapping from the last focusable element to the first", async () => {
        renderModal()

        const closeButton = screen.getByRole("button", { name: "Fechar" })
        const second = screen.getByPlaceholderText("Segundo campo")
        second.focus()
        expect(document.activeElement).toBe(second)

        await userEvent.tab()

        expect(document.activeElement).toBe(closeButton)
    })

    it("should trap Shift+Tab focus by wrapping from the first focusable element to the last", async () => {
        renderModal()

        const closeButton = screen.getByRole("button", { name: "Fechar" })
        closeButton.focus()
        expect(document.activeElement).toBe(closeButton)

        await userEvent.tab({ shift: true })

        const second = screen.getByPlaceholderText("Segundo campo")
        expect(document.activeElement).toBe(second)
    })
})
