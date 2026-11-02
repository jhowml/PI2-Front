import { defineConfig, devices } from "@playwright/test"

export default defineConfig({
    testDir: "./e2e",
    // workers: 1 evita que duas rotas novas compilem ao mesmo tempo no "next dev" (webpack
    // compila por rota sob demanda; dois workers batendo em rotas frias ao mesmo tempo
    // deixou o timeout padrão de 30s insuficiente em testes locais).
    workers: 1,
    timeout: 60_000,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 1 : 0,
    reporter: "list",
    use: {
        baseURL: "http://localhost:3100",
        trace: "retain-on-failure",
    },
    projects: [
        { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    ],
    webServer: {
        command: "npx next dev --webpack -p 3100",
        url: "http://localhost:3100",
        reuseExistingServer: !process.env.CI,
        timeout: 60_000,
    },
})
