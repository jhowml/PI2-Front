"use client"

import { BackLink } from "@/shared/components/ui/back-link"
import { Row, Section } from "@/shared/components/ui/section"
import { formatCep, formatDateTime, formatPhone } from "@/shared/lib/format"
import { useCliente } from "../hooks/use-cliente"

export function ClienteDetailView({ id }: { id: number }) {
    const { cliente, loading, error } = useCliente(id)

    return (
        <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 p-4 md:p-8">
            <BackLink href="/clientes" label="Voltar para clientes" />

            {loading && <p className="text-sm text-muted-foreground" role="status">Carregando...</p>}
            {error && <p className="text-sm font-medium text-destructive" role="alert">{error}</p>}

            {cliente && (
                <>
                    <header>
                        <h1 className="text-2xl font-semibold tracking-tight">{cliente.nome}</h1>
                        <p className="mt-0.5 text-sm text-muted-foreground">Cliente desde {formatDateTime(cliente.createdAt)}</p>
                    </header>

                    <Section title="Contato">
                        <dl className="flex flex-col gap-3">
                            <Row label="Telefone" value={formatPhone(cliente.telefone)} />
                            {cliente.obs && <Row label="Observação" value={cliente.obs} />}
                        </dl>
                    </Section>

                    <Section title="Endereço">
                        {cliente.logradouro || cliente.cep ? (
                            <dl className="flex flex-col gap-3">
                                {cliente.cep && <Row label="CEP" value={formatCep(cliente.cep)} />}
                                {cliente.logradouro && <Row label="Logradouro" value={[cliente.logradouro, cliente.numero].filter(Boolean).join(", ")} />}
                                {cliente.complemento && <Row label="Complemento" value={cliente.complemento} />}
                                {cliente.bairro && <Row label="Bairro" value={cliente.bairro} />}
                                {cliente.cidade && <Row label="Cidade" value={[cliente.cidade, cliente.uf].filter(Boolean).join("/")} />}
                            </dl>
                        ) : (
                            <p className="text-sm text-muted-foreground">Sem endereço cadastrado (cliente de retirada).</p>
                        )}
                    </Section>
                </>
            )}
        </div>
    )
}
