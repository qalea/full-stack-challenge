'use client';

export default function NotesError({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col items-start gap-4 p-6">
      <h1 className="text-lg font-semibold">Something went wrong</h1>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        We couldn&apos;t load your notes. Please try again.
      </p>
      <button
        onClick={reset}
        className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
      >
        Retry
      </button>
    </main>
  );
}
