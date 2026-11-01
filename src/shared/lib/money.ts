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

// Converts an API decimal (e.g. "69.9", "0", 34.9) into the pt-BR comma format
// money inputs expect on screen (e.g. "69,90", "0,00"), so editing a form never
// shows the raw API value.
export function toMoneyInput(value: string | number) {
    const cents = moneyToCents(value)
    const reais = Math.floor(cents / 100)
    const centavos = String(cents % 100).padStart(2, "0")
    return `${reais},${centavos}`
}
