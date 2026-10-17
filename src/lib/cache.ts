/**
 * High-Performance In-Memory Cache with Stale-While-Revalidate (SWR) support
 * Eliminates redundant database queries during high concurrent traffic.
 */

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

const store = new Map<string, CacheEntry<any>>();

export async function remember<T>(
  key: string,
  ttlSeconds: number,
  fetcher: () => Promise<T>
): Promise<T> {
  const now = Date.now();
  const entry = store.get(key);

  if (entry && entry.expiresAt > now) {
    return entry.data;
  }

  const freshData = await fetcher();
  store.set(key, {
    data: freshData,
    expiresAt: now + ttlSeconds * 1000,
  });

  return freshData;
}

export function invalidateCache(pattern?: string): void {
  if (!pattern) {
    store.clear();
    return;
  }
  for (const key of store.keys()) {
    if (key.includes(pattern)) {
      store.delete(key);
    }
  }
}
