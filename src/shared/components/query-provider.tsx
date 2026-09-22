"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useState } from "react"
import { ApiError } from "@/shared/lib/api-client"

export function QueryProvider({ children }: { children: React.ReactNode }) {
    const [client] = useState(() => new QueryClient({
        defaultOptions: {
            queries: {
                retry: (failureCount, error) =>
                    !(error instanceof ApiError && error.status >= 400 && error.status < 500) && failureCount < 2,
                refetchOnWindowFocus: false,
            },
        },
    }))
    return <QueryClientProvider client={client}>{children}</QueryClientProvider>
}
