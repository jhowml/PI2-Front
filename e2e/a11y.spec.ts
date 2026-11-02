import { test, expect } from "@playwright/test"
import AxeBuilder from "@axe-core/playwright"
import { mockApi, loginAs } from "./fixtures"

const AUTHENTICATED_PAGES = [
    { name: "Início", path: "/" },
    { name: "Pedidos", path: "/pedidos" },
    { name: "Detalhe do pedido", path: "/pedidos/1" },
    { name: "Clientes", path: "/clientes" },
    { name: "Detalhe do cliente", path: "/clientes/1" },
    { name: "Cardápio", path: "/cardapio" },
    { name: "Indicadores", path: "/dashboard" },
]

for (const { name, path } of AUTHENTICATED_PAGES) {
    test(`${name} (${path}) não tem violações de axe (wcag2a/2aa/21a/21aa)`, async ({ page }) => {
        await mockApi(page)
        await loginAs(page)
        await page.goto(path)
        await page.locator("main h1, [role=\"dialog\"] h2").first().waitFor({ state: "visible" })

        const results = await new AxeBuilder({ page })
            .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
            .analyze()

        expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([])
    })
}

test("Login (/login) não tem violações de axe (wcag2a/2aa/21a/21aa)", async ({ page }) => {
    await mockApi(page)
    await page.goto("/login")

    const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze()

    expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([])
})

test("Novo pedido (modal em /pedidos?novo=1) não tem violações de axe", async ({ page }) => {
    await mockApi(page)
    await loginAs(page)
    await page.goto("/pedidos?novo=1")

    await expect(page.getByRole("dialog", { name: "Novo pedido" })).toBeVisible({ timeout: 15_000 })

    const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze()

    expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([])
})
