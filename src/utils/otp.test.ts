import { describe, expect, it } from 'vitest';
import { caretForClick, isOtpComplete, nextFocusIndex, otpSlots, remainingSeconds, sanitizeOtp } from './otp';

describe('utils/otp sanitizeOtp', () => {
  it('keeps digits only by default and cuts to the length', () => {
    expect(sanitizeOtp('12a34b56')).toBe('123456');
    expect(sanitizeOtp('1234567890')).toBe('123456');
  });

  it('strips spaces and dashes from a pasted code', () => {
    expect(sanitizeOtp('123 456')).toBe('123456');
    expect(sanitizeOtp('123-456')).toBe('123456');
    expect(sanitizeOtp(' 12 3-4 56 ')).toBe('123456');
  });

  it('honours a custom length', () => {
    expect(sanitizeOtp('987654321', 'numeric', 4)).toBe('9876');
  });

  it('uppercases alphanumeric codes and allows letters', () => {
    expect(sanitizeOtp('ab-12 cd', 'alphanumeric', 6)).toBe('AB12CD');
    expect(sanitizeOtp('ab12', 'numeric')).toBe('12');
  });

  it('returns an empty string for nothing usable', () => {
    expect(sanitizeOtp('---')).toBe('');
    expect(sanitizeOtp('')).toBe('');
  });
});

describe('utils/otp slots', () => {
  it('pads missing slots with empty strings', () => {
    expect(otpSlots('12', 4)).toEqual(['1', '2', '', '']);
    expect(otpSlots('', 3)).toEqual(['', '', '']);
  });

  it('points at the first empty slot, and the last slot once full', () => {
    expect(nextFocusIndex('', 6)).toBe(0);
    expect(nextFocusIndex('123', 6)).toBe(3);
    expect(nextFocusIndex('123456', 6)).toBe(5);
  });

  it('knows when a code is complete', () => {
    expect(isOtpComplete('12345', 6)).toBe(false);
    expect(isOtpComplete('123456', 6)).toBe(true);
    expect(isOtpComplete('', 0)).toBe(false);
  });
});

describe('utils/otp caretForClick', () => {
  it('maps a click to the slot under it', () => {
    // 6 slots over 300px starting at x=100: each slot is 50px wide.
    expect(caretForClick(110, 100, 300, 6, 6)).toBe(0);
    expect(caretForClick(160, 100, 300, 6, 6)).toBe(1);
    expect(caretForClick(390, 100, 300, 6, 6)).toBe(5);
  });

  it('never goes past the end of what is typed', () => {
    expect(caretForClick(390, 100, 300, 6, 2)).toBe(2);
    expect(caretForClick(390, 100, 300, 6, 0)).toBe(0);
  });

  it('clamps clicks outside the row', () => {
    expect(caretForClick(50, 100, 300, 6, 6)).toBe(0);
    expect(caretForClick(900, 100, 300, 6, 6)).toBe(6);
  });

  it('falls back to the end for a zero-width row', () => {
    expect(caretForClick(10, 0, 0, 6, 3)).toBe(3);
  });
});

describe('utils/otp remainingSeconds', () => {
  it('counts down in whole seconds, rounding up', () => {
    expect(remainingSeconds(0, 0, 30)).toBe(30);
    expect(remainingSeconds(0, 1, 30)).toBe(30);
    expect(remainingSeconds(0, 1000, 30)).toBe(29);
    expect(remainingSeconds(0, 29_500, 30)).toBe(1);
  });

  it('stops at 0 and never goes negative', () => {
    expect(remainingSeconds(0, 30_000, 30)).toBe(0);
    expect(remainingSeconds(0, 90_000, 30)).toBe(0);
  });

  it('never exceeds the total if the clock moved backwards', () => {
    expect(remainingSeconds(10_000, 0, 30)).toBe(30);
  });
});
