'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { NoteWithTags, CreateNoteInput, UpdateNoteInput } from '@notes/types'
import { apiClient } from '@/lib/api'
import { ENDPOINTS } from '@/lib/api.config'
import { QUERY_KEYS } from '@/lib/query.config'
import { buildQueryString } from '@/utils/helpers'

export const useGetNotesQuery = (q?: string) =>
  useQuery({
    queryKey: QUERY_KEYS.notes(q),
    queryFn: () =>
      apiClient.get<{ notes: NoteWithTags[] }>(ENDPOINTS.notes.list + buildQueryString({ q })),
  })

export const useGetNoteQuery = (id: string) =>
  useQuery({
    queryKey: QUERY_KEYS.note(id),
    queryFn: () => apiClient.get<NoteWithTags>(ENDPOINTS.notes.byId(id)),
    enabled: !!id,
  })

export const useCreateNoteQuery = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateNoteInput) =>
      apiClient.post<NoteWithTags>(ENDPOINTS.notes.create, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['notes'] })
    },
  })
}

export const useUpdateNoteQuery = (id: string) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: UpdateNoteInput) =>
      apiClient.put<NoteWithTags>(ENDPOINTS.notes.update(id), data),
    onSuccess: (updated) => {
      qc.setQueryData(QUERY_KEYS.note(id), updated)
      qc.invalidateQueries({ queryKey: ['notes'] })
    },
  })
}

export const useDeleteNoteQuery = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => apiClient.delete<void>(ENDPOINTS.notes.remove(id)),
    onSuccess: (_data, deletedId) => {
      qc.removeQueries({ queryKey: QUERY_KEYS.note(deletedId) })
    },
  })
}
