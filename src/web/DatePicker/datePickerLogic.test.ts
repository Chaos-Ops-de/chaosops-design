import { describe, expect, it } from 'vitest';
import {
  addDays, addMonths, addYears, anchorToReveal, applyDayClick, chunkWeeks, clampToBounds, compareISO, dateRangePresets,
  daysBetween, daysInMonth, endOfWeek, formatISO, formatISODate, formatISODateLong, formatRange, hoverPreview, isCompleteDraft,
  isDisabledDay, isInRange, isLeapYear, isMonthVisible, isValidISO, lastQuarter, matchPreset, monthGrid, monthLabel, monthOf,
  moveFocus, orderRange, parseISO, shiftMonth, startOfWeek, todayISO, visibleMonths, weekdayLabels, weekdayOf,
  weekStartsOnForLocale,
} from './datePickerLogic';

describe('datePicker/parse and format', () => {
  it('round-trips a valid date', () => {
    expect(parseISO('2026-02-01')).toEqual({ year: 2026, month: 2, day: 1 });
    expect(formatISO(2026, 2, 1)).toBe('2026-02-01');
    expect(formatISO(99, 1, 5)).toBe('0099-01-05');
  });

  it('rejects malformed and impossible dates', () => {
    for (const bad of ['', '2026-2-1', '2026-13-01', '2026-00-10', '2026-02-30', '2025-02-29', '2026-04-31', 'abc', '2026-02-01T00:00']) {
      expect(parseISO(bad)).toBeNull();
      expect(isValidISO(bad)).toBe(false);
    }
    expect(isValidISO(null)).toBe(false);
    expect(isValidISO('2024-02-29')).toBe(true);
  });

  it('builds today from local calendar fields', () => {
    expect(todayISO(new Date(2026, 0, 31, 23, 59))).toBe('2026-01-31');
    expect(todayISO(new Date(2026, 11, 31, 0, 0))).toBe('2026-12-31');
  });
});

describe('datePicker/month lengths', () => {
  it('knows month lengths and leap years', () => {
    expect(daysInMonth(2026, 1)).toBe(31);
    expect(daysInMonth(2026, 2)).toBe(28);
    expect(daysInMonth(2024, 2)).toBe(29);
    expect(daysInMonth(2026, 4)).toBe(30);
    expect(isLeapYear(2024)).toBe(true);
    expect(isLeapYear(2100)).toBe(false);
    expect(isLeapYear(2000)).toBe(true);
  });
});

describe('datePicker/arithmetic', () => {
  it('adds days across month, year and leap-day boundaries', () => {
    expect(addDays('2026-01-31', 1)).toBe('2026-02-01');
    expect(addDays('2026-12-31', 1)).toBe('2027-01-01');
    expect(addDays('2024-02-28', 1)).toBe('2024-02-29');
    expect(addDays('2025-02-28', 1)).toBe('2025-03-01');
    expect(addDays('2026-03-01', -1)).toBe('2026-02-28');
    expect(addDays('2026-01-01', -1)).toBe('2025-12-31');
    expect(addDays('2026-06-15', 0)).toBe('2026-06-15');
  });

  it('is unaffected by daylight-saving changes in any timezone', () => {
    // European spring-forward (29 Mar 2026) and fall-back (25 Oct 2026), US spring-forward (8 Mar 2026).
    expect(addDays('2026-03-28', 1)).toBe('2026-03-29');
    expect(addDays('2026-03-29', 1)).toBe('2026-03-30');
    expect(addDays('2026-10-24', 2)).toBe('2026-10-26');
    expect(addDays('2026-03-07', 2)).toBe('2026-03-09');
    expect(daysBetween('2026-03-28', '2026-03-30')).toBe(2);
    expect(daysBetween('2026-10-24', '2026-10-26')).toBe(2);
  });

  it('adds months, clamping to the end of a shorter month', () => {
    expect(addMonths('2026-01-31', 1)).toBe('2026-02-28');
    expect(addMonths('2024-01-31', 1)).toBe('2024-02-29');
    expect(addMonths('2026-03-31', -1)).toBe('2026-02-28');
    expect(addMonths('2026-11-15', 2)).toBe('2027-01-15');
    expect(addMonths('2026-01-15', -2)).toBe('2025-11-15');
    expect(addMonths('2026-01-15', 24)).toBe('2028-01-15');
    expect(addMonths('2026-01-15', -13)).toBe('2024-12-15');
  });

  it('adds years, landing 29 Feb on 28 Feb in a non-leap year', () => {
    expect(addYears('2024-02-29', 1)).toBe('2025-02-28');
    expect(addYears('2024-02-29', 4)).toBe('2028-02-29');
    expect(addYears('2026-06-15', -1)).toBe('2025-06-15');
  });

  it('throws on an invalid date instead of guessing', () => {
    expect(() => addDays('nope', 1)).toThrow(RangeError);
  });

  it('counts days between dates, negative when reversed', () => {
    expect(daysBetween('2026-02-01', '2026-02-01')).toBe(0);
    expect(daysBetween('2026-02-01', '2026-03-01')).toBe(28);
    expect(daysBetween('2024-02-01', '2024-03-01')).toBe(29);
    expect(daysBetween('2026-03-01', '2026-02-01')).toBe(-28);
    expect(daysBetween('2025-12-31', '2026-01-01')).toBe(1);
  });

  it('compares ISO strings', () => {
    expect(compareISO('2026-01-01', '2026-01-02')).toBe(-1);
    expect(compareISO('2026-01-02', '2026-01-01')).toBe(1);
    expect(compareISO('2026-01-01', '2026-01-01')).toBe(0);
  });
});

