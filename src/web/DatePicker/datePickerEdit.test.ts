import { describe, expect, it } from 'vitest';
import { dateOrder, dragRangeEdge, parseTypedDate, typedDatePlaceholder } from './datePickerLogic';

describe('web/DatePicker dateOrder and placeholder', () => {
  it('knows the numeric order of a few locales', () => {
    expect(dateOrder('de-DE')).toEqual(['day', 'month', 'year']);
    expect(dateOrder('en-US')).toEqual(['month', 'day', 'year']);
    expect(dateOrder('ja-JP')).toEqual(['year', 'month', 'day']);
  });

  it('writes a placeholder in the locale order and language', () => {
    expect(typedDatePlaceholder('de-DE')).toBe('TT.MM.JJJJ');
    expect(typedDatePlaceholder('en-US')).toBe('MM/DD/YYYY');
  });
});

describe('web/DatePicker parseTypedDate', () => {
  it('reads the German order with dots, slashes, dashes and spaces', () => {
    expect(parseTypedDate('18.11.2026')).toBe('2026-11-18');
    expect(parseTypedDate('18/11/2026')).toBe('2026-11-18');
    expect(parseTypedDate('18-11-2026')).toBe('2026-11-18');
    expect(parseTypedDate('18 11 2026')).toBe('2026-11-18');
    expect(parseTypedDate('  8.1.2026  ')).toBe('2026-01-08');
  });

  it('reads the order of other locales', () => {
    expect(parseTypedDate('11/18/2026', 'en-US')).toBe('2026-11-18');
    expect(parseTypedDate('2026/11/18', 'ja-JP')).toBe('2026-11-18');
  });

  it('always accepts ISO', () => {
    expect(parseTypedDate('2026-11-18')).toBe('2026-11-18');
    expect(parseTypedDate('2026-1-5', 'en-US')).toBe('2026-01-05');
  });

  it('reads compact digits', () => {
    expect(parseTypedDate('18112026')).toBe('2026-11-18');
    expect(parseTypedDate('181126')).toBe('2026-11-18');
    expect(parseTypedDate('11182026', 'en-US')).toBe('2026-11-18');
  });

  it('expands two-digit years around 1970', () => {
    expect(parseTypedDate('18.11.26')).toBe('2026-11-18');
    expect(parseTypedDate('18.11.69')).toBe('2069-11-18');
    expect(parseTypedDate('18.11.70')).toBe('1970-11-18');
  });

  it('rejects dates that do not exist', () => {
    expect(parseTypedDate('31.02.2026')).toBeNull();
    expect(parseTypedDate('29.02.2026')).toBeNull();
    expect(parseTypedDate('00.01.2026')).toBeNull();
    expect(parseTypedDate('18.13.2026')).toBeNull();
  });

  it('accepts a real leap day', () => {
    expect(parseTypedDate('29.02.2028')).toBe('2028-02-29');
  });

  it('rejects text, partial input and odd years', () => {
    expect(parseTypedDate('')).toBeNull();
    expect(parseTypedDate('morgen')).toBeNull();
    expect(parseTypedDate('18.11')).toBeNull();
    expect(parseTypedDate('18.11.202')).toBeNull();
    expect(parseTypedDate('18.11.2026.5')).toBeNull();
  });
});

describe('web/DatePicker dragRangeEdge', () => {
  const range = { start: '2026-11-10', end: '2026-11-16' };

  it('moves the start edge earlier or later within the range', () => {
    expect(dragRangeEdge(range, 'start', '2026-11-05')).toEqual({ range: { start: '2026-11-05', end: '2026-11-16' }, edge: 'start' });
    expect(dragRangeEdge(range, 'start', '2026-11-14')).toEqual({ range: { start: '2026-11-14', end: '2026-11-16' }, edge: 'start' });
  });

  it('moves the end edge later or earlier within the range', () => {
    expect(dragRangeEdge(range, 'end', '2026-11-22')).toEqual({ range: { start: '2026-11-10', end: '2026-11-22' }, edge: 'end' });
    expect(dragRangeEdge(range, 'end', '2026-11-12')).toEqual({ range: { start: '2026-11-10', end: '2026-11-12' }, edge: 'end' });
  });

  it('swaps the edge when it is dragged past the other one', () => {
    expect(dragRangeEdge(range, 'start', '2026-11-20')).toEqual({ range: { start: '2026-11-16', end: '2026-11-20' }, edge: 'end' });
    expect(dragRangeEdge(range, 'end', '2026-11-03')).toEqual({ range: { start: '2026-11-03', end: '2026-11-10' }, edge: 'start' });
  });

  it('allows a one-day range by dragging onto the other edge', () => {
    expect(dragRangeEdge(range, 'start', '2026-11-16')).toEqual({ range: { start: '2026-11-16', end: '2026-11-16' }, edge: 'start' });
  });

  it('works across a month boundary', () => {
    expect(dragRangeEdge({ start: '2026-11-28', end: '2026-12-02' }, 'end', '2026-12-09').range).toEqual({ start: '2026-11-28', end: '2026-12-09' });
  });
});
