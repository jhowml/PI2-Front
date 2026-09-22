import { describe, expect, it } from "vitest"
import { formatEndereco } from "./utils"

const semEndereco = { cep: null, logradouro: null, numero: null, complemento: null, bairro: null, cidade: null, uf: null }

describe("formatEndereco", () => {
    it("joins the structured address in reading order", () => {
        expect(
            formatEndereco({
                ...semEndereco,
                cep: "11440000",
                logradouro: "Avenida Dom Pedro I",
                numero: "350",
                complemento: "Apto 42",
                bairro: "Enseada",
                cidade: "Guarujá",
                uf: "SP",
            }),
        ).toBe("Avenida Dom Pedro I, 350 – Apto 42 – Enseada – Guarujá/SP – CEP 11440-000")
    })

    it("returns null for clientes without address", () => {
        expect(formatEndereco(semEndereco)).toBeNull()
    })
})
