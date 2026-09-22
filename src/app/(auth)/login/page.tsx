"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Flame } from "lucide-react"
import { FormField } from "@/shared/components/ui/form-field"
import { Input } from "@/shared/components/ui/input"
import { Button } from "@/components"
import { useLogin } from "@/features/auth/hooks/use-login"
import { loginSchema, LoginFormData } from "@/features/auth/schema"

export default function LoginPage() {
    const { login, loading } = useLogin()

    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    })

    return (
        <div className="w-full max-w-sm">
            <div className="rounded-xl border-t-4 border-sidebar-primary bg-card p-8 shadow-xl">
                <div className="mb-8 flex flex-col items-center text-center">
                    <span className="mb-3 flex size-12 items-center justify-center rounded-xl bg-primary text-sidebar-primary" aria-hidden="true">
                        <Flame className="size-6" />
                    </span>
                    <h1 className="text-2xl font-semibold tracking-tight">Soberania Digital</h1>
                    <p className="mt-1 text-sm text-muted-foreground">Faça login para continuar</p>
                </div>

                <form onSubmit={handleSubmit((data) => login(data).catch(() => undefined))} className="flex flex-col gap-4" noValidate>
                    <FormField label="Usuário" required error={errors.username?.message}>
                        <Input {...register("username")} placeholder="Digite seu usuário" autoComplete="username" />
                    </FormField>

                    <FormField label="Senha" required error={errors.password?.message}>
                        <Input {...register("password")} type="password" placeholder="Digite sua senha" autoComplete="current-password" />
                    </FormField>

                    <Button type="submit" disabled={loading} className="mt-2 h-10 w-full" label={loading ? "Entrando..." : "Entrar"} />
                </form>
            </div>
        </div>
    )
}
