"use client"

import { useEffect, useSyncExternalStore } from "react"
import { useRouter } from "next/navigation"
import { getToken } from "@/shared/lib/auth"

const subscribe = () => () => {}

export function AuthGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const hasToken = useSyncExternalStore(subscribe, () => getToken() !== null, () => false)

    useEffect(() => {
        if (!getToken()) router.replace("/login")
    }, [router])

    if (!hasToken) return null

    return <>{children}</>
}
