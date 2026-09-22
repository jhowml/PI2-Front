import { getToken, clearToken } from "./auth"

export class ApiError extends Error {
    constructor(
        message: string,
        public readonly status: number,
        public readonly code?: string,
        public readonly fields?: Record<string, string[]>,
    ) {
        super(message)
        this.name = "ApiError"
    }
}

export enum ApiRoute {
    Cardapio = "/api/cardapio",
    Clientes = "/api/clientes",
    Pedidos = "/api/pedidos",
    Cep = "/api/cep",
}

export type QueryParams = Record<string, string | number | undefined>

const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000"

function buildMessage(body: { error?: { message?: string; fields?: Record<string, string[]> } } | null, status: number) {
    const message = body?.error?.message ?? `Erro ${status} ao comunicar com a API.`
    const fields = body?.error?.fields
    if (!fields) return message
    const details = Object.entries(fields).map(([field, errors]) => `${field}: ${errors.join(", ")}`)
    return details.length > 0 ? `${message} ${details.join("; ")}` : message
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
    const token = getToken()
    const headers: Record<string, string> = { "Content-Type": "application/json" }
    if (token) headers["Authorization"] = `Bearer ${token}`

    let res: Response
    try {
        res = await fetch(`${baseUrl}${path}`, { ...options, headers })
    } catch {
        throw new ApiError("Não foi possível conectar à API. Verifique se o back-end está rodando.", 0)
    }

    if (res.status === 401) {
        clearToken()
        if (typeof window !== "undefined") window.location.href = "/login"
        throw new ApiError("Sessão expirada. Faça login novamente.", 401)
    }

    if (!res.ok) {
        const body = await res.json().catch(() => null)
        throw new ApiError(buildMessage(body, res.status), res.status, body?.error?.code, body?.error?.fields)
    }

    return res.json() as Promise<T>
}

function withQuery(route: string, params?: QueryParams) {
    if (!params) return route
    const entries = Object.entries(params)
        .filter(([, value]) => value !== undefined && value !== "")
        .map(([key, value]) => [key, String(value)])
    return entries.length > 0 ? `${route}?${new URLSearchParams(entries)}` : route
}

export const apiClient = {
    get: <T>(route: ApiRoute, params?: QueryParams) => request<T>(withQuery(route, params)),

    getById: <T>(route: ApiRoute, id: number | string) =>
        request<T>(`${route}/${encodeURIComponent(String(id))}`),

    post: <T>(route: ApiRoute, body: unknown) =>
        request<T>(route, { method: "POST", body: JSON.stringify(body) }),
}
