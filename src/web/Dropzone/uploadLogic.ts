// Pure logic behind `useUploads` and `xhrUpload`; no React / DOM.
import type { UploadStatus } from './UploadList';

/**
 * Indices of the queued items that may start now, in list order, so that at
 * most `maxConcurrent` uploads run at once. One failing or slow file never
 * holds back the others: only the number of running uploads is limited.
 */
export function nextToStart(items: ReadonlyArray<{ status: UploadStatus }>, maxConcurrent: number): number[] {
  const limit = Math.max(1, Math.floor(maxConcurrent));
  const running = items.filter((i) => i.status === 'uploading').length;
  const free = Math.max(0, limit - running);
  const out: number[] = [];
  for (let i = 0; i < items.length && out.length < free; i += 1) {
    if (items[i]!.status === 'queued') out.push(i);
  }
  return out;
}

/** Whole percent 0-100 from a transfer event; an unknown total counts as 0. */
export function progressFromEvent(loaded: number, total: number): number {
  if (!Number.isFinite(loaded) || !Number.isFinite(total) || total <= 0) return 0;
  return Math.round(Math.min(100, Math.max(0, (loaded / total) * 100)));
}

/** An upload needs to run this long before a time-left estimate is worth showing. */
export const MIN_ELAPSED_FOR_ESTIMATE_MS = 500;

/**
 * Time left from the pace so far. `null` until there is enough signal (some
 * progress and half a second of elapsed time), so the first frames never show
 * a wild guess.
 */
export function estimateRemainingMs(startedAt: number, now: number, percent: number): number | null {
  const elapsed = now - startedAt;
  if (!Number.isFinite(elapsed) || elapsed < MIN_ELAPSED_FOR_ESTIMATE_MS) return null;
  if (!Number.isFinite(percent) || percent < 1) return null;
  if (percent >= 100) return 0;
  return Math.round((elapsed * (100 - percent)) / percent);
}

/** Human (German) message for a failed HTTP status. */
export function uploadErrorMessage(status: number): string {
  if (status === 413) return 'Datei zu groß für den Server';
  if (status === 401 || status === 403) return 'Keine Berechtigung';
  if (status === 408 || status === 504) return 'Zeitüberschreitung';
  if (status >= 500) return `Serverfehler (${status})`;
  if (status >= 400) return `Upload abgelehnt (${status})`;
  return `Upload fehlgeschlagen (${status})`;
}
