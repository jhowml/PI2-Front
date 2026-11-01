import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { axe } from "vitest-axe"
import LoginPage from "./page"

vi.mock("@/features/auth/hooks/use-login", () => ({
    useLogin: () => ({ login: vi.fn(), loading: false }),
}))

describe("LoginPage", () => {
    it("should have no axe violations in the initial state", async () => {
        const { container } = render(<LoginPage />)

        expect(await axe(container)).toHaveNoViolations()
    })

    it("should focus the username field and show no axe violations when both fields are left empty on submit", async () => {
        render(<LoginPage />)

        await userEvent.click(screen.getByRole("button", { name: "Entrar" }))

        const usernameInput = await screen.findByPlaceholderText("Digite seu usuário")
        expect(usernameInput).toHaveFocus()
        expect(usernameInput).toHaveAttribute("aria-invalid", "true")
    })
})
