"use client"

import { Keyboard } from "lucide-react"
import { useKeyboardShortcutsContext } from "@/shared/keyboard-shortcuts"

export function ShortcutsHelpLink() {
    const { openHelp } = useKeyboardShortcutsContext()

    return (
        <button
            type="button"
            onClick={openHelp}
            aria-keyshortcuts="?"
            title="Atalhos de teclado (?)"
            className="flex w-full gap-2 rounded-lg px-3 py-2 text-sm font-medium text-sidebar-foreground/85 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring"
        >
            <Keyboard className="size-4" aria-hidden="true" />
            Atalhos de teclado
        </button>
    )
}
