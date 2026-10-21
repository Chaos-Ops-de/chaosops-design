import { describe, expect, it } from 'vitest';
import {
  formatBytes, formatDate, formatDateInput, formatDateTime, formatElapsed, formatTime, formatUptime,
  getMinutesDifference, isTimeBetween, isValidDate, parseTimeString, timeAgo,
} from './format';

describe('formatDate / formatDateTime / formatTime', () => {
  it('formats ISO strings, timestamps and Dates in de-DE', () => {
    const iso = '2026-02-01T14:05:00';
    expect(formatDate(iso)).toBe('01.02.2026');
    expect(formatDate(new Date(iso))).toBe('01.02.2026');
    expect(formatDate(new Date(iso).getTime())).toBe('01.02.2026');
    expect(formatDateTime(iso)).toMatch(/^01\.02\.26,? 14:05$/);
    expect(formatTime(iso)).toBe('14:05');
  });

  it('returns an empty string for invalid or missing input', () => {
    expect(formatDate('nope')).toBe('');
    expect(formatDateTime(null)).toBe('');
    expect(formatTime(undefined)).toBe('');
  });
});

describe('formatBytes', () => {
  it('scales units with a decimal comma', () => {
    expect(formatBytes(null)).toBe('–');
    expect(formatBytes(512)).toBe('512 B');
    expect(formatBytes(1536)).toBe('1,5 KB');
    expect(formatBytes(5 * 1024 * 1024)).toBe('5,0 MB');
    expect(formatBytes(3 * 1024 ** 3)).toBe('3,00 GB');
  });
});

describe('formatUptime', () => {
  it('shows days+hours or hours+minutes', () => {
    expect(formatUptime(2 * 86400 + 3 * 3600 + 59)).toBe('2d 3h');
    expect(formatUptime(3 * 3600 + 20 * 60)).toBe('3h 20m');
    expect(formatUptime(0)).toBe('0h 0m');
  });
});

describe('timeAgo', () => {
  const now = Date.parse('2026-01-10T12:00:00Z');
  it('buckets minutes, hours, days', () => {
    expect(timeAgo('2026-01-10T11:59:40Z', now)).toBe('gerade eben');
    expect(timeAgo('2026-01-10T11:55:00Z', now)).toBe('vor 5 Min.');
    expect(timeAgo('2026-01-10T09:00:00Z', now)).toBe('vor 3 Std.');
    expect(timeAgo('2026-01-08T12:00:00Z', now)).toBe('vor 2 Tg.');
  });
});

describe('formatElapsed', () => {
  it('formats seconds, minutes, hours and sub-second', () => {
    expect(formatElapsed(15_000)).toBe('vor 15 Sek.');
    expect(formatElapsed(2 * 60_000)).toBe('vor 2 Min.');
    expect(formatElapsed(3 * 3_600_000)).toBe('vor 3 Std.');
    expect(formatElapsed(90_000)).toBe('vor 1 Min.');
    expect(formatElapsed(400)).toBe('gerade eben');
  });
});

describe('date input helpers', () => {
  it('formatDateInput inserts dashes progressively', () => {
    expect(formatDateInput('2026')).toBe('2026');
    expect(formatDateInput('202607')).toBe('2026-07');
    expect(formatDateInput('20260714xx')).toBe('2026-07-14');
  });

  it('isValidDate rejects impossible dates', () => {
    expect(isValidDate('2026-07-14')).toBe(true);
    expect(isValidDate('2026-02-30')).toBe(false);
    expect(isValidDate('14.07.2026')).toBe(false);
  });
});

describe('time helpers', () => {
  it('parseTimeString / getMinutesDifference / isTimeBetween', () => {
    const a = parseTimeString('09:30');
    const b = parseTimeString('11:00');
    expect(a.getHours()).toBe(9);
    expect(getMinutesDifference(a, b)).toBe(90);
    expect(isTimeBetween(parseTimeString('10:00'), a, b)).toBe(true);
    expect(isTimeBetween(parseTimeString('12:00'), a, b)).toBe(false);
  });
});
