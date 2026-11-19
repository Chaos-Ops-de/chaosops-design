// Pure date logic behind <DatePicker> / <DateRangePicker>; no React / DOM.
//
// Days are ISO strings ("2026-02-01"), treated as plain calendar dates: all
// arithmetic goes through UTC fields, never `toISOString()` or local-time
// math, so nothing shifts across timezones or daylight-saving changes.
// (Sits next to primitives/calendarMath, which serves the native <Calendar>
// with Date objects and a fixed Monday start.)

export type ISODate = string;

export interface DateRange {
  start: ISODate;
  end: ISODate;
}

/** A range being picked: `end: null` means the first click has landed and the second is pending. */
export interface DateRangeDraft {
  start: ISODate | null;
  end: ISODate | null;
}

/** 0 = Sunday ... 6 = Saturday. */
export type WeekStart = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface YearMonth {
  year: number;
  /** 1-12. */
  month: number;
}

export interface MonthCell {
  iso: ISODate;
  inMonth: boolean;
  day: number;
}

const ISO_RE = /^(\d{4})-(\d{2})-(\d{2})$/;
const DAY_MS = 86_400_000;

/** A UTC Date for a calendar day; `setUTCFullYear` keeps years below 100 intact. */
function utc(year: number, month: number, day: number): Date {
  const d = new Date(0);
  d.setUTCFullYear(year, month - 1, day);
  return d;
}

export function daysInMonth(year: number, month: number): number {
  return utc(year, month + 1, 0).getUTCDate();
}

export function isLeapYear(year: number): boolean {
  return daysInMonth(year, 2) === 29;
}

