'use server';

import { revalidatePath, refresh } from 'next/cache';
import { z } from 'zod';
import { db } from './db';
import { notes } from './db/schema';
import { createNoteSchema } from './notes-schemas';

export type CreateNoteState = { ok?: boolean; errors?: Record<string, string[]> };

export async function createNote(
  _prev: CreateNoteState,
  formData: FormData,
): Promise<CreateNoteState> {
  const parsed = createNoteSchema.safeParse({
    title: formData.get('title'),
    body: formData.get('body'),
    categoryId: formData.get('categoryId'),
  });

  if (!parsed.success) {
    return { errors: z.flattenError(parsed.error).fieldErrors };
  }

  // Re-validated server-side: actions are reachable via direct POST, not just the UI.
  await db.insert(notes).values(parsed.data);

  revalidatePath('/notes'); // invalidate server cache
  refresh(); // refresh client router

  return { ok: true };
}
