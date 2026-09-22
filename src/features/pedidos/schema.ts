import { z } from "zod"
import { isValidMoney, moneyToCents } from "@/shared/lib/money"
import { TIPOS_ENTREGA } from "./types"

const optionalMoney = z
    .string()
    .trim()
    .refine((value) => value === "" || isValidMoney(value), "Use um valor como 5,00")

const itemSchema = z.object({
    cardapioId: z.string().min(1, "Selecione um item"),
    quantidade: z.number({ message: "Informe a quantidade" }).int("Use um número inteiro").min(1, "Mínimo 1").max(999, "Máximo 999"),
})

export const pedidoSchema = z
    .object({
        clienteId: z.string().min(1, "Selecione o cliente"),
        tipoEntrega: z.enum(TIPOS_ENTREGA, { message: "Escolha entrega ou retirada" }),
        taxaEntrega: optionalMoney,
        desconto: optionalMoney,
        obs: z.string().trim().max(255, "Máximo de 255 caracteres"),
        itens: z
            .array(itemSchema)
            .min(1, "Adicione pelo menos um item")
            .refine(
                (itens) => {
                    const ids = itens.map((item) => item.cardapioId).filter(Boolean)
                    return new Set(ids).size === ids.length
                },
                "Cada item deve aparecer uma única vez; ajuste a quantidade",
            ),
    })
    .superRefine((pedido, ctx) => {
        if (pedido.tipoEntrega === "RETIRADA" && moneyToCents(pedido.taxaEntrega) !== 0) {
            ctx.addIssue({ code: "custom", path: ["taxaEntrega"], message: "Retirada não tem taxa de entrega" })
        }
    })

export type PedidoFormData = z.infer<typeof pedidoSchema>
