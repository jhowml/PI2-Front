import { z } from "zod"
import { isValidMoney, moneyToCents } from "@/shared/lib/money"

export const itemCardapioSchema = z.object({
    nome: z.string().trim().min(1, "Informe o nome").max(100, "Máximo de 100 caracteres"),
    descricao: z.string().trim().max(255, "Máximo de 255 caracteres"),
    preco: z
        .string()
        .trim()
        .min(1, "Informe o preço")
        .refine(isValidMoney, "Use um valor como 12,50")
        .refine((value) => moneyToCents(value) > 0, "O preço deve ser maior que zero"),
    categoria: z.string().trim().min(1, "Informe a categoria").max(50, "Máximo de 50 caracteres"),
    disponivel: z.boolean(),
})

export type ItemCardapioFormData = z.infer<typeof itemCardapioSchema>
