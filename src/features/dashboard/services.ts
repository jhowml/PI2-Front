import { apiClient, ApiRoute } from "@/shared/lib/api-client"
import type { DashboardIndicadores } from "./types"

export interface GetDashboardParams {
    from?: string
    to?: string
}

export function getDashboard(params: GetDashboardParams = {}) {
    return apiClient.get<DashboardIndicadores>(ApiRoute.Dashboard, { ...params })
}
