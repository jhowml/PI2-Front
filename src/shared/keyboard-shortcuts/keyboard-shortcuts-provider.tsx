"use client"

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { ShortcutsHelpModal } from "./shortcuts-help-modal"
import { GO_TO_CHORDS, NOVO_PEDIDO_EVENT, SHORTCUTS_DISABLED_STORAGE_KEY, isTypingTarget } from "./shortcuts"

const CHORD_WINDOW_MS = 1000

interface KeyboardShortcutsContextValue {
    disabled: boolean
    setDisabled: (disabled: boolean) => void
    openHelp: () => void
}

const KeyboardShortcutsContext = createContext<KeyboardShortcutsContextValue | null>(null)

export function useKeyboardShortcutsContext() {
    const context = useContext(KeyboardShortcutsContext)
    if (!context) throw new Error("useKeyboardShortcutsContext deve ser usado dentro de KeyboardShortcutsProvider")
    return context
}

function readDisabledFromStorage(): boolean {
    try {
        return window.localStorage.getItem(SHORTCUTS_DISABLED_STORAGE_KEY) === "true"
    } catch {
        return false
    }
}

export function KeyboardShortcutsProvider({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const [disabled, setDisabledState] = useState(readDisabledFromStorage)
    const [helpOpen, setHelpOpen] = useState(false)
    const chordRef = useRef<{ active: boolean; expiresAt: number }>({ active: false, expiresAt: 0 })

    const setDisabled = useCallback((value: boolean) => {
        setDisabledState(value)
        try {
            window.localStorage.setItem(SHORTCUTS_DISABLED_STORAGE_KEY, String(value))
        } catch {
            // localStorage indisponível (modo privado); a preferência só não persiste entre sessões.
        }
    }, [])

    const openHelp = useCallback(() => setHelpOpen(true), [])

    useEffect(() => {
        function handleKeyDown(event: KeyboardEvent) {
            if (event.ctrlKey && !event.altKey && event.key === "Enter") {
                const dialog = document.querySelector('[role="dialog"]')
                const form = dialog?.querySelector("form")
                if (form) {
                    event.preventDefault()
                    form.requestSubmit()
                }
                return
            }

            if (disabled) return
            if (isTypingTarget(event.target)) return
            if (event.ctrlKey || event.metaKey || event.altKey) return

            const chord = chordRef.current
            if (chord.active && Date.now() <= chord.expiresAt) {
                chord.active = false
                const destination = GO_TO_CHORDS[event.key.toLowerCase()]
                if (destination) {
                    event.preventDefault()
                    router.push(destination.href)
                }
                return
            }
            chord.active = false

            if (event.key.toLowerCase() === "g") {
                event.preventDefault()
                chordRef.current = { active: true, expiresAt: Date.now() + CHORD_WINDOW_MS }
                return
            }

            if (event.key.toLowerCase() === "n") {
                event.preventDefault()
                if (window.location.pathname === "/pedidos") {
                    window.dispatchEvent(new CustomEvent(NOVO_PEDIDO_EVENT))
                } else {
                    router.push("/pedidos?novo=1")
                }
                return
            }

            if (event.key === "/") {
                event.preventDefault()
                document.querySelector<HTMLInputElement>('input[type="search"]')?.focus()
                return
            }

            if (event.key === "?") {
                event.preventDefault()
                setHelpOpen(true)
            }
        }

        document.addEventListener("keydown", handleKeyDown)
        return () => document.removeEventListener("keydown", handleKeyDown)
    }, [disabled, router])

    return (
        <KeyboardShortcutsContext.Provider value={{ disabled, setDisabled, openHelp }}>
            {children}
            <ShortcutsHelpModal open={helpOpen} onClose={() => setHelpOpen(false)} />
        </KeyboardShortcutsContext.Provider>
    )
}
