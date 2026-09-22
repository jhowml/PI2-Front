export type PaginatedMeta = {
  total: number
  page: number
  pageSize: number
  totalPages: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

export type PaginatedResponse<T> = {
  data: T[]
  meta: PaginatedMeta
}
