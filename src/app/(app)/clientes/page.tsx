import type { Metadata } from "next"
import { ClientesView } from "@/features/clientes"

export const metadata: Metadata = { title: "Clientes" }

export default function ClientesPage() {
    return <ClientesView />
}
