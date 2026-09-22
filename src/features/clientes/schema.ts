import { z } from "zod"

const optionalText = (max: number) => z.string().trim().max(max, `Máximo de ${max} caracteres`)

export const clienteSchema = z.object({
    nome: z.string().trim().min(1, "Informe o nome").max(100, "Máximo de 100 caracteres"),
    telefone: z
        .string()
        .transform((value) => value.replace(/\D/g, ""))
        .pipe(z.string().regex(/^\d{10,11}$/, "Informe DDD + número (10 ou 11 dígitos)")),
    obs: optionalText(255),
    cep: z
        .string()
        .trim()
        .refine((value) => value === "" || /^\d{5}-?\d{3}$/.test(value), "CEP deve ter 8 dígitos"),
    logradouro: optionalText(150),
    numero: optionalText(10),
    complemento: optionalText(60),
    bairro: optionalText(80),
    cidade: optionalText(80),
    uf: z
        .string()
        .trim()
        .refine((value) => value === "" || /^[A-Za-z]{2}$/.test(value), "UF deve ter 2 letras"),
})

export type ClienteFormInput = z.input<typeof clienteSchema>
export type ClienteFormData = z.output<typeof clienteSchema>
