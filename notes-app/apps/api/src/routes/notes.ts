import { Router, Request, Response, NextFunction, IRouter } from 'express'
import { z } from 'zod'
import { prisma } from '../db/client'
import { noteInclude, formatNote, getStringParam } from '../utils/helpers'

export const notesRouter: IRouter = Router()

const createNoteSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  content: z.string().optional().default(''),
  tagIds: z.array(z.string()).optional().default([]),
})

const updateNoteSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  content: z.string().optional(),
  tagIds: z.array(z.string()).optional(),
})

// GET /notes?q=&tagId=
notesRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const q = getStringParam(req.query.q)
    const tagId = getStringParam(req.query.tagId)

    const notes = await prisma.note.findMany({
      where: {
        AND: [
          q
            ? {
                OR: [
                  { title: { contains: q, mode: 'insensitive' } },
                  { content: { contains: q, mode: 'insensitive' } },
                ],
              }
            : {},
          tagId ? { noteTags: { some: { tagId } } } : {},
        ],
      },
      include: noteInclude,
      orderBy: { updatedAt: 'desc' },
    })

    res.json({ notes: notes.map(formatNote) })
  } catch (err) {
    next(err)
  }
})

// GET /notes/:id
notesRouter.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const note = await prisma.note.findUnique({
      where: { id: req.params.id },
      include: noteInclude,
    })

    if (!note) {
      return next(Object.assign(new Error('Note not found'), { status: 404 }))
    }

    res.json(formatNote(note))
  } catch (err) {
    next(err)
  }
})

// POST /notes
notesRouter.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body = createNoteSchema.parse(req.body)

    const note = await prisma.note.create({
      data: {
        title: body.title,
        content: body.content,
        noteTags: { create: body.tagIds.map((tagId) => ({ tagId })) },
      },
      include: noteInclude,
    })

    res.status(201).json(formatNote(note))
  } catch (err) {
    next(err)
  }
})

// PUT /notes/:id
notesRouter.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body = updateNoteSchema.parse(req.body)

    const exists = await prisma.note.count({ where: { id: req.params.id } })
    if (!exists) {
      return next(Object.assign(new Error('Note not found'), { status: 404 }))
    }

    const note = await prisma.note.update({
      where: { id: req.params.id },
      data: {
        ...(body.title !== undefined && { title: body.title }),
        ...(body.content !== undefined && { content: body.content }),
        ...(body.tagIds !== undefined && {
          noteTags: {
            deleteMany: {},
            create: body.tagIds.map((tagId) => ({ tagId })),
          },
        }),
      },
      include: noteInclude,
    })

    res.json(formatNote(note))
  } catch (err) {
    next(err)
  }
})

// DELETE /notes/:id
notesRouter.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const exists = await prisma.note.count({ where: { id: req.params.id } })
    if (!exists) {
      return next(Object.assign(new Error('Note not found'), { status: 404 }))
    }

    await prisma.note.delete({ where: { id: req.params.id } })
    res.status(204).send()
  } catch (err) {
    next(err)
  }
})
