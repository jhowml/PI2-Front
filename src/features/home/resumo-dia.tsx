"use client"

import { getTodayRange } from "./today"
import { ResumoPeriodo } from "./resumo-periodo"

export function ResumoDia() {
    const { from, to } = getTodayRange()

    return <ResumoPeriodo titulo="Pedidos de hoje" from={from} to={to} />
}
