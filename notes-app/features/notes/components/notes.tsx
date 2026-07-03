import { Suspense } from 'react';
import { getCategories } from '../notes-queries';
import { NoteForm } from './note-form';
import { NoteList, NoteListSkeleton } from './note-list';

export async function Notes() {
  const categories = await getCategories();

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-6 p-6">
      <h1 className="text-2xl font-semibold tracking-tight">Notes</h1>
      <NoteForm categories={categories} />
      <Suspense fallback={<NoteListSkeleton />}>
        <NoteList categories={categories} />
      </Suspense>
    </main>
  );
}
