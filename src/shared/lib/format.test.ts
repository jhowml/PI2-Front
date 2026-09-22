import { describe, expect, it } from "vitest"
import { formatCents, formatCep, formatCurrency, formatPhone } from "./format"

const normalizeSpaces = (value: string) => value.replace(/\s/g, " ")

describe("formatCurrency", () => {
    it("formats API decimal strings as BRL", () => {
        expect(normalizeSpaces(formatCurrency("79.3"))).toBe("R$ 79,30")
    })
})

describe("formatCents", () => {
    it("formats integer cents as BRL", () => {
        expect(normalizeSpaces(formatCents(3900))).toBe("R$ 39,00")
    })
})

describe("formatPhone", () => {
    it("masks landlines and mobile numbers", () => {
        expect(formatPhone("1333551020")).toBe("(13) 3355-1020")
        expect(formatPhone("13991234567")).toBe("(13) 99123-4567")
    })
})

describe("formatCep", () => {
    it("adds the hyphen after five digits", () => {
        expect(formatCep("11410000")).toBe("11410-000")
        expect(formatCep("1141")).toBe("1141")
    })
})