export function formatISO(year: number, month: number, day: number): ISODate {
  return `${String(year).padStart(4, '0')}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

/** Parses "YYYY-MM-DD" into parts, or `null` for anything that is not a real calendar date. */
export function parseISO(value: string): { year: number; month: number; day: number } | null {
  const m = ISO_RE.exec(value);
  if (!m) return null;
  const year = Number(m[1]);
  const month = Number(m[2]);
  const day = Number(m[3]);
  if (month < 1 || month > 12 || day < 1 || day > daysInMonth(year, month)) return null;
  return { year, month, day };
}

export function isValidISO(value: string | null | undefined): value is ISODate {
  return typeof value === 'string' && parseISO(value) !== null;
}

function mustParse(iso: ISODate) {
  const parts = parseISO(iso);
  if (!parts) throw new RangeError(`Invalid ISO date: ${iso}`);
  return parts;
}

function fromUTC(d: Date): ISODate {
  return formatISO(d.getUTCFullYear(), d.getUTCMonth() + 1, d.getUTCDate());
}

/** Today's local calendar date. */
export function todayISO(now: Date = new Date()): ISODate {
  return formatISO(now.getFullYear(), now.getMonth() + 1, now.getDate());
}

export function addDays(iso: ISODate, n: number): ISODate {
  const { year, month, day } = mustParse(iso);
  return fromUTC(utc(year, month, day + n));
}

/** Shifts by whole months, keeping the day when it exists and clamping to the month's end otherwise (31 Jan + 1 = 28/29 Feb). */
export function addMonths(iso: ISODate, n: number): ISODate {
  const { year, month, day } = mustParse(iso);
  const index = year * 12 + (month - 1) + n;
  const y = Math.floor(index / 12);
  const m = (index % 12 + 12) % 12 + 1;
  return formatISO(y, m, Math.min(day, daysInMonth(y, m)));
}

/** Shifts by whole years; 29 Feb lands on 28 Feb in a non-leap year. */
export function addYears(iso: ISODate, n: number): ISODate {
  return addMonths(iso, n * 12);
}

/** 0 = Sunday ... 6 = Saturday. */
export function weekdayOf(iso: ISODate): WeekStart {
  const { year, month, day } = mustParse(iso);
  return utc(year, month, day).getUTCDay() as WeekStart;
}

export function startOfWeek(iso: ISODate, weekStartsOn: WeekStart = 1): ISODate {
  return addDays(iso, -((weekdayOf(iso) - weekStartsOn + 7) % 7));
}

export function endOfWeek(iso: ISODate, weekStartsOn: WeekStart = 1): ISODate {
  return addDays(startOfWeek(iso, weekStartsOn), 6);
}

export function compareISO(a: ISODate, b: ISODate): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

/** Whole days from `a` to `b` (negative when `b` is earlier). */
export function daysBetween(a: ISODate, b: ISODate): number {
  const pa = mustParse(a);
  const pb = mustParse(b);
  return Math.round((utc(pb.year, pb.month, pb.day).getTime() - utc(pa.year, pa.month, pa.day).getTime()) / DAY_MS);
}

/** Full weeks covering a month: always a multiple of 7 cells, beginning on `weekStartsOn`. */
export function monthGrid(year: number, month: number, weekStartsOn: WeekStart = 1): MonthCell[] {
  const first = formatISO(year, month, 1);
  const last = formatISO(year, month, daysInMonth(year, month));
  const start = startOfWeek(first, weekStartsOn);
  const end = endOfWeek(last, weekStartsOn);
  const count = daysBetween(start, end) + 1;
  return Array.from({ length: count }, (_, i) => {
    const iso = addDays(start, i);
    const parts = mustParse(iso);
    return { iso, inMonth: parts.year === year && parts.month === month, day: parts.day };
  });
}

/** Splits a month grid into weeks of 7. */
export function chunkWeeks(cells: readonly MonthCell[]): MonthCell[][] {
  const weeks: MonthCell[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}

export function shiftMonth(anchor: YearMonth, delta: number): YearMonth {
  const index = anchor.year * 12 + (anchor.month - 1) + delta;
  return { year: Math.floor(index / 12), month: ((index % 12) + 12) % 12 + 1 };
}

/** `count` consecutive months starting at `anchor`. */
export function visibleMonths(anchor: YearMonth, count: number): YearMonth[] {
  return Array.from({ length: Math.max(1, count) }, (_, i) => shiftMonth(anchor, i));
}

export function monthOf(iso: ISODate): YearMonth {
  const { year, month } = mustParse(iso);
  return { year, month };
}

/** True when a day falls inside the months currently shown. */
export function isMonthVisible(iso: ISODate, anchor: YearMonth, count: number): boolean {
  const { year, month } = monthOf(iso);
  const offset = (year - anchor.year) * 12 + (month - anchor.month);
  return offset >= 0 && offset < Math.max(1, count);
}

/** Moves the anchor the least needed so `iso` is visible. */
export function anchorToReveal(iso: ISODate, anchor: YearMonth, count: number): YearMonth {
  const target = monthOf(iso);
  const offset = (target.year - anchor.year) * 12 + (target.month - anchor.month);
  if (offset < 0) return target;
  if (offset >= count) return shiftMonth(target, -(count - 1));
  return anchor;
}

export function orderRange(a: ISODate, b: ISODate): DateRange {
  return compareISO(a, b) <= 0 ? { start: a, end: b } : { start: b, end: a };
}

/** Inclusive on both ends; false for an incomplete range. */
export function isInRange(day: ISODate, range: { start: ISODate | null; end: ISODate | null } | null | undefined): boolean {
  if (!range || !range.start || !range.end) return false;
  return compareISO(day, range.start) >= 0 && compareISO(day, range.end) <= 0;
}

export function isCompleteDraft(draft: DateRangeDraft | null | undefined): draft is { start: ISODate; end: ISODate } {
  return Boolean(draft && draft.start && draft.end);
}

/**
 * One click in a range picker. The first click (or any click after a finished
 * range) starts a new range; the second ends it. Clicking earlier than the
 * start swaps the two, and clicking the same day makes a one-day range.
 */
export function applyDayClick(draft: DateRangeDraft | null | undefined, day: ISODate): DateRangeDraft {
  if (!draft || !draft.start || draft.end) return { start: day, end: null };
  return orderRange(draft.start, day);
}

/** The range painted while hovering a candidate end day; `null` when no first click is pending. */
export function hoverPreview(draft: DateRangeDraft | null | undefined, hoverDay: ISODate | null | undefined): DateRange | null {
  if (!draft || !draft.start || draft.end || !hoverDay) return null;
  return orderRange(draft.start, hoverDay);
}

export function isDisabledDay(day: ISODate, min?: ISODate | null, max?: ISODate | null): boolean {
  return Boolean((min && compareISO(day, min) < 0) || (max && compareISO(day, max) > 0));
}

/** Pulls a day inside [min, max]. */
export function clampToBounds(day: ISODate, min?: ISODate | null, max?: ISODate | null): ISODate {
  if (min && compareISO(day, min) < 0) return min;
  if (max && compareISO(day, max) > 0) return max;
  return day;
}

export interface MoveFocusOptions {
  /** With Page Up / Page Down: jump a year instead of a month. */
  shift?: boolean;
  weekStartsOn?: WeekStart;
  /** Right-to-left layouts swap what Arrow Left and Arrow Right mean. */
  rtl?: boolean;
}

/** Where keyboard focus goes from `day` for a navigation key, or `null` when the key is not a navigation key. */
export function moveFocus(day: ISODate, key: string, options: MoveFocusOptions = {}): ISODate | null {
  const { shift = false, weekStartsOn = 1, rtl = false } = options;
  switch (key) {
    case 'ArrowLeft': return addDays(day, rtl ? 1 : -1);
    case 'ArrowRight': return addDays(day, rtl ? -1 : 1);
    case 'ArrowUp': return addDays(day, -7);
    case 'ArrowDown': return addDays(day, 7);
    case 'PageUp': return shift ? addYears(day, -1) : addMonths(day, -1);
    case 'PageDown': return shift ? addYears(day, 1) : addMonths(day, 1);
    case 'Home': return startOfWeek(day, weekStartsOn);
    case 'End': return endOfWeek(day, weekStartsOn);
    default: return null;
  }
}

export type DateRangePresetId = 'today' | 'yesterday' | 'last7' | 'last30' | 'lastQuarter' | 'custom';

export interface DateRangePreset {
  id: DateRangePresetId;
  label: string;
  /** `null` for "custom": the user picks the days. */
  range: DateRange | null;
}

/** The previous full calendar quarter. */
export function lastQuarter(today: ISODate): DateRange {
  const { year, month } = mustParse(today);
  const currentStart = Math.floor((month - 1) / 3) * 3 + 1;
  let startMonth = currentStart - 3;
  let startYear = year;
  if (startMonth < 1) {
    startMonth += 12;
    startYear -= 1;
  }
  const endMonth = startMonth + 2;
  return { start: formatISO(startYear, startMonth, 1), end: formatISO(startYear, endMonth, daysInMonth(startYear, endMonth)) };
}

/** Presets cover most real ranges; "Benutzerdefiniert" leaves the rest to the calendar. The last-N presets end today and include it. */
export function dateRangePresets(today: ISODate): DateRangePreset[] {
  return [
    { id: 'today', label: 'Heute', range: { start: today, end: today } },
    { id: 'yesterday', label: 'Gestern', range: { start: addDays(today, -1), end: addDays(today, -1) } },
    { id: 'last7', label: 'Letzte 7 Tage', range: { start: addDays(today, -6), end: today } },
    { id: 'last30', label: 'Letzte 30 Tage', range: { start: addDays(today, -29), end: today } },
    { id: 'lastQuarter', label: 'Letztes Quartal', range: lastQuarter(today) },
    { id: 'custom', label: 'Benutzerdefiniert', range: null },
  ];
}

/** Which preset (if any) a range equals; custom ranges give `'custom'`. */
export function matchPreset(range: DateRange | null | undefined, presets: readonly DateRangePreset[]): DateRangePresetId | null {
  if (!range) return null;
  const hit = presets.find((p) => p.range && p.range.start === range.start && p.range.end === range.end);
  return hit ? hit.id : 'custom';
}

/** "Mo", "Di", ... in the order the grid shows them (trailing dots dropped to keep headers compact). */
export function weekdayLabels(locale = 'de-DE', weekStartsOn: WeekStart = 1): string[] {
  const fmt = new Intl.DateTimeFormat(locale, { weekday: 'short', timeZone: 'UTC' });
  // 2023-01-01 was a Sunday.
  return Array.from({ length: 7 }, (_, i) => {
    const dayOfWeek = (weekStartsOn + i) % 7;
    return fmt.format(utc(2023, 1, 1 + dayOfWeek)).replace(/\.$/, '');
  });
}

export function monthLabel(year: number, month: number, locale = 'de-DE'): string {
  return new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(utc(year, month, 1));
}

/** "01.02.2026" in the locale's short numeric form. */
export function formatISODate(iso: ISODate, locale = 'de-DE'): string {
  const { year, month, day } = mustParse(iso);
  return new Intl.DateTimeFormat(locale, { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'UTC' }).format(utc(year, month, day));
}

/** "1. Februar 2026": the spoken form, for accessible names. */
export function formatISODateLong(iso: ISODate, locale = 'de-DE'): string {
  const { year, month, day } = mustParse(iso);
  return new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(utc(year, month, day));
}

export function formatRange(range: DateRange, locale = 'de-DE'): string {
  return range.start === range.end
    ? formatISODate(range.start, locale)
    : `${formatISODate(range.start, locale)} – ${formatISODate(range.end, locale)}`;
}

/** Locales whose week starts on Sunday when `Intl` cannot tell us. */
const SUNDAY_FIRST = /^(en-US|en-CA|en-AU|ja|ko|zh|he|pt-BR|es-MX)\b/i;

/** First day of the week for a locale: Monday for German, from `Intl.Locale` week info where available. */
export function weekStartsOnForLocale(locale = 'de-DE'): WeekStart {
  try {
    const loc = new Intl.Locale(locale) as Intl.Locale & {
      weekInfo?: { firstDay: number };
      getWeekInfo?: () => { firstDay: number };
    };
    const info = loc.getWeekInfo?.() ?? loc.weekInfo;
    if (info && info.firstDay >= 1 && info.firstDay <= 7) return (info.firstDay % 7) as WeekStart;
  } catch {
    // Unknown or malformed locale: fall through to the table.
  }
  return SUNDAY_FIRST.test(locale) ? 0 : 1;
}

// ---------------------------------------------------------------------------
// Typed dates
// ---------------------------------------------------------------------------

export type DatePart = 'day' | 'month' | 'year';

/** The order a locale writes a numeric date in: German is day, month, year; US English month, day, year. */
export function dateOrder(locale = 'de-DE'): DatePart[] {
  const parts = new Intl.DateTimeFormat(locale, { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'UTC' })
    .formatToParts(utc(2001, 11, 23));
  const order = parts.map((p) => p.type).filter((t): t is DatePart => t === 'day' || t === 'month' || t === 'year');
  return order.length === 3 ? order : ['day', 'month', 'year'];
}

/** The separator the locale puts between the numbers (".", "/", "-"). */
function dateSeparator(locale: string): string {
  const parts = new Intl.DateTimeFormat(locale, { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'UTC' })
    .formatToParts(utc(2001, 11, 23));
  return parts.find((p) => p.type === 'literal')?.value.trim() || '.';
}

/** Hint for an empty date field: "TT.MM.JJJJ" in German, "MM/DD/YYYY" in US English. */
export function typedDatePlaceholder(locale = 'de-DE'): string {
  const german = /^de\b/i.test(locale);
  const label: Record<DatePart, string> = german
    ? { day: 'TT', month: 'MM', year: 'JJJJ' }
    : { day: 'DD', month: 'MM', year: 'YYYY' };
  return dateOrder(locale).map((p) => label[p]).join(dateSeparator(locale));
}

function expandYear(digits: string): number | null {
  if (digits.length === 4) return Number(digits);
  if (digits.length === 2) {
    const yy = Number(digits);
    return yy <= 69 ? 2000 + yy : 1900 + yy;
  }
  return null;
}

/**
 * Reads a date someone typed or pasted into an ISO day, or `null` when it is
 * not a real calendar date. Accepts the locale's order with any of `.`, `/`,
 * `-` or spaces ("18.11.2026", "18/11/26"), a compact run of digits
 * ("18112026"), and ISO ("2026-11-18") whatever the locale.
 */
export function parseTypedDate(text: string, locale = 'de-DE'): ISODate | null {
  const value = text.trim();
  if (!value) return null;

  const iso = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(value);
  if (iso) return finishTyped(Number(iso[1]), Number(iso[2]), Number(iso[3]));

  const order = dateOrder(locale);
  let groups: string[];
  if (/^\d{8}$/.test(value)) {
    // Compact: the year takes four digits wherever the locale puts it.
    const sizes = order.map((p) => (p === 'year' ? 4 : 2));
    let at = 0;
    groups = sizes.map((n) => { const g = value.slice(at, at + n); at += n; return g; });
  } else if (/^\d{6}$/.test(value)) {
    groups = order.map((_, i) => value.slice(i * 2, i * 2 + 2));
  } else {
    groups = value.split(/[.\-/\s]+/).filter(Boolean);
    if (groups.length !== 3 || !groups.every((g) => /^\d{1,4}$/.test(g))) return null;
  }

  const byPart = {} as Record<DatePart, string>;
  order.forEach((part, i) => { byPart[part] = groups[i]!; });
  const year = expandYear(byPart.year);
  if (year === null) return null;
  return finishTyped(year, Number(byPart.month), Number(byPart.day));
}

function finishTyped(year: number, month: number, day: number): ISODate | null {
  const iso = formatISO(year, month, day);
  return parseISO(iso) && year >= 1000 ? iso : null;
}

// ---------------------------------------------------------------------------
// Dragging a range edge
// ---------------------------------------------------------------------------

export type RangeEdge = 'start' | 'end';

/**
 * Moves one edge of a finished range to `day`. Dragging an edge past the other
 * one swaps the roles, so the range stays ordered and the edge being dragged
 * becomes the other one.
 */
export function dragRangeEdge(range: DateRange, edge: RangeEdge, day: ISODate): { range: DateRange; edge: RangeEdge } {
  if (edge === 'start') {
    return compareISO(day, range.end) > 0
      ? { range: { start: range.end, end: day }, edge: 'end' }
      : { range: { start: day, end: range.end }, edge: 'start' };
  }
  return compareISO(day, range.start) < 0
    ? { range: { start: day, end: range.start }, edge: 'start' }
    : { range: { start: range.start, end: day }, edge: 'end' };
}
