import { describe, it, expect, vi, beforeEach } from 'vitest'
import request from 'supertest'
import { createApp } from '../app'

vi.mock('../db/client', () => ({
  prisma: {
    tag: {
      findMany: vi.fn(),
      create: vi.fn(),
      delete: vi.fn(),
      count: vi.fn(),
    },
  },
}))

import { prisma } from '../db/client'

const fixedDate = new Date('2024-01-15T12:00:00.000Z')

const makeDbTag = (overrides = {}) => ({
  id: 'tag-1',
  name: 'work',
  color: '#6366f1',
  createdAt: fixedDate,
  ...overrides,
})

const app = createApp()

beforeEach(() => {
  vi.clearAllMocks()
})

describe('GET /tags', () => {
  it('returns an array of tags', async () => {
    vi.mocked(prisma.tag.findMany).mockResolvedValue([makeDbTag()] as never)

    const res = await request(app).get('/tags')

    expect(res.status).toBe(200)
    expect(res.body.tags).toHaveLength(1)
    expect(res.body.tags[0]).toMatchObject({ id: 'tag-1', name: 'work' })
  })
})

describe('POST /tags', () => {
  it('creates a tag and returns 201', async () => {
    vi.mocked(prisma.tag.create).mockResolvedValue(makeDbTag() as never)

    const res = await request(app).post('/tags').send({ name: 'work', color: '#6366f1' })

    expect(res.status).toBe(201)
    expect(res.body).toMatchObject({ id: 'tag-1', name: 'work' })
  })

  it('returns 400 when name is missing', async () => {
    const res = await request(app).post('/tags').send({ color: '#6366f1' })

    expect(res.status).toBe(400)
    expect(res.body.message).toBe('Validation error')
  })

  it('returns 400 for an invalid hex color', async () => {
    const res = await request(app).post('/tags').send({ name: 'bad', color: 'notacolor' })

    expect(res.status).toBe(400)
  })
})

describe('DELETE /tags/:id', () => {
  it('deletes the tag and returns 204', async () => {
    vi.mocked(prisma.tag.count).mockResolvedValue(1 as never)
    vi.mocked(prisma.tag.delete).mockResolvedValue(makeDbTag() as never)

    const res = await request(app).delete('/tags/tag-1')

    expect(res.status).toBe(204)
  })

  it('returns 404 when the tag does not exist', async () => {
    vi.mocked(prisma.tag.count).mockResolvedValue(0 as never)

    const res = await request(app).delete('/tags/missing')

    expect(res.status).toBe(404)
  })
})
