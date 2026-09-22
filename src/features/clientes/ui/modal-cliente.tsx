"use client"

import { Modal } from "@/shared/components/ui/modal"
import { Button } from "@/components"
import { useCreateCliente } from "../hooks/use-create-cliente"
import type { CreateClientePayload } from "../services"
import { ClienteForm } from "./cliente-form"

interface ModalClienteProps {
    open: boolean
    onClose: () => void
}

export function ModalCliente({ open, onClose }: ModalClienteProps) {
    const { create, loading } = useCreateCliente()

    async function handleSubmit(payload: CreateClientePayload) {
        try {
            await create(payload)
            onClose()
        } catch {
            // error toast already shown by the hook
        }
    }

    return (
        <Modal
            title="Novo cliente"
            open={open}
            onClose={onClose}
            footer={<Button label={loading ? "Salvando..." : "Salvar"} className="w-full" type="submit" form="form-cliente" disabled={loading} />}
        >
            {open && <ClienteForm formId="form-cliente" onSubmit={handleSubmit} />}
        </Modal>
    )
}
