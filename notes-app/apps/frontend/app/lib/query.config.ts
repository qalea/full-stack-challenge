'use client'

import { QueryClient } from '@tanstack/react-query'

export const QUERY_DEFAULTS = {
  staleTime: 1000 * 60 * 2, // 2 min — data considered fresh
  gcTime: 1000 * 60 * 10, // 10 min — cache garbage collection
  retry: 1, // one retry on failure
  refetchOnWindowFocus: false,
} as const

export const QUERY_KEYS = {
  notes: (q?: string) => ['notes', { q }] as const,
  note: (id: string) => ['notes', id] as const,
} as const

export const queryClient = new QueryClient({
  defaultOptions: { queries: QUERY_DEFAULTS },
})
