import 'server-only';
import { cache } from 'react';
import { and, desc, eq, ilike, or } from 'drizzle-orm';
import { db } from './db';
import { categories, notes } from './db/schema';
import type { NotesFilter } from './notes-schemas';

export const getNotes = cache((filter?: NotesFilter) => {
  const where = [];
  if (filter?.q) {
    where.push(
      or(ilike(notes.title, `%${filter.q}%`), ilike(notes.body, `%${filter.q}%`)),
    );
  }
  if (filter?.categoryId) where.push(eq(notes.categoryId, filter.categoryId));

  return db.query.notes.findMany({
    where: where.length ? and(...where) : undefined,
    with: { category: true },
    orderBy: [desc(notes.updatedAt)],
  });
});

export const getCategories = cache(() =>
  db.select().from(categories).orderBy(categories.name),
);

export type NoteWithCategory = Awaited<ReturnType<typeof getNotes>>[number];
