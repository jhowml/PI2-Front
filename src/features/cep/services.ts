import { apiClient, ApiRoute } from "@/shared/lib/api-client"
import type { Endereco } from "./types"

export function getEnderecoByCep(cep: string) {
    return apiClient.getById<Endereco>(ApiRoute.Cep, cep.replace(/\D/g, ""))
}
