"use client"

import { useQuery } from "@tanstack/react-query"
import { getDashboard, GetDashboardParams } from "../services"

export function useDashboard(params: GetDashboardParams = {}) {
    const { data, isLoading, error } = useQuery({
        queryKey: ["dashboard", params],
        queryFn: () => getDashboard(params),
    })

    return { dashboard: data ?? null, loading: isLoading, error: error?.message ?? null }
}
