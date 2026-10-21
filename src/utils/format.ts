// Platform-neutral formatting helpers (no DOM / React Native APIs), German by default.
// Merged from ChaosOps_Mobile_App/src/utils/{format,date}.ts and
// ChaosOps/src/utils/{dateTime,formatElapsed}.ts.
//
// Reconciliation: the mobile and web copies both exported `formatDate` /
// `formatDateTime` with different signatures (ISO string vs. Date) and slightly
// different output ("01.02.2026" vs. "1.2.2026"). The merged versions accept
// `string | number | Date` and follow the mobile output (zero-padded), which is
// what the mobile app's tests pin.

export const DEFAULT_LOCALE = 'de-DE';

export type DateInput = string | number | Date;

function toDate(input: DateInput | null | undefined): Date | null {
  if (input == null) return null;
  const d = input instanceof Date ? input : new Date(input);
  return Number.isNaN(d.getTime()) ? null : d;
}

/** "01.02.2026"; empty string for invalid/missing input. */
export function formatDate(input: DateInput | null | undefined, locale: string = DEFAULT_LOCALE): string {
  const d = toDate(input);
  if (!d) return '';
  return d.toLocaleDateString(locale, { day: '2-digit', month: '2-digit', year: 'numeric' });
}

/** "01.02.26, 14:05"; empty string for invalid/missing input. */
export function formatDateTime(input: DateInput | null | undefined, locale: string = DEFAULT_LOCALE): string {
  const d = toDate(input);
  if (!d) return '';
  return d.toLocaleString(locale, { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' });
}

/** "14:05"; empty string for invalid/missing input. */
export function formatTime(input: DateInput | null | undefined, locale: string = DEFAULT_LOCALE): string {
  const d = toDate(input);
  if (!d) return '';
  return d.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' });
}

/** Human-readable byte size with German decimal comma: "1,5 KB". `null`/`undefined` → "–". */
export function formatBytes(bytes: number | null | undefined): string {
  if (bytes == null) return '–';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1).replace('.', ',')} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1).replace('.', ',')} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2).replace('.', ',')} GB`;
}

/** "2d 3h" for ≥ 1 day, otherwise "3h 20m". */
export function formatUptime(seconds: number): string {
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return d > 0 ? `${d}d ${h}h` : `${h}h ${m}m`;
}

/** "gerade eben" / "vor 5 Min." / "vor 3 Std." / "vor 2 Tg." relative to `now`. */
export function timeAgo(iso: DateInput, now: number = Date.now()): string {
  const mins = Math.floor((now - new Date(iso).getTime()) / 60_000);
  if (mins < 1) return 'gerade eben';
  if (mins < 60) return `vor ${mins} Min.`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `vor ${hours} Std.`;
  return `vor ${Math.floor(hours / 24)} Tg.`;
}

/** Elapsed milliseconds as "gerade eben" / "vor 15 Sek." / "vor 2 Min." / "vor 3 Std.". */
export function formatElapsed(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  if (seconds < 1) return 'gerade eben';
  if (seconds < 60) return `vor ${seconds} Sek.`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `vor ${minutes} Min.`;
  const hours = Math.floor(minutes / 60);
  return `vor ${hours} Std.`;
}

/** Keeps a date text field to digits and inserts the dashes ("20260714" → "2026-07-14"). */
export function formatDateInput(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 4) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 4)}-${digits.slice(4)}`;
  return `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6)}`;
}

/** True for a real calendar date in `YYYY-MM-DD` form. */
export function isValidDate(value: string): boolean {
  const m = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return false;
  const d = new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3])));
  return d.getUTCFullYear() === Number(m[1]) && d.getUTCMonth() === Number(m[2]) - 1 && d.getUTCDate() === Number(m[3]);
}

/** Parses "HH:MM" into a Date set to that time today. */
export function parseTimeString(timeString: string): Date {
  const [hours, minutes] = timeString.split(':').map(Number);
  const date = new Date();
  date.setHours(hours ?? 0, minutes ?? 0, 0, 0);
  return date;
}

export function isTimeBetween(time: Date, start: Date, end: Date): boolean {
  return time >= start && time <= end;
}

/** Whole minutes from `start` to `end` (rounded down). */
export function getMinutesDifference(start: Date, end: Date): number {
  return Math.floor((end.getTime() - start.getTime()) / (1000 * 60));
}
