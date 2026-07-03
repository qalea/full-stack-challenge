import { Request, Response, NextFunction } from 'express'
import { ZodError } from 'zod'

export interface AppError extends Error {
  status?: number
}

export const errorHandler = (
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  if (err instanceof ZodError) {
    res.status(400).json({
      message: 'Validation error',
      errors: err.errors.map((e) => ({ path: e.path.join('.'), message: e.message })),
    })
    return
  }

  const status = err.status ?? 500
  const message = err.message ?? 'Internal server error'

  if (status === 500) {
    console.error('[Error]', err)
  }

  res.status(status).json({ message })
}

export const notFound = (_req: Request, res: Response): void => {
  res.status(404).json({ message: 'Route not found' })
}
