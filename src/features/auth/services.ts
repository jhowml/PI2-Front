import { LoginPayload, LoginResponse } from "./types"

const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000"

export async function login(payload: LoginPayload): Promise<LoginResponse> {
    let res: Response
    try {
        res = await fetch(`${baseUrl}/api/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        })
    } catch {
        throw new Error("Não foi possível conectar à API. Verifique se o back-end está rodando.")
    }

    if (!res.ok) {
        const body = await res.json().catch(() => null)
        throw new Error(body?.error?.message ?? "Credenciais inválidas.")
    }

    return res.json()
}
