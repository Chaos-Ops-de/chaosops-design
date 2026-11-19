import { describe, expect, it } from 'vitest';
import {
  EMPTY_CELL, ariaSortFor, cardRoles, compareValues, cycleSort, flipDirection, formatCell, isEmptyCell,
  pickCardColumns, pinOffsets, shouldTruncate, sortOptions, sortRows,
} from './dataTableLogic';

interface Row { id: number; name: string | null; amount: number | null; day?: Date; ok?: boolean }

const cols = [{ key: 'name' }, { key: 'amount', numeric: true }];
const rows: Row[] = [
  { id: 1, name: 'Halle 10', amount: 5 },
  { id: 2, name: 'halle 2', amount: 20 },
  { id: 3, name: null, amount: 1 },
  { id: 4, name: 'Bühne', amount: null },
  { id: 5, name: 'Bühne', amount: 20 },
];

describe('dataTable/cell formatting', () => {
  it('shows an en dash for null, undefined, blank text and non-finite numbers', () => {
    for (const v of [null, undefined, '', '   ', NaN, Infinity]) {
      expect(isEmptyCell(v)).toBe(true);
      expect(formatCell(v)).toBe(EMPTY_CELL);
    }
    expect(EMPTY_CELL).toBe('–');
  });

  it('treats 0 and false as values', () => {
    expect(isEmptyCell(0)).toBe(false);
    expect(formatCell(0)).toBe('0');
    expect(formatCell(false)).toBe('false');
  });

  it('stringifies text and numbers as they are', () => {
    expect(formatCell('Halle 1')).toBe('Halle 1');
    expect(formatCell(12.5)).toBe('12.5');
  });
});

describe('dataTable/truncation', () => {
  it('truncates only text columns, never numeric ones', () => {
    expect(shouldTruncate({ truncate: true })).toBe(true);
    expect(shouldTruncate({ truncate: true, numeric: true })).toBe(false);
    expect(shouldTruncate({})).toBe(false);
  });
});

describe('dataTable/cycleSort', () => {
  it('goes none -> asc -> desc -> none on one column', () => {
    const a = cycleSort(null, 'name');
    expect(a).toEqual({ key: 'name', direction: 'asc' });
    const b = cycleSort(a, 'name');
    expect(b).toEqual({ key: 'name', direction: 'desc' });
    expect(cycleSort(b, 'name')).toBeNull();
  });

  it('starts a different column at asc', () => {
    expect(cycleSort({ key: 'name', direction: 'desc' }, 'amount')).toEqual({ key: 'amount', direction: 'asc' });
  });

  it('maps to aria-sort, with none for every other column', () => {
    const s = { key: 'name', direction: 'desc' as const };
    expect(ariaSortFor(s, 'name')).toBe('descending');
    expect(ariaSortFor({ key: 'name', direction: 'asc' }, 'name')).toBe('ascending');
    expect(ariaSortFor(s, 'amount')).toBe('none');
    expect(ariaSortFor(null, 'name')).toBe('none');
  });

  it('flips a direction', () => {
    expect(flipDirection('asc')).toBe('desc');
    expect(flipDirection('desc')).toBe('asc');
  });
});

describe('dataTable/compareValues', () => {
  it('compares numbers numerically, not as text', () => {
    expect(compareValues(9, 10)).toBeLessThan(0);
  });

  it('compares strings locale-aware, ignoring case, with embedded numbers as numbers', () => {
    expect(compareValues('Halle 2', 'Halle 10')).toBeLessThan(0);
    expect(compareValues('bühne', 'Bühne')).toBe(0);
    expect(compareValues('Ärger', 'Zebra', 'de-DE')).toBeLessThan(0);
  });

  it('compares dates by time and booleans false first', () => {
    expect(compareValues(new Date(2026, 0, 1), new Date(2026, 0, 2))).toBeLessThan(0);
    expect(compareValues(false, true)).toBeLessThan(0);
  });

  it('reads numeric strings as numbers in a numeric column', () => {
    expect(compareValues('9', '10', 'de-DE', true)).toBeLessThan(0);
  });
});

