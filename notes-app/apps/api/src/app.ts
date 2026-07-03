import express, { Express } from 'express'
import cors, { CorsOptions } from 'cors'
import { notesRouter } from './routes/notes'
import { tagsRouter } from './routes/tags'
import { errorHandler, notFound } from './middleware/errorHandler'

const patternToRegExp = (pattern: string): RegExp =>
  new RegExp(`^${pattern.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*')}$`)

const parseCorsOrigins = (): CorsOptions['origin'] => {
  const raw = process.env.CORS_ORIGIN || 'http://localhost:3000'
  const origins = raw
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean)

  if (origins.some((origin) => origin.includes('*'))) {
    return (origin, callback) => {
      if (!origin) return callback(null, true)

      const allowed = origins.some((pattern) =>
        pattern.includes('*') ? patternToRegExp(pattern).test(origin) : pattern === origin,
      )

      callback(null, allowed)
    }
  }

  return origins.length === 1 ? origins[0] : origins
}

export const createApp = (): Express => {
  const app = express()

  app.use(cors({ origin: parseCorsOrigins(), credentials: true }))
  app.use(express.json())

  app.get('/health', (_req, res) => res.json({ status: 'ok' }))

  app.use('/notes', notesRouter)
  app.use('/tags', tagsRouter)

  app.use(notFound)
  app.use(errorHandler)

  return app
}
