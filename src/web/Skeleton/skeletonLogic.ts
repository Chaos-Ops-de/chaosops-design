/**
 * Whether a loading state should be visible yet. Under the delay nothing is
 * shown: a flash of loading UI for a fast response reads as a bug.
 */
export function shouldShowLoading(elapsedMs: number, delayMs: number, loading: boolean): boolean {
  return loading && elapsedMs >= delayMs;
}

/** Milliseconds left before a loading state may appear (0 once it may). */
export function msUntilShow(elapsedMs: number, delayMs: number): number {
  return Math.max(0, delayMs - elapsedMs);
}
