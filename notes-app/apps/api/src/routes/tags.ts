import { Router, Request, Response, NextFunction, IRouter } from 'express'
import { z } from 'zod'
import { prisma } from '../db/client'

export const tagsRouter: IRouter = Router()

const createTagSchema = z.object({
  name: z.string().min(1, 'Name is required').max(50),
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, 'Color must be a valid hex color')
    .optional()
    .default('#6366f1'),
})

// GET /tags
tagsRouter.get('/', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const tags = await prisma.tag.findMany({ orderBy: { name: 'asc' } })
    res.json({ tags })
  } catch (err) {
    next(err)
  }
})

// POST /tags
tagsRouter.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body = createTagSchema.parse(req.body)
    const tag = await prisma.tag.create({ data: { name: body.name, color: body.color } })
    res.status(201).json(tag)
  } catch (err) {
    next(err)
  }
})

// DELETE /tags/:id
tagsRouter.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const exists = await prisma.tag.count({ where: { id: req.params.id } })
    if (!exists) {
      return next(Object.assign(new Error('Tag not found'), { status: 404 }))
    }

    await prisma.tag.delete({ where: { id: req.params.id } })
    res.status(204).send()
  } catch (err) {
    next(err)
  }
})
