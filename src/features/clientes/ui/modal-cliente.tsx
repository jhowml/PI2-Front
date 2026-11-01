"use client"

import { Modal } from "@/shared/components/ui/modal"
import { Button } from "@/components"
import { formatCep } from "@/shared/lib/format"
import { useCreateCliente } from "../hooks/use-create-cliente"
import { useUpdateCliente } from "../hooks/use-update-cliente"
import type { CreateClientePayload } from "../services"
import type { Cliente } from "../types"
import type { ClienteFormInput } from "../schema"
import { ClienteForm } from "./cliente-form"

interface ModalClienteProps {
    open: boolean
    onClose: () => void
    cliente?: Cliente
}

function toInitialValues(cliente: Cliente): Partial<ClienteFormInput> {
    return {
        nome: cliente.nome,
        telefone: cliente.telefone,
        obs: cliente.obs ?? "",
        cep: cliente.cep ? formatCep(cliente.cep) : "",
        logradouro: cliente.logradouro ?? "",
        numero: cliente.numero ?? "",
        complemento: cliente.complemento ?? "",
        bairro: cliente.bairro ?? "",
        cidade: cliente.cidade ?? "",
        uf: cliente.uf ?? "",
    }
}

export function ModalCliente({ open, onClose, cliente }: ModalClienteProps) {
    const { create, loading: creating } = useCreateCliente()
    const { update, loading: updating } = useUpdateCliente(cliente?.id ?? 0)
    const loading = cliente ? updating : creating

    async function handleSubmit(payload: CreateClientePayload) {
        try {
            if (cliente) await update(payload)
            else await create(payload)
            onClose()
        } catch {
            // error toast already shown by the hook
        }
    }

    return (
        <Modal
            title={cliente ? "Editar cliente" : "Novo cliente"}
            open={open}
            onClose={onClose}
            footer={<Button label={loading ? "Salvando..." : "Salvar"} className="w-full" type="submit" form="form-cliente" disabled={loading} />}
        >
            {open && (
                <ClienteForm formId="form-cliente" initialValues={cliente ? toInitialValues(cliente) : undefined} onSubmit={handleSubmit} />
            )}
        </Modal>
    )
}
