"use client"

import { getCurrentWeekRange } from "./current-week"
import { ResumoPeriodo } from "./resumo-periodo"

export function ResumoSemana() {
    const { from, to } = getCurrentWeekRange()

    return <ResumoPeriodo titulo="Resumo da semana" from={from} to={to} />
}
