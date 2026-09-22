import { formatCep } from "@/shared/lib/format"
import type { Cliente } from "./types"

type EnderecoCliente = Pick<Cliente, "logradouro" | "numero" | "complemento" | "bairro" | "cidade" | "uf" | "cep">

export function formatEndereco(cliente: EnderecoCliente) {
    const rua = [cliente.logradouro, cliente.numero].filter(Boolean).join(", ")
    const cidade = [cliente.cidade, cliente.uf].filter(Boolean).join("/")
    const partes = [rua, cliente.complemento, cliente.bairro, cidade, cliente.cep ? `CEP ${formatCep(cliente.cep)}` : null]
    const texto = partes.filter(Boolean).join(" – ")
    return texto === "" ? null : texto
}
