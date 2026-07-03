import { describe, it, expect, vi } from 'vitest'
import { Request, Response, NextFunction } from 'express'
import { ZodError, ZodIssue } from 'zod'
import { errorHandler, notFound, AppError } from './errorHandler'

const mockReq = {} as Request
const mockNext = vi.fn() as unknown as NextFunction

const makeRes = () => {
  const res = {
    status: vi.fn(),
    json: vi.fn(),
    send: vi.fn(),
  } as unknown as Response
  ;(res.status as ReturnType<typeof vi.fn>).mockReturnValue(res)
  return res
}

describe('errorHandler', () => {
  it('returns 400 with structured errors for a ZodError', () => {
    const res = makeRes()
    const zodErr = new ZodError([
      {
        code: 'too_small',
        path: ['title'],
        message: 'Title is required',
        minimum: 1,
        type: 'string',
        inclusive: true,
      } as ZodIssue,
    ])

    errorHandler(zodErr, mockReq, res, mockNext)

    expect((res.status as ReturnType<typeof vi.fn>).mock.calls[0][0]).toBe(400)
    expect((res.json as ReturnType<typeof vi.fn>).mock.calls[0][0]).toMatchObject({
      message: 'Validation error',
      errors: [{ path: 'title', message: 'Title is required' }],
    })
  })

  it('uses the status from AppError when provided', () => {
    const res = makeRes()
    const err: AppError = Object.assign(new Error('Not found'), { status: 404 })

    errorHandler(err, mockReq, res, mockNext)

    expect((res.status as ReturnType<typeof vi.fn>).mock.calls[0][0]).toBe(404)
    expect((res.json as ReturnType<typeof vi.fn>).mock.calls[0][0]).toMatchObject({
      message: 'Not found',
    })
  })

  it('defaults to 500 for unknown errors', () => {
    const res = makeRes()
    const err = new Error('Unexpected boom')

    const spy = vi.spyOn(console, 'error').mockImplementation(() => undefined)
    errorHandler(err, mockReq, res, mockNext)
    spy.mockRestore()

    expect((res.status as ReturnType<typeof vi.fn>).mock.calls[0][0]).toBe(500)
  })
})

describe('notFound', () => {
  it('returns 404 with a message', () => {
    const res = makeRes()
    notFound(mockReq, res)

    expect((res.status as ReturnType<typeof vi.fn>).mock.calls[0][0]).toBe(404)
    expect((res.json as ReturnType<typeof vi.fn>).mock.calls[0][0]).toMatchObject({
      message: 'Route not found',
    })
  })
})
