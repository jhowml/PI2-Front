import { PedidosView } from "@/features/pedidos"

interface Props {
    searchParams: Promise<{ novo?: string }>
}

export default async function PedidosPage({ searchParams }: Props) {
    const { novo } = await searchParams
    return <PedidosView openNew={novo === "1"} />
}
