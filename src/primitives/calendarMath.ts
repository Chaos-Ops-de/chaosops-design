// Pure date helpers behind <Calendar>; no React / platform APIs.

export interface CalendarCell {
  date: Date;
  /** Belongs to the displayed month (false for leading/trailing filler days). */
  inMonth: boolean;
}

/** Monday-first weekday labels (German). */
export const WEEKDAY_LABELS = ['M', 'D', 'M', 'D', 'F', 'S', 'S'] as const;

/** "2026-02-01"; local calendar date, no timezone shift. */
export function toDateKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function isSameDay(a: Date, b: Date): boolean {
  return toDateKey(a) === toDateKey(b);
}

/** Full weeks (Monday-first) covering the month of `month`; always a multiple of 7 cells. */
export function buildMonthGrid(month: Date): CalendarCell[] {
  const first = new Date(month.getFullYear(), month.getMonth(), 1);
  const lead = (first.getDay() + 6) % 7; // Mon = 0
  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const total = Math.ceil((lead + daysInMonth) / 7) * 7;
  return Array.from({ length: total }, (_, i) => {
    const date = new Date(month.getFullYear(), month.getMonth(), 1 - lead + i);
    return { date, inMonth: date.getMonth() === month.getMonth() };
  });
}

/** Month shifted by `delta` months, pinned to the 1st. */
export function addMonths(month: Date, delta: number): Date {
  return new Date(month.getFullYear(), month.getMonth() + delta, 1);
}

/** Number of lit ticks for a 0–1 `ratio` on a ring of `total` ticks (clamped, rounded). */
export function litTicks(ratio: number, total: number): number {
  if (!Number.isFinite(ratio)) return 0;
  return Math.round(Math.min(1, Math.max(0, ratio)) * total);
}

/** Clamp `value` to [min, max]. */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
