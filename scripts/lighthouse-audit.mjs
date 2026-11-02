import { chromium } from "playwright"
import { playAudit } from "playwright-lighthouse"
import { writeFileSync, mkdirSync } from "node:fs"

const PORT = 9222
const BASE_URL = "http://localhost:3100"
const OUT_DIR = "docs/acessibilidade"

const cliente = {
    id: 1, nome: "Carlos Eduardo Lima", telefone: "13997654321", obs: null,
    cep: "11410000", logradouro: "Avenida Santos Dumont", numero: "100", complemento: null,
    bairro: "Pitangueiras", cidade: "Guarujá", uf: "SP", createdAt: "2026-01-01T00:00:00.000Z",
}
const itemCardapio = {
    id: 1, nome: "Picanha na chapa", descricao: "Picanha grelhada com acompanhamentos",
    preco: "59.90", categoria: "Pratos", disponivel: true, createdAt: "2026-01-01T00:00:00.000Z", deletedAt: null,
}
const pedido = {
    id: 1, dataPedido: "2026-01-01T12:00:00.000Z", status: "CONFIRMADO", tipoEntrega: "ENTREGA",
    taxaEntrega: "8.00", desconto: "0.00", valorTotal: "67.90", obs: null, clienteId: cliente.id, cliente,
    itens: [{ id: 1, quantidade: 1, precoUnitario: "59.90", pedidoId: 1, cardapioId: itemCardapio.id, cardapio: itemCardapio }],
}
const pagamento = { id: 1, forma: "PIX", status: "PENDENTE", valor: "67.90", dataPagamento: null, pedidoId: pedido.id }
const paginated = (items) => ({ data: items, meta: { total: items.length, page: 1, pageSize: 20, totalPages: 1, hasNextPage: false, hasPreviousPage: false } })
const dashboard = {
    faturamentoTotal: "670.00", ticketMedio: "67.00",
    faturamentoPorPeriodo: [{ data: "2026-01-01", pedidos: 2, faturamento: "134.00" }],
    vendasPorDiaSemana: ["SEGUNDA", "TERCA", "QUARTA", "QUINTA", "SEXTA", "SABADO", "DOMINGO"].map((d, i) => (
        i === 0 ? { diaSemana: d, pedidos: 2, faturamento: "134.00", ticketMedio: "67.00" } : { diaSemana: d, pedidos: 0, faturamento: "0.00", ticketMedio: "0.00" }
    )),
    pedidosPorStatus: { CONFIRMADO: 1, PREPARANDO: 0, ENTREGUE: 1, CANCELADO: 0 },
    itensMaisVendidos: [{ cardapioId: itemCardapio.id, nome: itemCardapio.nome, quantidade: 5 }],
    pagamentosPorForma: [
        { forma: "DINHEIRO", quantidade: 1, valor: "67.90" }, { forma: "PIX", quantidade: 0, valor: "0.00" },
        { forma: "CARTAO_CREDITO", quantidade: 0, valor: "0.00" }, { forma: "CARTAO_DEBITO", quantidade: 0, valor: "0.00" },
    ],
}

async function mockApi(page) {
    await page.route("**/api/cardapio/**", (r) => r.fulfill({ json: itemCardapio }))
    await page.route("**/api/cardapio*", (r) => r.fulfill({ json: paginated([itemCardapio]) }))
    await page.route("**/api/clientes/**", (r) => r.fulfill({ json: cliente }))
    await page.route("**/api/clientes*", (r) => r.fulfill({ json: paginated([cliente]) }))
    await page.route("**/api/pedidos/**", (r) => r.fulfill({ json: pedido }))
    await page.route("**/api/pedidos*", (r) => r.fulfill({ json: paginated([pedido]) }))
    await page.route("**/api/pagamentos/**", (r) => r.fulfill({ json: pagamento }))
    await page.route("**/api/dashboard*", (r) => r.fulfill({ json: dashboard }))
}

const PAGES = [
    { slug: "login", path: "/login", authenticated: false, wait: "h1" },
    { slug: "inicio", path: "/", authenticated: true, wait: "main h1" },
    { slug: "pedidos", path: "/pedidos", authenticated: true, wait: "main h1" },
    { slug: "pedido-detalhe", path: "/pedidos/1", authenticated: true, wait: "main h1" },
    { slug: "clientes", path: "/clientes", authenticated: true, wait: "main h1" },
    { slug: "cliente-detalhe", path: "/clientes/1", authenticated: true, wait: "main h1" },
    { slug: "cardapio", path: "/cardapio", authenticated: true, wait: "main h1" },
    { slug: "indicadores", path: "/dashboard", authenticated: true, wait: "main h1" },
]

mkdirSync(OUT_DIR, { recursive: true })

const browser = await chromium.launch({ args: [`--remote-debugging-port=${PORT}`] })
const results = []

for (const { slug, path, authenticated, wait } of PAGES) {
    const context = await browser.newContext()
    const page = await context.newPage()
    if (authenticated) {
        await page.addInitScript(() => window.localStorage.setItem("auth_token", "fake-lighthouse-token"))
    }
    await mockApi(page)
    await page.goto(`${BASE_URL}${path}`)
    await page.locator(wait).first().waitFor({ state: "visible", timeout: 15_000 })

    const audit = await playAudit({
        page,
        port: PORT,
        reports: { formats: { json: true }, name: `lighthouse-${slug}`, directory: OUT_DIR },
        thresholds: { performance: 0, accessibility: 0, "best-practices": 0, seo: 0 },
    }).catch((error) => ({ error: error.message, lhr: null }))

    const categories = audit?.lhr?.categories
    const scores = categories
        ? {
            performance: Math.round((categories.performance?.score ?? 0) * 100),
            accessibility: Math.round((categories.accessibility?.score ?? 0) * 100),
            bestPractices: Math.round((categories["best-practices"]?.score ?? 0) * 100),
            seo: Math.round((categories.seo?.score ?? 0) * 100),
        }
        : { error: audit.error }

    results.push({ slug, path, ...scores })
    console.log(slug, path, JSON.stringify(scores))
    await context.close()
}

await browser.close()
writeFileSync(`${OUT_DIR}/resumo.json`, JSON.stringify(results, null, 2))
console.log("\nResumo salvo em", `${OUT_DIR}/resumo.json`)
