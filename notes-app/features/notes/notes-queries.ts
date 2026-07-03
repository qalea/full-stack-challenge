import 'server-only';
import { cache } from 'react';
import { desc } from 'drizzle-orm';
import { db } from './db';
import { categories, notes } from './db/schema';

export const getNotes = cache(() =>
  db.query.notes.findMany({
    with: { category: true },
    orderBy: [desc(notes.updatedAt)],
  }),
);

export const getCategories = cache(() =>
  db.select().from(categories).orderBy(categories.name),
);
