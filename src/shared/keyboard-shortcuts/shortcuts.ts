export const SHORTCUTS_DISABLED_STORAGE_KEY = "shortcuts-disabled"

export const NOVO_PEDIDO_EVENT = "shortcut:novo-pedido"

export const GO_TO_CHORDS: Record<string, { href: string; label: string }> = {
    i: { href: "/", label: "Início" },
    p: { href: "/pedidos", label: "Pedidos" },
    c: { href: "/clientes", label: "Clientes" },
    m: { href: "/cardapio", label: "Cardápio" },
    d: { href: "/dashboard", label: "Indicadores" },
}

export interface ShortcutEntry {
    keys: string
    description: string
    /** false para atalhos com modificador (Ctrl/Esc), que não são desativados pelo toggle de acessibilidade. */
    singleKey: boolean
}

export const SHORTCUT_LIST: ShortcutEntry[] = [
    { keys: "N", description: "Novo pedido", singleKey: true },
    { keys: "/", description: "Buscar nesta página", singleKey: true },
    { keys: "G depois I", description: "Ir para Início", singleKey: true },
    { keys: "G depois P", description: "Ir para Pedidos", singleKey: true },
    { keys: "G depois C", description: "Ir para Clientes", singleKey: true },
    { keys: "G depois M", description: "Ir para Cardápio", singleKey: true },
    { keys: "G depois D", description: "Ir para Indicadores", singleKey: true },
    { keys: "?", description: "Abrir esta ajuda", singleKey: true },
    { keys: "Ctrl + Enter", description: "Salvar o formulário do modal aberto", singleKey: false },
    { keys: "Esc", description: "Fechar o modal aberto", singleKey: false },
]

export function isTypingTarget(target: EventTarget | null): boolean {
    if (!(target instanceof HTMLElement)) return false
    if (target.isContentEditable) return true
    const tag = target.tagName
    return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT"
}