describe('dataTable/sortRows', () => {
  it('returns a copy in incoming order for no sort or an unknown key', () => {
    const out = sortRows(rows, cols, null);
    expect(out).toEqual(rows);
    expect(out).not.toBe(rows);
    expect(sortRows(rows, cols, { key: 'nope', direction: 'asc' }).map((r) => r.id)).toEqual([1, 2, 3, 4, 5]);
  });

  it('sorts text ascending with natural number order, empty last', () => {
    const out = sortRows(rows, cols, { key: 'name', direction: 'asc' });
    expect(out.map((r) => r.id)).toEqual([4, 5, 2, 1, 3]);
  });

  it('sorts descending but still sinks empty cells to the bottom', () => {
    const out = sortRows(rows, cols, { key: 'name', direction: 'desc' });
    expect(out.map((r) => r.id)).toEqual([1, 2, 4, 5, 3]);
  });

  it('is stable: equal values keep their incoming order in both directions', () => {
    const asc = sortRows(rows, cols, { key: 'amount', direction: 'asc' }).map((r) => r.id);
    expect(asc).toEqual([3, 1, 2, 5, 4]);
    const desc = sortRows(rows, cols, { key: 'amount', direction: 'desc' }).map((r) => r.id);
    expect(desc).toEqual([2, 5, 1, 3, 4]);
  });

  it('does not mutate the input', () => {
    const copy = rows.map((r) => ({ ...r }));
    sortRows(rows, cols, { key: 'amount', direction: 'desc' });
    expect(rows).toEqual(copy);
  });

  it('uses a column value accessor when given', () => {
    const accessorCols = [{ key: 'x', value: (r: Row) => r.amount }];
    const out = sortRows(rows, accessorCols, { key: 'x', direction: 'asc' });
    expect(out[0]!.id).toBe(3);
  });

  it('sorts dates and booleans', () => {
    const items: Row[] = [
      { id: 1, name: 'a', amount: 0, day: new Date(2026, 5, 2), ok: true },
      { id: 2, name: 'b', amount: 0, day: new Date(2026, 5, 1), ok: false },
    ];
    expect(sortRows(items, [{ key: 'day' }], { key: 'day', direction: 'asc' }).map((r) => r.id)).toEqual([2, 1]);
    expect(sortRows(items, [{ key: 'ok' }], { key: 'ok', direction: 'asc' }).map((r) => r.id)).toEqual([2, 1]);
  });
});

describe('dataTable/pickCardColumns', () => {
  it('takes the first column as identity and the first numeric column as amount', () => {
    const c = [{ key: 'name' }, { key: 'status' }, { key: 'total', numeric: true }, { key: 'tax', numeric: true }];
    const p = pickCardColumns(c);
    expect(p.identity?.key).toBe('name');
    expect(p.amount?.key).toBe('total');
    expect(p.rest.map((x) => x.key)).toEqual(['status', 'tax']);
  });

  it('never makes the identity column the amount, even when it is numeric', () => {
    const c = [{ key: 'id', numeric: true }, { key: 'total', numeric: true }];
    const p = pickCardColumns(c);
    expect(p.identity?.key).toBe('id');
    expect(p.amount?.key).toBe('total');
  });

  it('handles no numeric column and no columns', () => {
    expect(pickCardColumns([{ key: 'a' }, { key: 'b' }]).amount).toBeUndefined();
    expect(pickCardColumns([])).toEqual({ identity: undefined, amount: undefined, rest: [] });
  });

  it('labels each column with its card role', () => {
    const roles = cardRoles([{ key: 'name' }, { key: 'status' }, { key: 'total', numeric: true }]);
    expect(roles).toEqual({ name: 'identity', status: 'rest', total: 'amount' });
  });
});

describe('dataTable/pinOffsets', () => {
  it('offsets later pinned columns by the widths of earlier ones', () => {
    const c = [{ key: 'a', pin: true, width: 120 }, { key: 'b', pin: true, width: 80 }, { key: 'c', pin: true, width: 50 }, { key: 'd' }];
    expect(pinOffsets(c)).toEqual({ a: 0, b: 120, c: 200 });
  });

  it('leaves out pins that follow a pinned column without a numeric width', () => {
    const c = [{ key: 'a', pin: true, width: '10rem' }, { key: 'b', pin: true, width: 80 }];
    expect(pinOffsets(c)).toEqual({ a: 0 });
  });

  it('returns nothing when no column is pinned', () => {
    expect(pinOffsets([{ key: 'a' }, { key: 'b' }])).toEqual({});
  });
});

describe('dataTable/sortOptions', () => {
  it('lists sortable columns by label, then string header, then key', () => {
    const c = [
      { key: 'name', header: 'Name', sortable: true },
      { key: 'x', header: 42, label: 'Zahl', sortable: true },
      { key: 'y', header: 42, sortable: true },
      { key: 'z', header: 'Nicht', sortable: false },
    ];
    expect(sortOptions(c)).toEqual([
      { key: 'name', label: 'Name' },
      { key: 'x', label: 'Zahl' },
      { key: 'y', label: 'y' },
    ]);
  });
});
