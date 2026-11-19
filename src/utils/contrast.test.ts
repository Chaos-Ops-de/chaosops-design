import { describe, expect, it } from 'vitest';
import { blend, contrastRatio, contrastThresholds, meetsContrast, parseColor, relativeLuminance } from './contrast';

describe('utils/contrast parseColor', () => {
  it('parses 3- and 6-digit hex', () => {
    expect(parseColor('#fff')).toEqual({ r: 255, g: 255, b: 255, a: 1 });
    expect(parseColor('#fbbf24')).toEqual({ r: 251, g: 191, b: 36, a: 1 });
  });

  it('parses rgb() and rgba()', () => {
    expect(parseColor('rgb(0, 0, 0)')).toEqual({ r: 0, g: 0, b: 0, a: 1 });
    expect(parseColor('rgba(24, 20, 14, 0.5)')).toEqual({ r: 24, g: 20, b: 14, a: 0.5 });
  });

  it('returns null for values it cannot resolve (var, color-mix)', () => {
    expect(parseColor('var(--chaos-ink)')).toBeNull();
    expect(parseColor('color-mix(in srgb, red 50%, blue)')).toBeNull();
  });
});

describe('utils/contrast ratio', () => {
  it('is 21:1 for black on white and 1:1 for identical colors', () => {
    expect(contrastRatio('#000000', '#ffffff')).toBeCloseTo(21, 5);
    expect(contrastRatio('#336699', '#336699')).toBeCloseTo(1, 5);
  });

  it('is symmetric', () => {
    expect(contrastRatio('#777777', '#ffffff')).toBeCloseTo(contrastRatio('#ffffff', '#777777'), 10);
  });

  it('puts #767676 just over 4.5:1 on white and #777777 just under', () => {
    expect(contrastRatio('#767676', '#ffffff')).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio('#777777', '#ffffff')).toBeLessThan(4.5);
  });

  it('composites a translucent foreground over the background', () => {
    // 50% black on white lands on mid grey, not on black.
    const ratio = contrastRatio('rgba(0, 0, 0, 0.5)', '#ffffff');
    expect(ratio).toBeGreaterThan(3.5);
    expect(ratio).toBeLessThan(5);
  });

  it('composites a translucent background over `under`', () => {
    const onWhite = contrastRatio('#ffffff', 'rgba(0, 0, 0, 0.16)', '#ffffff');
    const onBlack = contrastRatio('#ffffff', 'rgba(0, 0, 0, 0.16)', '#000000');
    expect(onBlack).toBeGreaterThan(onWhite);
  });

  it('is NaN for colors it cannot parse', () => {
    expect(Number.isNaN(contrastRatio('var(--x)', '#fff'))).toBe(true);
  });
});

describe('utils/contrast thresholds', () => {
  it('uses 4.5 for text and placeholders, 3 for large text and UI components', () => {
    expect(contrastThresholds.text).toBe(4.5);
    expect(contrastThresholds.placeholder).toBe(4.5);
    expect(contrastThresholds.largeText).toBe(3);
    expect(contrastThresholds.uiComponent).toBe(3);
  });

  it('meetsContrast applies the threshold for the kind', () => {
    // #949494 on white is about 3.0:1 — fine for a border, not for body text.
    expect(meetsContrast('#949494', '#ffffff', 'uiComponent')).toBe(true);
    expect(meetsContrast('#949494', '#ffffff', 'text')).toBe(false);
  });

  it('blend and luminance behave at the extremes', () => {
    expect(relativeLuminance({ r: 0, g: 0, b: 0, a: 1 })).toBe(0);
    expect(relativeLuminance({ r: 255, g: 255, b: 255, a: 1 })).toBeCloseTo(1, 5);
    expect(blend({ r: 0, g: 0, b: 0, a: 0 }, { r: 10, g: 20, b: 30, a: 1 })).toEqual({ r: 10, g: 20, b: 30, a: 1 });
  });
});
