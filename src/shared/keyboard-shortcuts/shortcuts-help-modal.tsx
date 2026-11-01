"use client"

import { Modal } from "@/shared/components/ui/modal"
import { useKeyboardShortcutsContext } from "./keyboard-shortcuts-provider"
import { SHORTCUT_LIST } from "./shortcuts"

export function ShortcutsHelpModal({ open, onClose }: { open: boolean; onClose: () => void }) {
    const { disabled, setDisabled } = useKeyboardShortcutsContext()

    return (
        <Modal open={open} onClose={onClose} title="Atalhos de teclado">
            <div className="flex flex-col gap-4">
                <label className="flex items-start gap-2 rounded-lg border border-border bg-muted/40 p-3 text-sm">
                    <input
                        type="checkbox"
                        checked={disabled}
                        onChange={(event) => setDisabled(event.target.checked)}
                        className="mt-0.5 size-4 shrink-0"
                    />
                    <span>
                        Desativar atalhos de uma tecla (N, /, G, ?). Os atalhos com Ctrl ou Esc continuam funcionando.
                    </span>
                </label>

                <table className="w-full text-left text-sm">
                    <caption className="sr-only">Lista de atalhos de teclado disponíveis</caption>
                    <thead>
                        <tr className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
                            <th scope="col" className="py-2 pr-3 font-medium">Tecla</th>
                            <th scope="col" className="py-2 font-medium">Ação</th>
                        </tr>
                    </thead>
                    <tbody>
                        {SHORTCUT_LIST.map((shortcut) => (
                            <tr key={shortcut.keys} className="border-b border-border last:border-0">
                                <td className="py-2 pr-3">
                                    <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 text-xs font-semibold">
                                        {shortcut.keys}
                                    </kbd>
                                </td>
                                <td className="py-2 text-foreground">{shortcut.description}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Modal>
    )
}
