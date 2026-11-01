import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { ChartCard } from "./chart-card"

describe("ChartCard", () => {
    it("should wrap the chart in role=img with the summary as aria-label by default", () => {
        render(
            <ChartCard
                title="Pedidos por status"
                summary="3 pedidos confirmados"
                chart={<div>barras</div>}
                table={<table><caption>tabela</caption></table>}
            />,
        )

        expect(screen.getByRole("img", { name: "3 pedidos confirmados" })).toBeInTheDocument()
    })

    it("should swap the chart for the table alternative when 'Ver como tabela' is clicked", async () => {
        render(
            <ChartCard
                title="Pedidos por status"
                summary="resumo"
                chart={<div>barras</div>}
                table={<table><caption>Tabela de pedidos por status</caption></table>}
            />,
        )

        await userEvent.click(screen.getByRole("button", { name: "Ver como tabela" }))

        expect(screen.getByRole("table", { name: "Tabela de pedidos por status" })).toBeInTheDocument()
        expect(screen.queryByRole("img")).not.toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Ver como gráfico" })).toBeInTheDocument()
    })

    it("should not add a role=img wrapper when scrollable is set, since the chart defines its own region", () => {
        render(
            <ChartCard
                title="Faturamento por período"
                scrollable
                chart={<div role="region" aria-label="faturamento diário">barras</div>}
                table={<table><caption>tabela</caption></table>}
            />,
        )

        expect(screen.queryByRole("img")).not.toBeInTheDocument()
        expect(screen.getByRole("region", { name: "faturamento diário" })).toBeInTheDocument()
    })
})
