export type PageItem = number | 'gap';

/** Total number of pages for `total` rows; there is always at least one. */
export function totalPages(total: number, pageSize: number): number {
  if (!Number.isFinite(total) || total <= 0 || pageSize <= 0) return 1;
  return Math.max(1, Math.ceil(total / pageSize));
}

/**
 * First and last row number shown on `page` (1-based, inclusive), for a
 * summary like "1–25 von 100". `{ from: 0, to: 0 }` when there are no rows.
 * An out-of-range page is clamped to the last one.
 */
export function pageRange(page: number, pageSize: number, total: number): { from: number; to: number } {
  if (total <= 0 || pageSize <= 0) return { from: 0, to: 0 };
  const pages = totalPages(total, pageSize);
  const current = Math.min(Math.max(1, Math.floor(page)), pages);
  const from = (current - 1) * pageSize + 1;
  const to = Math.min(total, current * pageSize);
  return { from, to };
}

const range = (from: number, to: number): number[] =>
  Array.from({ length: Math.max(0, to - from + 1) }, (_, i) => from + i);

export interface PageItemsInput {
  page: number;
  totalPages: number;
  /** Pages shown on each side of the current one (default 1). */
  siblings?: number;
}

/**
 * The page links to render: always the first and last page, the current page
 * with `siblings` on each side, and a `'gap'` marker where pages are left out.
 * A gap never stands in for a single page (that page is shown instead), and
 * once there are more than `2 * siblings + 5` pages the list is always exactly
 * that long, so the control doesn't change width as you page through.
 */
export function pageItems({ page, totalPages: total, siblings = 1 }: PageItemsInput): PageItem[] {
  const count = Math.max(1, Math.floor(total));
  const s = Math.max(0, Math.floor(siblings));
  const current = Math.min(Math.max(1, Math.floor(page)), count);

  // first + last + current + both siblings + two gap slots
  if (count <= 2 * s + 5) return range(1, count);

  const left = Math.max(current - s, 1);
  const right = Math.min(current + s, count);
  const gapLeft = left > 3;
  const gapRight = right < count - 2;
  const edgeCount = 3 + 2 * s;

  if (!gapLeft && gapRight) return [...range(1, edgeCount), 'gap', count];
  if (gapLeft && !gapRight) return [1, 'gap', ...range(count - edgeCount + 1, count)];
  return [1, 'gap', ...range(left, right), 'gap', count];
}
