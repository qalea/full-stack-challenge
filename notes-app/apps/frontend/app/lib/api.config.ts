export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL!

export const ENDPOINTS = {
  notes: {
    list: '/notes',
    create: '/notes',
    byId: (id: string) => `/notes/${id}`,
    update: (id: string) => `/notes/${id}`,
    remove: (id: string) => `/notes/${id}`,
  },
} as const
