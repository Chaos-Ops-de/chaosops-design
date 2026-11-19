// Pure logic behind <DataTable>; no React / DOM.

export type SortDirection = 'asc' | 'desc';

export interface SortState {
  key: string;
  direction: SortDirection;
}

/** The slice of a column the logic needs. */
export interface ColumnLike<T = unknown> {
  key: string;
  numeric?: boolean;
  sortable?: boolean;
  truncate?: boolean;
  pin?: boolean;
  /** Overrides `row[key]` for sorting and plain-text rendering. */
  value?: (row: T) => unknown;
  /** Pixel width (or any CSS width); only a number can offset a following pinned column. */
  width?: number | string;
}

/** En dash shown for an empty cell, so "missing" never reads as a blank. */
export const EMPTY_CELL = '–';

/** Empty means null, undefined, blank text or a non-finite number. A literal 0 or `false` is a value. */
export function isEmptyCell(value: unknown): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim() === '';
  if (typeof value === 'number') return !Number.isFinite(value);
  return false;
}

/** Plain-text form of a cell value; empty cells become an en dash. */
export function formatCell(value: unknown): string {
  if (isEmptyCell(value)) return EMPTY_CELL;
  if (value instanceof Date) return value.toLocaleDateString('de-DE');
  return String(value);
}

/** Numbers never truncate (a clipped figure is a wrong figure); only text columns may. */
export function shouldTruncate(column: Pick<ColumnLike, 'truncate' | 'numeric'>): boolean {
  return Boolean(column.truncate) && !column.numeric;
}

/** none -> asc -> desc -> none; a different column always starts at asc. */
export function cycleSort(current: SortState | null | undefined, key: string): SortState | null {
  if (!current || current.key !== key) return { key, direction: 'asc' };
  if (current.direction === 'asc') return { key, direction: 'desc' };
  return null;
}

export function ariaSortFor(sort: SortState | null | undefined, key: string): 'ascending' | 'descending' | 'none' {
  if (!sort || sort.key !== key) return 'none';
  return sort.direction === 'asc' ? 'ascending' : 'descending';
}

const toComparable = (value: unknown): number | string | boolean => {
  if (value instanceof Date) return value.getTime();
  if (typeof value === 'number' || typeof value === 'boolean' || typeof value === 'string') return value;
  return String(value);
};

/**
 * Orders two non-empty values: numbers numerically, dates by time, booleans
 * false-first, strings locale-aware with embedded numbers compared as numbers
 * ("Halle 2" before "Halle 10") and case ignored.
 */
export function compareValues(a: unknown, b: unknown, locale = 'de-DE', numeric = false): number {
  const x = toComparable(a);
  const y = toComparable(b);
  if (typeof x === 'number' && typeof y === 'number') return x - y;
  if (typeof x === 'boolean' && typeof y === 'boolean') return Number(x) - Number(y);
  if (numeric) {
    // A numeric column can hold numeric strings ("1.250,50" is not parsed; plain "12" is).
    const nx = Number(x);
    const ny = Number(y);
    if (Number.isFinite(nx) && Number.isFinite(ny)) return nx - ny;
  }
  return String(x).localeCompare(String(y), locale, { numeric: true, sensitivity: 'base' });
}

function readValue<T>(row: T, column: ColumnLike<T>): unknown {
  if (column.value) return column.value(row);
  return (row as Record<string, unknown>)[column.key];
}

/**
 * Returns a sorted copy. Stable (equal rows keep their incoming order, in both
 * directions) and empty cells always sink to the bottom whichever way you sort.
 * An unknown sort key or `null` returns the rows in their incoming order.
 */
export function sortRows<T>(
  rows: readonly T[],
  columns: ReadonlyArray<ColumnLike<T>>,
  sort: SortState | null | undefined,
  locale = 'de-DE',
): T[] {
  const column = sort ? columns.find((c) => c.key === sort.key) : undefined;
  if (!sort || !column) return [...rows];
  const dir = sort.direction === 'asc' ? 1 : -1;

  return rows
    .map((row, index) => ({ row, index, value: readValue(row, column) }))
    .sort((p, q) => {
      const pe = isEmptyCell(p.value);
      const qe = isEmptyCell(q.value);
      if (pe || qe) {
        if (pe && qe) return p.index - q.index;
        return pe ? 1 : -1;
      }
      const c = compareValues(p.value, q.value, locale, column.numeric) * dir;
      return c !== 0 ? c : p.index - q.index;
    })
    .map((entry) => entry.row);
}

export interface CardColumns<C> {
  /** First column: names the row. */
  identity: C | undefined;
  /** First numeric column (other than the identity): the figure shown top right. */
  amount: C | undefined;
  /** Everything else, in order. */
  rest: C[];
}

/** Splits columns into the roles a phone card shows. */
export function pickCardColumns<C extends Pick<ColumnLike, 'key' | 'numeric'>>(columns: readonly C[]): CardColumns<C> {
  const identity = columns[0];
  const amount = columns.find((c, i) => i > 0 && c.numeric);
  const rest = columns.filter((c) => c !== identity && c !== amount);
  return { identity, amount, rest };
}

export type CardRole = 'identity' | 'amount' | 'rest';

/** Role of a column in the card layout, keyed by column key. */
export function cardRoles<C extends Pick<ColumnLike, 'key' | 'numeric'>>(columns: readonly C[]): Record<string, CardRole> {
  const { identity, amount } = pickCardColumns(columns);
  const roles: Record<string, CardRole> = {};
  for (const c of columns) roles[c.key] = c === identity ? 'identity' : c === amount ? 'amount' : 'rest';
  return roles;
}

/**
 * Sticky offsets (px) for pinned columns, keyed by column key. A pinned column
 * sits after the pinned columns before it, so every earlier pinned column needs
 * a numeric width; if one lacks it, later pins have no reliable offset and are
 * left out (the map then simply has no entry for them).
 */
export function pinOffsets<C extends Pick<ColumnLike, 'key' | 'pin' | 'width'>>(columns: readonly C[]): Record<string, number> {
  const offsets: Record<string, number> = {};
  let acc = 0;
  for (const c of columns) {
    if (!c.pin) continue;
    offsets[c.key] = acc;
    if (typeof c.width !== 'number') break;
    acc += c.width;
  }
  return offsets;
}

export interface SortOption {
  key: string;
  label: string;
}

/** Options for the phone sort control: one per sortable column. */
export function sortOptions<C extends Pick<ColumnLike, 'key' | 'sortable'> & { label?: string; header?: unknown }>(columns: readonly C[]): SortOption[] {
  return columns
    .filter((c) => c.sortable)
    .map((c) => ({ key: c.key, label: c.label ?? (typeof c.header === 'string' ? c.header : c.key) }));
}

/** Flips a sort direction. */
export function flipDirection(direction: SortDirection): SortDirection {
  return direction === 'asc' ? 'desc' : 'asc';
}