describe('datePicker/weeks', () => {
  it('knows the weekday (0 = Sunday)', () => {
    expect(weekdayOf('2026-02-01')).toBe(0); // Sunday
    expect(weekdayOf('2026-02-02')).toBe(1); // Monday
    expect(weekdayOf('2024-02-29')).toBe(4); // Thursday
  });

  it('finds the start and end of a week for a Monday or Sunday start', () => {
    expect(startOfWeek('2026-02-04', 1)).toBe('2026-02-02');
    expect(endOfWeek('2026-02-04', 1)).toBe('2026-02-08');
    expect(startOfWeek('2026-02-01', 1)).toBe('2026-01-26');
    expect(startOfWeek('2026-02-04', 0)).toBe('2026-02-01');
    expect(endOfWeek('2026-02-04', 0)).toBe('2026-02-07');
    expect(startOfWeek('2026-02-02', 1)).toBe('2026-02-02');
  });
});

describe('datePicker/monthGrid', () => {
  it('returns whole weeks starting on the chosen weekday', () => {
    // Feb 2026 starts on a Sunday, so a Monday-first grid runs 26 Jan to 1 Mar: five weeks.
    expect(monthGrid(2026, 2, 1)).toHaveLength(35);
  });

  it('covers February 2026 (Sun 1 - Sat 28) with leading and trailing filler on a Monday start', () => {
    const cells = monthGrid(2026, 2, 1);
    expect(cells.length % 7).toBe(0);
    expect(cells[0]!.iso).toBe('2026-01-26');
    expect(cells[0]!.inMonth).toBe(false);
    expect(cells[cells.length - 1]!.iso).toBe('2026-03-01');
    expect(cells.filter((c) => c.inMonth)).toHaveLength(28);
  });

  it('needs no filler when a 28-day month lines up with the week', () => {
    // Feb 2027 starts on a Monday and has 28 days.
    const cells = monthGrid(2027, 2, 1);
    expect(cells).toHaveLength(28);
    expect(cells.every((c) => c.inMonth)).toBe(true);
  });

  it('shifts the grid for a Sunday start', () => {
    const cells = monthGrid(2026, 2, 0);
    expect(cells[0]!.iso).toBe('2026-02-01');
    expect(cells).toHaveLength(28);
  });

  it('handles a leap February and a six-week month', () => {
    expect(monthGrid(2024, 2, 1).filter((c) => c.inMonth)).toHaveLength(29);
    // August 2026 starts on a Saturday with 31 days: six weeks on a Monday start.
    expect(monthGrid(2026, 8, 1)).toHaveLength(42);
  });

  it('marks the day number and chunks into weeks of seven', () => {
    const cells = monthGrid(2026, 5, 1);
    expect(cells.find((c) => c.iso === '2026-05-15')!.day).toBe(15);
    const weeks = chunkWeeks(cells);
    expect(weeks.every((w) => w.length === 7)).toBe(true);
    expect(weeks.flat()).toEqual(cells);
  });

  it('crosses the year boundary', () => {
    const cells = monthGrid(2026, 1, 1);
    expect(cells[0]!.iso).toBe('2025-12-29');
    expect(cells[0]!.inMonth).toBe(false);
  });
});

