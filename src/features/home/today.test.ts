import { describe, expect, it } from "vitest"
import { getTodayRange } from "./today"

describe("getTodayRange", () => {
    it("returns 00:00:00.000 to 23:59:59.999 of the reference date", () => {
        const { from, to } = getTodayRange(new Date(2026, 10, 1, 14, 32, 7))

        expect(from).toBe(new Date(2026, 10, 1, 0, 0, 0, 0).toISOString())
        expect(to).toBe(new Date(2026, 10, 1, 23, 59, 59, 999).toISOString())
    })
})
