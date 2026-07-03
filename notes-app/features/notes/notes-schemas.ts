import { z } from 'zod';

export const createNoteSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(200),
  body: z.string().trim().max(10_000).optional().default(''),
  // <select> sends '' for "no category" → null; otherwise a positive int
  categoryId: z.preprocess(
    (v) => (v === '' || v == null ? null : Number(v)),
    z.number().int().positive().nullable(),
  ),
});

export type CreateNoteInput = z.infer<typeof createNoteSchema>;

export const noteIdSchema = z.coerce.number().int().positive();

export const updateNoteSchema = createNoteSchema.extend({
  id: noteIdSchema,
});

export const notesFilterSchema = z.object({
  q: z.preprocess(
    (v) => (typeof v === 'string' && v.trim() ? v.trim() : undefined),
    z.string().optional(),
  ),
  categoryId: z.coerce.number().int().positive().optional().catch(undefined),
});

export type NotesFilter = z.infer<typeof notesFilterSchema>;
