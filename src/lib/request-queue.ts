// Share a concurrency limit across both library shelves, without timed delays.
export function createRequestQueue(limit: number) {
  if (!Number.isInteger(limit) || limit < 1) throw new Error("Invalid request limit.");
  let active = 0;
  const waiting: (() => void)[] = [];
  return async function run<T>(task: () => Promise<T>): Promise<T> {
    if (active < limit) active += 1;
    else await new Promise<void>((resolve) => waiting.push(resolve));
    try {
      return await task();
    } finally {
      const next = waiting.shift();
      if (next) next();
      else active -= 1;
    }
  };
}
