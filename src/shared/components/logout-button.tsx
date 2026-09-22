"use client"

import { useRouter } from "next/navigation"
import { useQueryClient } from "@tanstack/react-query"
import { LogOut } from "lucide-react"
import { clearToken } from "@/shared/lib/auth"

export function LogoutButton() {
    const router = useRouter()
    const queryClient = useQueryClient()

    function handleLogout() {
        clearToken()
        queryClient.clear()
        router.push("/login")
    }

    return (
        <button
            type="button"
            onClick={handleLogout}
            className="flex w-full gap-2 rounded-lg px-3 py-2 text-sm font-medium text-sidebar-foreground/85 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring"
        >
            <LogOut className="size-4" aria-hidden="true" />
            Sair
        </button>
    )
}
