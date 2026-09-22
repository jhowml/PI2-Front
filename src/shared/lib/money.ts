const MONEY_PATTERN = /^\d{1,8}([.,]\d{1,2})?$/

export function isValidMoney(value: string) {
    return MONEY_PATTERN.test(value.trim())
}

// Works in integer cents so the on-screen preview never shows float artifacts (0.1 + 0.2).
export function moneyToCents(value: string | number) {
    const normalized = String(value).trim().replace(",", ".")
    if (normalized === "") return 0
    const [integer, fraction = ""] = normalized.split(".")
    return Number(integer) * 100 + Number(fraction.padEnd(2, "0").slice(0, 2))
}

export function centsToNumber(cents: number) {
    return cents / 100
}

export function moneyToNumber(value: string) {
    return centsToNumber(moneyToCents(value))
}
