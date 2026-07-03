import { useCallback, useRef } from 'react';

/** Returns a debounced version of `fn` — no `useEffect`, timer kept in a ref. */
export function useDebounce<A extends unknown[]>(
  fn: (...args: A) => void,
  delay = 300,
) {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  return useCallback(
    (...args: A) => {
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => fn(...args), delay);
    },
    [fn, delay],
  );
}
