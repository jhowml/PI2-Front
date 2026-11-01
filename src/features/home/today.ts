export function getTodayRange(reference = new Date()) {
    const inicio = new Date(reference.getFullYear(), reference.getMonth(), reference.getDate(), 0, 0, 0, 0)
    const fim = new Date(reference.getFullYear(), reference.getMonth(), reference.getDate(), 23, 59, 59, 999)

    return { from: inicio.toISOString(), to: fim.toISOString() }
}
