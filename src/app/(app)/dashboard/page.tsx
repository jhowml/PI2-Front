import type { Metadata } from "next"
import { DashboardView } from "@/features/dashboard"

export const metadata: Metadata = { title: "Indicadores" }

export default function DashboardPage() {
    return <DashboardView />
}
