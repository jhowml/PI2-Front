export function getCurrentWeekRange(reference = new Date()) {
    const day = reference.getDay() // 0 (domingo) .. 6 (sábado)
    const diffToMonday = day === 0 ? -6 : 1 - day

    const segunda = new Date(reference.getFullYear(), reference.getMonth(), reference.getDate() + diffToMonday, 0, 0, 0, 0)
    const domingo = new Date(segunda.getFullYear(), segunda.getMonth(), segunda.getDate() + 6, 23, 59, 59, 999)

    return { from: segunda.toISOString(), to: domingo.toISOString() }
}
