const currencyFormatter = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" })
const dateTimeFormatter = new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" })

export function formatCurrency(value: string | number) {
    return currencyFormatter.format(Number(value))
}

export function formatCents(cents: number) {
    return currencyFormatter.format(cents / 100)
}

export function formatDateTime(value: string) {
    return dateTimeFormatter.format(new Date(value))
}

export function formatPhone(value: string) {
    const digits = value.replace(/\D/g, "").slice(0, 11)
    if (digits.length <= 10) {
        return digits.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3").trim()
    }
    return digits.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3").trim()
}

export function formatCep(value: string) {
    const digits = value.replace(/\D/g, "").slice(0, 8)
    return digits.length > 5 ? `${digits.slice(0, 5)}-${digits.slice(5)}` : digits
}
