import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { KeyboardShortcutsProvider } from "./keyboard-shortcuts-provider"
import { NOVO_PEDIDO_EVENT, SHORTCUTS_DISABLED_STORAGE_KEY } from "./shortcuts"

const push = vi.fn()

vi.mock("next/navigation", () => ({
    useRouter: () => ({ push }),
}))

beforeEach(() => {
    push.mockClear()
    window.localStorage.clear()
    window.history.pushState({}, "", "/")
})

describe("KeyboardShortcutsProvider", () => {
    it("should navigate to /pedidos?novo=1 when N is pressed outside /pedidos", async () => {
        render(<KeyboardShortcutsProvider>conteúdo</KeyboardShortcutsProvider>)

        await userEvent.keyboard("n")

        expect(push).toHaveBeenCalledWith("/pedidos?novo=1")
    })

    it("should dispatch the novo-pedido event instead of navigating when already on /pedidos", async () => {
        window.history.pushState({}, "", "/pedidos")
        const handler = vi.fn()
        window.addEventListener(NOVO_PEDIDO_EVENT, handler)
        render(<KeyboardShortcutsProvider>conteúdo</KeyboardShortcutsProvider>)

        await userEvent.keyboard("n")

        expect(handler).toHaveBeenCalledOnce()
        expect(push).not.toHaveBeenCalled()
        window.removeEventListener(NOVO_PEDIDO_EVENT, handler)
    })

    it("should not fire single-key shortcuts while the focus is on a text input", async () => {
        render(
            <KeyboardShortcutsProvider>
                <input aria-label="algum campo" />
            </KeyboardShortcutsProvider>,
        )

        await userEvent.click(screen.getByLabelText("algum campo"))
        await userEvent.keyboard("n")

        expect(push).not.toHaveBeenCalled()
    })

    it("should navigate via the G chord (G then P goes to Pedidos)", async () => {
        render(<KeyboardShortcutsProvider>conteúdo</KeyboardShortcutsProvider>)

        await userEvent.keyboard("gp")

        expect(push).toHaveBeenCalledWith("/pedidos")
    })

    it("should open the help modal on ?", async () => {
        render(<KeyboardShortcutsProvider>conteúdo</KeyboardShortcutsProvider>)

        await userEvent.keyboard("?")

        expect(screen.getByRole("dialog", { name: "Atalhos de teclado" })).toBeInTheDocument()
    })

    it("should stop single-key shortcuts from firing once disabled via the help modal, while keeping Esc/Ctrl+Enter active", async () => {
        render(<KeyboardShortcutsProvider>conteúdo</KeyboardShortcutsProvider>)

        await userEvent.keyboard("?")
        await userEvent.click(screen.getByRole("checkbox"))
        expect(window.localStorage.getItem(SHORTCUTS_DISABLED_STORAGE_KEY)).toBe("true")

        await userEvent.keyboard("{Escape}")
        expect(screen.queryByRole("dialog")).not.toBeInTheDocument()

        await userEvent.keyboard("n")
        expect(push).not.toHaveBeenCalled()
    })

    it("should submit the form inside the open dialog on Ctrl+Enter", async () => {
        const onSubmit = vi.fn((e: React.FormEvent) => e.preventDefault())
        render(
            <KeyboardShortcutsProvider>
                <div role="dialog">
                    <form onSubmit={onSubmit}>
                        <button type="submit">Salvar</button>
                    </form>
                </div>
            </KeyboardShortcutsProvider>,
        )

        await userEvent.keyboard("{Control>}{Enter}{/Control}")

        expect(onSubmit).toHaveBeenCalledOnce()
    })
})
