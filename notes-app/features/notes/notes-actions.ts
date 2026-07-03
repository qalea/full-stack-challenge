'use server';

import { revalidatePath, refresh } from 'next/cache';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { db } from './db';
import { notes } from './db/schema';
import {
  createNoteSchema,
  noteIdSchema,
  updateNoteSchema,
} from './notes-schemas';

export type NoteFieldValues = {
  title: string;
  body: string;
  categoryId: number | null;
};

export type NoteFormState = {
  ok?: boolean;
  errors?: Record<string, string[]>;
  // Echoed back on error so the form keeps what the user typed (React 19
  // auto-resets a form action's fields to their defaultValue on submit).
  values?: NoteFieldValues;
};

function rawValues(formData: FormData): NoteFieldValues {
  const categoryId = formData.get('categoryId');
  return {
    title: String(formData.get('title') ?? ''),
    body: String(formData.get('body') ?? ''),
    categoryId: categoryId ? Number(categoryId) : null,
  };
}

function revalidate() {
  revalidatePath('/notes'); // invalidate server cache
  refresh(); // refresh client router
}

export async function createNote(
  _prev: NoteFormState,
  formData: FormData,
): Promise<NoteFormState> {
  const parsed = createNoteSchema.safeParse({
    title: formData.get('title'),
    body: formData.get('body'),
    categoryId: formData.get('categoryId'),
  });

  if (!parsed.success) {
    return { errors: z.flattenError(parsed.error).fieldErrors, values: rawValues(formData) };
  }

  // Re-validated server-side: actions are reachable via direct POST, not just the UI.
  await db.insert(notes).values(parsed.data);

  revalidate();
  return { ok: true };
}

export async function updateNote(
  _prev: NoteFormState,
  formData: FormData,
): Promise<NoteFormState> {
  const parsed = updateNoteSchema.safeParse({
    id: formData.get('id'),
    title: formData.get('title'),
    body: formData.get('body'),
    categoryId: formData.get('categoryId'),
  });

  if (!parsed.success) {
    return { errors: z.flattenError(parsed.error).fieldErrors, values: rawValues(formData) };
  }

  const { id, ...values } = parsed.data;
  const rows = await db
    .update(notes)
    .set({ ...values, updatedAt: new Date() })
    .where(eq(notes.id, id))
    .returning({ id: notes.id }); // confirm a row was actually affected

  if (!rows.length) return { errors: { id: ['Note not found'] } };

  revalidate();
  return { ok: true };
}

export async function deleteNote(id: number): Promise<void> {
  const noteId = noteIdSchema.parse(id); // validate id
  const rows = await db
    .delete(notes)
    .where(eq(notes.id, noteId))
    .returning({ id: notes.id }); // confirm a row was actually affected

  if (!rows.length) throw new Error('Note not found');

  revalidate();
}
