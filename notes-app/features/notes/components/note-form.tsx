'use client';

import { useActionState } from 'react';
import type { Category } from '../db/schema';
import { createNote, type NoteFormState } from '../notes-actions';
import { NoteFields } from './note-fields';

export function NoteForm({ categories }: { categories: Category[] }) {
  const [state, action, pending] = useActionState<NoteFormState, FormData>(
    createNote,
    {},
  );

  return (
    // React 19 auto-resets a form action's fields to their defaultValue after submit:
    // on success `state.values` is undefined → fields clear; on error the echoed values
    // become the defaults → the user's input is preserved.
    <form
      action={action}
      className="flex flex-col gap-3 rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
    >
      <NoteFields
        categories={categories}
        errors={state.errors}
        defaultValues={state.values}
      />

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
        >
          {pending ? 'Saving…' : 'Add note'}
        </button>
      </div>
    </form>
  );
}
