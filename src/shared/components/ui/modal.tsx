"use client"

import { useEffect, useId, useRef } from "react"
import { X } from "lucide-react"

export interface ModalProps {
    title: string
    children: React.ReactNode
    footer?: React.ReactNode
    onClose: () => void
    open: boolean
}

export function Modal({ open, onClose, title, children, footer }: ModalProps) {
    const titleId = useId()
    const dialogRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!open) return
        const previouslyFocused = document.activeElement as HTMLElement | null
        document.body.style.overflow = "hidden"
        const firstField = dialogRef.current?.querySelector<HTMLElement>("input, select, textarea, button:not([data-close])")
        firstField?.focus()

        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === "Escape") onClose()
        }
        document.addEventListener("keydown", handleKeyDown)

        return () => {
            document.body.style.overflow = ""
            document.removeEventListener("keydown", handleKeyDown)
            previouslyFocused?.focus()
        }
    }, [open, onClose])

    return (
        <div
            inert={!open}
            aria-hidden={!open}
            className={`fixed inset-0 z-50 flex items-end justify-center transition-opacity duration-300 md:items-center ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
        >
            <div className="absolute inset-0 bg-black/50" onClick={onClose} aria-hidden="true" />
            <div
                ref={dialogRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                className={`relative z-10 mb-16 flex w-full flex-col rounded-t-2xl bg-background shadow-xl transition-transform duration-300 ease-out md:mb-0 md:max-w-xl md:rounded-xl ${open ? "translate-y-0" : "translate-y-full md:translate-y-0"}`}
            >
                <div className="flex items-center justify-between border-b border-border px-5 py-3">
                    <h2 id={titleId} className="text-lg font-bold tracking-tight text-foreground">{title}</h2>
                    <button
                        type="button"
                        data-close
                        onClick={onClose}
                        aria-label="Fechar"
                        className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                        <X className="size-4" aria-hidden="true" />
                    </button>
                </div>
                <div className="max-h-[65svh] overflow-y-auto px-5 pb-2 pt-4 md:max-h-[70vh]">{children}</div>
                {footer != null && <div className="border-t border-border px-5 py-4">{footer}</div>}
            </div>
        </div>
    )
}
