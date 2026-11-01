"use client"

import { useEffect } from "react"

const SUFFIX = " · Soberania Digital"

/** Para telas cujo título depende de um dado buscado no cliente (ex.: nome do cliente/número do pedido). */
export function useDocumentTitle(title: string | undefined) {
    useEffect(() => {
        if (!title) return
        const previous = document.title
        document.title = `${title}${SUFFIX}`
        return () => {
            document.title = previous
        }
    }, [title])
}
