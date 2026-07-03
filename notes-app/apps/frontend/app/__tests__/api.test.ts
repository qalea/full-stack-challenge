import { describe, it, expect, vi, beforeEach } from 'vitest'

// Declare the mock before any module import so vi.mock hoisting can pick it up
const mockFetch = vi.fn()

vi.mock('@/lib/api.config', () => ({
  API_BASE_URL: 'http://localhost:3001',
  ENDPOINTS: {
    notes: {
      list: '/notes',
      create: '/notes',
      byId: (id: string) => `/notes/${id}`,
      update: (id: string) => `/notes/${id}`,
      remove: (id: string) => `/notes/${id}`,
    },
  },
}))

import { apiClient } from '@/lib/api'

const makeResponse = (body: unknown, status = 200) =>
  ({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(body),
  }) as Response

beforeEach(() => {
  mockFetch.mockReset()
  vi.stubGlobal('fetch', mockFetch)
})

describe('apiClient.get', () => {
  it('calls fetch with the correct URL and returns JSON', async () => {
    mockFetch.mockResolvedValue(makeResponse({ id: '1' }))

    const result = await apiClient.get<{ id: string }>('/notes/1')

    expect(mockFetch).toHaveBeenCalledWith(
      'http://localhost:3001/notes/1',
      expect.objectContaining({ method: 'GET' }),
    )
    expect(result).toEqual({ id: '1' })
  })

  it('throws an error with the server message when response is not ok', async () => {
    mockFetch.mockResolvedValue(makeResponse({ message: 'Not found' }, 404))

    await expect(apiClient.get('/notes/missing')).rejects.toThrow('Not found')
  })
})

describe('apiClient.post', () => {
  it('sends JSON body and returns created resource', async () => {
    mockFetch.mockResolvedValue(makeResponse({ id: 'new-1' }, 201))

    const result = await apiClient.post<{ id: string }>('/notes', { title: 'New' })

    expect(mockFetch).toHaveBeenCalledWith(
      'http://localhost:3001/notes',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'New' }),
      }),
    )
    expect(result).toEqual({ id: 'new-1' })
  })
})

describe('apiClient.put', () => {
  it('sends updated body and returns the updated resource', async () => {
    mockFetch.mockResolvedValue(makeResponse({ id: '1', title: 'Updated' }))

    const result = await apiClient.put<{ id: string; title: string }>('/notes/1', {
      title: 'Updated',
    })

    expect(mockFetch).toHaveBeenCalledWith(
      'http://localhost:3001/notes/1',
      expect.objectContaining({ method: 'PUT' }),
    )
    expect(result.title).toBe('Updated')
  })
})

describe('apiClient.delete', () => {
  it('returns undefined for a 204 response', async () => {
    mockFetch.mockResolvedValue(makeResponse(null, 204))

    const result = await apiClient.delete<void>('/notes/1')

    expect(result).toBeUndefined()
  })

  it('throws an error with the server message on a non-ok response', async () => {
    mockFetch.mockResolvedValue(makeResponse({ message: 'Forbidden' }, 403))

    await expect(apiClient.delete('/notes/1')).rejects.toThrow('Forbidden')
  })
})
