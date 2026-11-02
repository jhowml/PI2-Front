import { test, expect } from "@playwright/test"
import { mockApi, loginAs } from "./fixtures"

test("cria um pedido inteiramente pelo teclado, sem usar o mouse", async ({ page }) => {
    await mockApi(page)
    await loginAs(page)
    await page.goto("/pedidos")
    await page.getByRole("button", { name: "Novo pedido" }).first().waitFor({ state: "visible" })

    // "N" abre o modal de novo pedido
    await page.keyboard.press("n")
    const dialog = page.getByRole("dialog", { name: "Novo pedido" })
    await expect(dialog).toBeVisible()

    // busca e seleciona o cliente pelo combobox, só com teclado
    const combobox = dialog.getByRole("combobox", { name: "Buscar por telefone ou endereço" })
    await expect(combobox).toBeFocused()
    await page.keyboard.type("13")
    await expect(dialog.getByRole("listbox")).toBeVisible()
    await page.keyboard.press("ArrowDown")
    await page.keyboard.press("Enter")
    await expect(dialog.getByText("Carlos Eduardo Lima")).toBeVisible()

    // seleciona o item do cardápio e preenche a quantidade via Tab
    await page.keyboard.press("Tab") // tipo de entrega: Entrega
    await page.keyboard.press("Tab") // tipo de entrega: Retirada
    await page.keyboard.press("Tab") // select do item
    await page.keyboard.press("ArrowDown") // seleciona o único item disponível
    await page.keyboard.press("Tab") // quantidade

    // Ctrl+Enter salva o formulário do modal aberto
    await page.keyboard.press("Control+Enter")

    await expect(dialog).not.toBeVisible({ timeout: 10_000 })
})