describe('datePicker/visible months', () => {
  it('shifts a month across year boundaries both ways', () => {
    expect(shiftMonth({ year: 2026, month: 12 }, 1)).toEqual({ year: 2027, month: 1 });
    expect(shiftMonth({ year: 2026, month: 1 }, -1)).toEqual({ year: 2025, month: 12 });
    expect(shiftMonth({ year: 2026, month: 3 }, -15)).toEqual({ year: 2024, month: 12 });
    expect(shiftMonth({ year: 2026, month: 3 }, 0)).toEqual({ year: 2026, month: 3 });
  });

  it('lists consecutive months', () => {
    expect(visibleMonths({ year: 2026, month: 11 }, 3)).toEqual([
      { year: 2026, month: 11 }, { year: 2026, month: 12 }, { year: 2027, month: 1 },
    ]);
    expect(visibleMonths({ year: 2026, month: 5 }, 0)).toHaveLength(1);
  });

  it('knows whether a day is in the shown months', () => {
    const anchor = { year: 2026, month: 2 };
    expect(isMonthVisible('2026-02-10', anchor, 2)).toBe(true);
    expect(isMonthVisible('2026-03-31', anchor, 2)).toBe(true);
    expect(isMonthVisible('2026-04-01', anchor, 2)).toBe(false);
    expect(isMonthVisible('2026-01-31', anchor, 2)).toBe(false);
  });

  it('moves the anchor the least needed to reveal a day', () => {
    const anchor = { year: 2026, month: 2 };
    expect(anchorToReveal('2026-03-05', anchor, 2)).toEqual(anchor);
    expect(anchorToReveal('2026-01-05', anchor, 2)).toEqual({ year: 2026, month: 1 });
    expect(anchorToReveal('2026-04-05', anchor, 2)).toEqual({ year: 2026, month: 3 });
    expect(anchorToReveal('2026-08-05', anchor, 3)).toEqual({ year: 2026, month: 6 });
  });

  it('reads the month of a day', () => {
    expect(monthOf('2026-07-19')).toEqual({ year: 2026, month: 7 });
  });
});

describe('datePicker/ranges', () => {
  it('orders two days', () => {
    expect(orderRange('2026-02-01', '2026-02-10')).toEqual({ start: '2026-02-01', end: '2026-02-10' });
    expect(orderRange('2026-02-10', '2026-02-01')).toEqual({ start: '2026-02-01', end: '2026-02-10' });
    expect(orderRange('2026-02-05', '2026-02-05')).toEqual({ start: '2026-02-05', end: '2026-02-05' });
  });

  it('checks membership inclusively and is false for incomplete ranges', () => {
    const r = { start: '2026-02-05', end: '2026-02-10' };
    expect(isInRange('2026-02-05', r)).toBe(true);
    expect(isInRange('2026-02-10', r)).toBe(true);
    expect(isInRange('2026-02-07', r)).toBe(true);
    expect(isInRange('2026-02-04', r)).toBe(false);
    expect(isInRange('2026-02-11', r)).toBe(false);
    expect(isInRange('2026-02-07', { start: '2026-02-05', end: null })).toBe(false);
    expect(isInRange('2026-02-07', null)).toBe(false);
  });

  it('runs a click sequence: start, end, then a fresh start', () => {
    const a = applyDayClick(null, '2026-02-10');
    expect(a).toEqual({ start: '2026-02-10', end: null });
    expect(isCompleteDraft(a)).toBe(false);
    const b = applyDayClick(a, '2026-02-14');
    expect(b).toEqual({ start: '2026-02-10', end: '2026-02-14' });
    expect(isCompleteDraft(b)).toBe(true);
    const c = applyDayClick(b, '2026-03-01');
    expect(c).toEqual({ start: '2026-03-01', end: null });
  });

  it('swaps a reversed second click', () => {
    const a = applyDayClick(null, '2026-02-14');
    expect(applyDayClick(a, '2026-02-10')).toEqual({ start: '2026-02-10', end: '2026-02-14' });
  });

  it('makes a one-day range when the same day is clicked twice', () => {
    const a = applyDayClick(null, '2026-02-14');
    expect(applyDayClick(a, '2026-02-14')).toEqual({ start: '2026-02-14', end: '2026-02-14' });
  });

  it('works across a month and year boundary', () => {
    const a = applyDayClick(undefined, '2026-12-28');
    expect(applyDayClick(a, '2027-01-03')).toEqual({ start: '2026-12-28', end: '2027-01-03' });
  });

  it('previews only while a first click is pending', () => {
    const pending = { start: '2026-02-10', end: null };
    expect(hoverPreview(pending, '2026-02-14')).toEqual({ start: '2026-02-10', end: '2026-02-14' });
    expect(hoverPreview(pending, '2026-02-05')).toEqual({ start: '2026-02-05', end: '2026-02-10' });
    expect(hoverPreview({ start: '2026-02-10', end: '2026-02-12' }, '2026-02-14')).toBeNull();
    expect(hoverPreview(null, '2026-02-14')).toBeNull();
    expect(hoverPreview(pending, null)).toBeNull();
  });
});

