import { describe, expect, it } from "vitest"
import { getCurrentWeekRange } from "./current-week"

describe("getCurrentWeekRange", () => {
    it("returns Monday 00:00 to Sunday 23:59:59.999 when reference is a Sunday", () => {
        const { from, to } = getCurrentWeekRange(new Date(2026, 10, 1)) // domingo

        expect(from).toBe(new Date(2026, 9, 26, 0, 0, 0, 0).toISOString())
        expect(to).toBe(new Date(2026, 10, 1, 23, 59, 59, 999).toISOString())
    })

    it("returns the same week's Monday/Sunday when reference is a Wednesday", () => {
        const { from, to } = getCurrentWeekRange(new Date(2026, 10, 4)) // quarta

        expect(from).toBe(new Date(2026, 10, 2, 0, 0, 0, 0).toISOString())
        expect(to).toBe(new Date(2026, 10, 8, 23, 59, 59, 999).toISOString())
    })

    it("returns the same week's Monday/Sunday when reference is already a Monday", () => {
        const { from, to } = getCurrentWeekRange(new Date(2026, 10, 2)) // segunda

        expect(from).toBe(new Date(2026, 10, 2, 0, 0, 0, 0).toISOString())
        expect(to).toBe(new Date(2026, 10, 8, 23, 59, 59, 999).toISOString())
    })
})
