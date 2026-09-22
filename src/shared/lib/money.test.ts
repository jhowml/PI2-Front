import { describe, expect, it } from "vitest"
import { isValidMoney, moneyToCents, moneyToNumber } from "./money"

describe("isValidMoney", () => {
    it.each(["0", "12", "12,5", "12,50", "12.50", "99999999,99"])("accepts %s", (value) => {
        expect(isValidMoney(value)).toBe(true)
    })

    it.each(["", "-1", "12,345", "abc", "1.000,00", "123456789"])("rejects %s", (value) => {
        expect(isValidMoney(value)).toBe(false)
    })
})

describe("moneyToCents", () => {
    it("converts comma and dot decimals", () => {
        expect(moneyToCents("12,5")).toBe(1250)
        expect(moneyToCents("12.05")).toBe(1205)
        expect(moneyToCents("7")).toBe(700)
    })

    it("treats an empty value as zero", () => {
        expect(moneyToCents("")).toBe(0)
    })

    it("converts API decimal strings without float errors", () => {
        expect(moneyToCents("0.1") + moneyToCents("0.2")).toBe(30)
        expect(moneyToCents(34.9)).toBe(3490)
    })
})

describe("moneyToNumber", () => {
    it("returns the number sent to the API", () => {
        expect(moneyToNumber("5,00")).toBe(5)
        expect(moneyToNumber("2,25")).toBe(2.25)
    })
})