describe('datePicker/bounds', () => {
  it('disables days outside min and max', () => {
    expect(isDisabledDay('2026-02-04', '2026-02-05', '2026-02-20')).toBe(true);
    expect(isDisabledDay('2026-02-21', '2026-02-05', '2026-02-20')).toBe(true);
    expect(isDisabledDay('2026-02-05', '2026-02-05', '2026-02-20')).toBe(false);
    expect(isDisabledDay('2026-02-20', '2026-02-05', '2026-02-20')).toBe(false);
    expect(isDisabledDay('2030-01-01')).toBe(false);
    expect(isDisabledDay('2026-02-04', null, null)).toBe(false);
  });

  it('clamps a day into the bounds', () => {
    expect(clampToBounds('2026-02-01', '2026-02-05', '2026-02-20')).toBe('2026-02-05');
    expect(clampToBounds('2026-03-01', '2026-02-05', '2026-02-20')).toBe('2026-02-20');
    expect(clampToBounds('2026-02-10', '2026-02-05', '2026-02-20')).toBe('2026-02-10');
    expect(clampToBounds('2026-02-10')).toBe('2026-02-10');
  });
});

describe('datePicker/moveFocus', () => {
  const day = '2026-02-04'; // Wednesday

  it('moves by day and by week with the arrows', () => {
    expect(moveFocus(day, 'ArrowRight')).toBe('2026-02-05');
    expect(moveFocus(day, 'ArrowLeft')).toBe('2026-02-03');
    expect(moveFocus(day, 'ArrowDown')).toBe('2026-02-11');
    expect(moveFocus(day, 'ArrowUp')).toBe('2026-01-28');
  });

  it('swaps left and right in right-to-left layouts', () => {
    expect(moveFocus(day, 'ArrowRight', { rtl: true })).toBe('2026-02-03');
    expect(moveFocus(day, 'ArrowLeft', { rtl: true })).toBe('2026-02-05');
    expect(moveFocus(day, 'ArrowDown', { rtl: true })).toBe('2026-02-11');
  });

  it('jumps a month, or a year with Shift, clamping the day to the month end', () => {
    expect(moveFocus('2026-01-31', 'PageDown')).toBe('2026-02-28');
    expect(moveFocus('2026-03-31', 'PageUp')).toBe('2026-02-28');
    expect(moveFocus(day, 'PageDown', { shift: true })).toBe('2027-02-04');
    expect(moveFocus(day, 'PageUp', { shift: true })).toBe('2025-02-04');
    expect(moveFocus('2024-02-29', 'PageDown', { shift: true })).toBe('2025-02-28');
  });

  it('goes to the start or end of the week', () => {
    expect(moveFocus(day, 'Home')).toBe('2026-02-02');
    expect(moveFocus(day, 'End')).toBe('2026-02-08');
    expect(moveFocus(day, 'Home', { weekStartsOn: 0 })).toBe('2026-02-01');
    expect(moveFocus(day, 'End', { weekStartsOn: 0 })).toBe('2026-02-07');
  });

  it('crosses a year boundary and ignores other keys', () => {
    expect(moveFocus('2026-12-31', 'ArrowRight')).toBe('2027-01-01');
    expect(moveFocus(day, 'Enter')).toBeNull();
    expect(moveFocus(day, 'a')).toBeNull();
  });
});

