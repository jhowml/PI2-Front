import { PedidoDetailView } from "@/features/pedidos"

interface Props {
    params: Promise<{ id: string }>
}

export default async function PedidoDetailPage({ params }: Props) {
    const { id } = await params
    return <PedidoDetailView id={Number(id)} />
}
