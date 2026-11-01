import type { Metadata } from "next"
import { CardapioView } from "@/features/cardapio"

export const metadata: Metadata = { title: "Cardápio" }

export default function CardapioPage() {
    return <CardapioView />
}
