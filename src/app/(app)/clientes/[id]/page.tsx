import { ClienteDetailView } from "@/features/clientes"

interface Props {
    params: Promise<{ id: string }>
}

export default async function ClienteDetailPage({ params }: Props) {
    const { id } = await params
    return <ClienteDetailView id={Number(id)} />
}
