'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';
import { useDebounce } from '@/shared/hooks/use-debounce';
import type { Category } from '../db/schema';

const inputClass =
  'w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900';

export function NotesToolbar({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();

  const setParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value);
    else params.delete(key);
    startTransition(() => router.replace(`${pathname}?${params}`));
  };

  const debouncedSearch = useDebounce((v: string) => setParam('q', v), 300);

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <input
        type="search"
        aria-label="Search notes"
        placeholder="Search notes…"
        defaultValue={searchParams.get('q') ?? ''}
        onChange={(e) => debouncedSearch(e.target.value)}
        className={inputClass}
      />
      <select
        aria-label="Filter by category"
        defaultValue={searchParams.get('categoryId') ?? ''}
        onChange={(e) => setParam('categoryId', e.target.value)}
        className={`${inputClass} sm:w-56`}
      >
        <option value="">All categories</option>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>
      <span
        aria-hidden
        className={`text-xs text-zinc-400 transition-opacity ${pending ? 'opacity-100' : 'opacity-0'}`}
      >
        Searching…
      </span>
    </div>
  );
}