describe('datePicker/presets', () => {
  const today = '2026-02-15';
  const byId = (id: string, t = today) => dateRangePresets(t).find((p) => p.id === id)!;

  it('lists the six presets in order, custom last with no range', () => {
    const p = dateRangePresets(today);
    expect(p.map((x) => x.id)).toEqual(['today', 'yesterday', 'last7', 'last30', 'lastQuarter', 'custom']);
    expect(p[p.length - 1]!.range).toBeNull();
    expect(p.map((x) => x.label)).toEqual(['Heute', 'Gestern', 'Letzte 7 Tage', 'Letzte 30 Tage', 'Letztes Quartal', 'Benutzerdefiniert']);
  });

  it('builds today and yesterday', () => {
    expect(byId('today').range).toEqual({ start: today, end: today });
    expect(byId('yesterday').range).toEqual({ start: '2026-02-14', end: '2026-02-14' });
  });

  it('includes today in the last 7 and 30 days', () => {
    expect(byId('last7').range).toEqual({ start: '2026-02-09', end: today });
    expect(daysBetween('2026-02-09', today) + 1).toBe(7);
    expect(byId('last30').range).toEqual({ start: '2026-01-17', end: today });
    expect(daysBetween('2026-01-17', today) + 1).toBe(30);
  });

  it('rolls the last-N windows back across a year and a leap day', () => {
    expect(byId('last7', '2026-01-03').range).toEqual({ start: '2025-12-28', end: '2026-01-03' });
    expect(byId('last30', '2024-03-05').range).toEqual({ start: '2024-02-05', end: '2024-03-05' });
    expect(byId('yesterday', '2024-03-01').range).toEqual({ start: '2024-02-29', end: '2024-02-29' });
  });

  it('takes the previous full calendar quarter', () => {
    expect(lastQuarter('2026-02-15')).toEqual({ start: '2025-10-01', end: '2025-12-31' });
    expect(lastQuarter('2026-01-01')).toEqual({ start: '2025-10-01', end: '2025-12-31' });
    expect(lastQuarter('2026-05-10')).toEqual({ start: '2026-01-01', end: '2026-03-31' });
    expect(lastQuarter('2026-07-01')).toEqual({ start: '2026-04-01', end: '2026-06-30' });
    expect(lastQuarter('2026-12-31')).toEqual({ start: '2026-07-01', end: '2026-09-30' });
    expect(lastQuarter('2024-04-10')).toEqual({ start: '2024-01-01', end: '2024-03-31' });
  });

  it('matches a range to a preset, or custom', () => {
    const presets = dateRangePresets(today);
    expect(matchPreset({ start: today, end: today }, presets)).toBe('today');
    expect(matchPreset({ start: '2026-02-09', end: today }, presets)).toBe('last7');
    expect(matchPreset({ start: '2026-02-01', end: '2026-02-03' }, presets)).toBe('custom');
    expect(matchPreset(null, presets)).toBeNull();
  });
});

describe('datePicker/formatting (de)', () => {
  it('formats a date without a timezone shift', () => {
    expect(formatISODate('2026-02-01', 'de-DE')).toBe('01.02.2026');
    expect(formatISODate('2026-12-31', 'de-DE')).toBe('31.12.2026');
    expect(formatISODate('2024-02-29', 'de-DE')).toBe('29.02.2024');
  });

  it('formats the spoken form and the month heading', () => {
    expect(formatISODateLong('2026-02-05', 'de-DE')).toBe('5. Februar 2026');
    expect(monthLabel(2026, 2, 'de-DE')).toBe('Februar 2026');
    expect(monthLabel(2026, 12, 'de-DE')).toBe('Dezember 2026');
  });

  it('formats a range, collapsing a one-day range to one date', () => {
    expect(formatRange({ start: '2026-02-01', end: '2026-02-07' }, 'de-DE')).toBe('01.02.2026 – 07.02.2026');
    expect(formatRange({ start: '2026-02-01', end: '2026-02-01' }, 'de-DE')).toBe('01.02.2026');
  });

  it('lists seven weekday labels in grid order', () => {
    const mon = weekdayLabels('de-DE', 1);
    expect(mon).toHaveLength(7);
    expect(mon[0]!.startsWith('Mo')).toBe(true);
    expect(mon[6]!.startsWith('So')).toBe(true);
    expect(mon.every((l) => !l.endsWith('.'))).toBe(true);
    const sun = weekdayLabels('de-DE', 0);
    expect(sun[0]!.startsWith('So')).toBe(true);
    expect(sun[1]!.startsWith('Mo')).toBe(true);
  });
});

describe('datePicker/week start by locale', () => {
  it('starts German weeks on Monday', () => {
    expect(weekStartsOnForLocale('de')).toBe(1);
    expect(weekStartsOnForLocale('de-DE')).toBe(1);
  });

  it('starts US English weeks on Sunday', () => {
    expect(weekStartsOnForLocale('en-US')).toBe(0);
  });

  it('falls back to Monday for a malformed locale', () => {
    expect(weekStartsOnForLocale('not a locale!!')).toBe(1);
  });
});
