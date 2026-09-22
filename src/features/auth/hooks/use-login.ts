"use client"

import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { login } from "../services"
import { setToken } from "@/shared/lib/auth"
import { LoginPayload } from "../types"

export function useLogin() {
    const router = useRouter()

    const { mutateAsync, isPending, error } = useMutation({
        mutationFn: (payload: LoginPayload) => login(payload),
        onSuccess: ({ token }) => {
            setToken(token)
            router.push('/')
        },
        onError: (e: Error) => toast.error(e.message),
    })

    return { login: mutateAsync, loading: isPending, error: error?.message ?? null }
}
