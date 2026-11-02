import type { Page } from "@playwright/test"

const cliente = {
    id: 1,
    nome: "Carlos Eduardo Lima",
    telefone: "13997654321",
    obs: null,
    cep: "11410000",
    logradouro: "Avenida Santos Dumont",
    numero: "100",
    complemento: null,
    bairro: "Pitangueiras",
    cidade: "Guarujá",
    uf: "SP",
    createdAt: "2026-01-01T00:00:00.000Z",
}

const itemCardapio = {
    id: 1,
    nome: "Picanha na chapa",
    descricao: "Picanha grelhada com acompanhamentos",
    preco: "59.90",
    categoria: "Pratos",
    disponivel: true,
    createdAt: "2026-01-01T00:00:00.000Z",
    deletedAt: null,
}

const pedido = {
    id: 1,
    dataPedido: "2026-01-01T12:00:00.000Z",
    status: "CONFIRMADO",
    tipoEntrega: "ENTREGA",
    taxaEntrega: "8.00",
    desconto: "0.00",
    valorTotal: "67.90",
    obs: null,
    clienteId: cliente.id,
    cliente,
    itens: [
        { id: 1, quantidade: 1, precoUnitario: "59.90", pedidoId: 1, cardapioId: itemCardapio.id, cardapio: itemCardapio },
    ],
}

const pagamento = {
    id: 1,
    forma: "PIX",
    status: "PENDENTE",
    valor: "67.90",
    dataPagamento: null,
    pedidoId: pedido.id,
}

function paginated<T>(items: T[]) {
    return {
        data: items,
        meta: { total: items.length, page: 1, pageSize: 20, totalPages: 1, hasNextPage: false, hasPreviousPage: false },
    }
}

const dashboard = {
    faturamentoTotal: "670.00",
    ticketMedio: "67.00",
    faturamentoPorPeriodo: [{ data: "2026-01-01", pedidos: 2, faturamento: "134.00" }],
    vendasPorDiaSemana: [
        { diaSemana: "SEGUNDA", pedidos: 2, faturamento: "134.00", ticketMedio: "67.00" },
        { diaSemana: "TERCA", pedidos: 0, faturamento: "0.00", ticketMedio: "0.00" },
        { diaSemana: "QUARTA", pedidos: 0, faturamento: "0.00", ticketMedio: "0.00" },
        { diaSemana: "QUINTA", pedidos: 0, faturamento: "0.00", ticketMedio: "0.00" },
        { diaSemana: "SEXTA", pedidos: 0, faturamento: "0.00", ticketMedio: "0.00" },
        { diaSemana: "SABADO", pedidos: 0, faturamento: "0.00", ticketMedio: "0.00" },
        { diaSemana: "DOMINGO", pedidos: 0, faturamento: "0.00", ticketMedio: "0.00" },
    ],
    pedidosPorStatus: { CONFIRMADO: 1, PREPARANDO: 0, ENTREGUE: 1, CANCELADO: 0 },
    itensMaisVendidos: [{ cardapioId: itemCardapio.id, nome: itemCardapio.nome, quantidade: 5 }],
    pagamentosPorForma: [
        { forma: "DINHEIRO", quantidade: 1, valor: "67.90" },
        { forma: "PIX", quantidade: 0, valor: "0.00" },
        { forma: "CARTAO_CREDITO", quantidade: 0, valor: "0.00" },
        { forma: "CARTAO_DEBITO", quantidade: 0, valor: "0.00" },
    ],
}

/** Intercepta toda chamada à API com dados de exemplo, para as telas renderizarem sem backend real. */
export async function mockApi(page: Page) {
    await page.route("**/api/auth/login", (route) =>
        route.fulfill({ json: { token: "fake-e2e-token" } }),
    )
    await page.route("**/api/cardapio/**", (route) => route.fulfill({ json: itemCardapio }))
    await page.route("**/api/cardapio*", (route) => route.fulfill({ json: paginated([itemCardapio]) }))
    await page.route("**/api/clientes/**", (route) => route.fulfill({ json: cliente }))
    await page.route("**/api/clientes*", (route) => route.fulfill({ json: paginated([cliente]) }))
    await page.route("**/api/pedidos/*/status", (route) => route.fulfill({ json: pedido }))
    await page.route("**/api/pedidos/**", (route) => route.fulfill({ json: pedido }))
    await page.route("**/api/pedidos*", (route) => route.fulfill({ json: paginated([pedido]) }))
    await page.route("**/api/pagamentos/**", (route) => route.fulfill({ json: pagamento }))
    await page.route("**/api/dashboard*", (route) => route.fulfill({ json: dashboard }))
    await page.route("**/api/cep/**", (route) =>
        route.fulfill({ json: { cep: "11410000", logradouro: "Avenida Santos Dumont", bairro: "Pitangueiras", cidade: "Guarujá", uf: "SP" } }),
    )
}

/** Injeta um token falso antes de qualquer script da página rodar, pulando a tela de login. */
export async function loginAs(page: Page) {
    await page.addInitScript(() => {
        window.localStorage.setItem("auth_token", "fake-e2e-token")
    })
}

export const fixtures = { cliente, itemCardapio, pedido, pagamento, dashboard }
