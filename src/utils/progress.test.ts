import { describe, expect, it } from 'vitest';
import { clampProgress, formatPercent, spinnerPixels, spinnerStroke } from './progress';

describe('clampProgress', () => {
  it('keeps values inside 0-100', () => {
    expect(clampProgress(42)).toBe(42);
    expect(clampProgress(-5)).toBe(0);
    expect(clampProgress(250)).toBe(100);
  });

  it('treats NaN and infinities as 0', () => {
    expect(clampProgress(NaN)).toBe(0);
    expect(clampProgress(Infinity)).toBe(0);
    expect(clampProgress(-Infinity)).toBe(0);
  });
});

describe('formatPercent', () => {
  it('rounds and uses a non-breaking space before the percent sign', () => {
    expect(formatPercent(41.6)).toBe('42 %');
    expect(formatPercent(0)).toBe('0 %');
  });

  it('clamps before formatting', () => {
    expect(formatPercent(180)).toBe('100 %');
    expect(formatPercent(-3)).toBe('0 %');
  });
});

describe('spinner sizing', () => {
  it('maps named sizes to 16 / 24 / 36 px and passes numbers through', () => {
    expect(spinnerPixels('sm')).toBe(16);
    expect(spinnerPixels('md')).toBe(24);
    expect(spinnerPixels('lg')).toBe(36);
    expect(spinnerPixels(48)).toBe(48);
  });

  it('floors tiny numeric sizes at 8 px', () => {
    expect(spinnerPixels(2)).toBe(8);
  });

  it('thickens the ring from 32 px up', () => {
    expect(spinnerStroke(24)).toBe(2);
    expect(spinnerStroke(36)).toBe(3);
  });
});
