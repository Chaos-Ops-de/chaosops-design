import { describe, expect, it } from 'vitest';
import { addMonths, buildMonthGrid, clamp, isSameDay, litTicks, toDateKey } from './calendarMath';

describe('buildMonthGrid', () => {
  it('starts on Monday and covers whole weeks', () => {
    const grid = buildMonthGrid(new Date(2026, 1, 15)); // Feb 2026 starts on a Sunday
    expect(grid.length % 7).toBe(0);
    expect(grid[0]!.date.getDay()).toBe(1);
    expect(toDateKey(grid[0]!.date)).toBe('2026-01-26');
    expect(grid.filter((c) => c.inMonth)).toHaveLength(28);
  });

  it('has no leading filler when the month starts on Monday', () => {
    const grid = buildMonthGrid(new Date(2026, 5, 1)); // June 2026 starts on a Monday
    expect(grid[0]!.inMonth).toBe(true);
    expect(toDateKey(grid[0]!.date)).toBe('2026-06-01');
  });
});

describe('date helpers', () => {
  it('compares calendar days and shifts months across years', () => {
    expect(isSameDay(new Date(2026, 0, 5, 1), new Date(2026, 0, 5, 23))).toBe(true);
    expect(toDateKey(addMonths(new Date(2026, 11, 20), 1))).toBe('2027-01-01');
    expect(toDateKey(addMonths(new Date(2026, 0, 31), -1))).toBe('2025-12-01');
  });
});

describe('litTicks / clamp', () => {
  it('rounds and clamps the ratio', () => {
    expect(litTicks(0.15, 40)).toBe(6);
    expect(litTicks(2, 40)).toBe(40);
    expect(litTicks(-1, 40)).toBe(0);
    expect(litTicks(NaN, 40)).toBe(0);
  });
  it('clamps numbers', () => {
    expect(clamp(5, 0, 3)).toBe(3);
    expect(clamp(-5, 0, 3)).toBe(0);
  });
});
