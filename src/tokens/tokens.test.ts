import { describe, expect, it } from 'vitest';
import { palettes, paletteKeys, resolveColorToken, brandColors } from './colors';
import { getItemTypeColor, SCHEDULE_ITEM_TYPES } from './itemTypes';
import { spacing } from './spacing';
import { radii, innerRadius, ringRadius } from './radii';
import { timings, staggers, springs, motionLimits, toastDurations, toastDurationFor, durations } from './motion';
import { touchTarget, rowHeights, breakpoints, gutters, gridCollapse } from './layout';
import { typeScale, tabularNumsCss } from './typography';
import { fontSizes } from './fonts';
import { cssElevation } from './shadows';
import { zIndex } from './zIndex';

describe('tokens/colors', () => {
  it('exposes both light and dark palettes with the same keys', () => {
    for (const key of paletteKeys) {
      expect(palettes.light[key]).toBeDefined();
      expect(palettes.dark[key]).toBeDefined();
    }
  });

  it('keeps the brand amber identical across themes', () => {
    expect(palettes.light.amber).toBe('#fbbf24');
    expect(palettes.dark.amber).toBe('#fbbf24');
  });
});

describe('tokens/colors 0.12 additions', () => {
  it('has every Palette key listed in paletteKeys, with non-empty values in both themes', () => {
    expect([...paletteKeys].sort()).toEqual(Object.keys(palettes.light).sort());
    expect(Object.keys(palettes.dark).sort()).toEqual(Object.keys(palettes.light).sort());
    for (const key of paletteKeys) {
      expect(palettes.light[key]).toBeTruthy();
      expect(palettes.dark[key]).toBeTruthy();
    }
  });

  it('keeps the inverse chrome surface fixed across themes', () => {
    expect(palettes.light.surfaceInverse).toBe('#181818');
    expect(palettes.dark.surfaceInverse).toBe('#181818');
    expect(palettes.light.onInverse).toBe('#fffbe7');
    expect(palettes.dark.onInverse).toBe('#fffbe7');
  });

  it('keeps gradient shade pairs identical across themes', () => {
    for (const k of ['amberLight', 'amberDark', 'infoLight', 'infoDark', 'dangerLight', 'dangerDark', 'tapeShade'] as const) {
      expect(palettes.light[k]).toBe(palettes.dark[k]);
    }
  });

  it('blueStrong differs from info', () => {
    expect(palettes.light.blueStrong).toBe('#2563eb');
    expect(palettes.dark.blueStrong).toBe('#3b82f6');
    expect(palettes.light.blueStrong).not.toBe(palettes.light.info);
  });

  it('exposes the Cloudflare brand color', () => {
    expect(brandColors.cloudflare).toBe('#F48120');
  });

  it('resolves new tokens through resolveColorToken', () => {
    expect(resolveColorToken('var(--chaos-blue-strong)', palettes.light)).toBe('#2563eb');
  });
});

describe('tokens/resolveColorToken', () => {
  it('resolves chaos css vars against a palette', () => {
    expect(resolveColorToken('var(--chaos-amber)', palettes.light)).toBe('#fbbf24');
    expect(resolveColorToken('var(--chaos-ink-muted)', palettes.dark)).toBe(palettes.dark.inkMuted);
  });

  it('uses the fallback for unknown vars and passes plain colors through', () => {
    expect(resolveColorToken('var(--chaos-nope, #123456)', palettes.light)).toBe('#123456');
    expect(resolveColorToken('#abcdef', palettes.light)).toBe('#abcdef');
  });
});

describe('tokens/itemTypes', () => {
  it('has 8 schedule item types', () => {
    expect(SCHEDULE_ITEM_TYPES).toHaveLength(8);
  });

  it('returns different bg for light vs dark', () => {
    const light = getItemTypeColor('session', 'light');
    const dark = getItemTypeColor('session', 'dark');
    expect(light.bg).not.toBe(dark.bg);
    expect(light.label).toBe('Session');
  });

  it('falls back to session for unknown types', () => {
    expect(getItemTypeColor('nonexistent', 'light').label).toBe('Session');
  });
});

describe('tokens/spacing + radii', () => {
  it('spacing is 4-based', () => {
    expect(spacing.xs).toBe(4);
    expect(spacing.sm).toBe(8);
    expect(spacing.md).toBe(12);
  });

  it('radii full is large enough for a Chip', () => {
    expect(radii.full).toBeGreaterThan(100);
  });

  it('radii sm is 4', () => {
    expect(radii.sm).toBe(4);
  });
});

describe('tokens/radii nesting helpers', () => {
  it('innerRadius subtracts padding from the outer radius', () => {
    expect(innerRadius(16, 4)).toBe(12);
  });

  it('innerRadius clamps at 0 instead of going negative', () => {
    expect(innerRadius(4, 10)).toBe(0);
  });

  it('ringRadius adds the gap to the inner radius', () => {
    expect(ringRadius(12, 4)).toBe(16);
  });
});

describe('tokens/motion roles', () => {
  it('keeps feedback under 100ms, dropdown under 150ms and ordered roles', () => {
    expect(timings.feedback).toBeLessThan(100);
    expect(timings.dropdown).toBeLessThan(150);
    expect(timings.exit).toBeGreaterThanOrEqual(150);
    expect(timings.exit).toBeLessThanOrEqual(200);
    expect(timings.enter).toBeGreaterThanOrEqual(200);
    expect(timings.enter).toBeLessThanOrEqual(300);
    expect(timings.attention).toBeGreaterThanOrEqual(500);
    expect(timings.attention).toBeLessThanOrEqual(800);
  });

  it('exits are faster than entrances', () => {
    expect(timings.exit).toBeLessThan(timings.enter);
  });

  it('keeps the existing durations untouched', () => {
    expect(durations).toEqual({ instant: 0, fast: 120, base: 200, slow: 320 });
  });

  it('staggers lists by 50ms and stars by 30ms; toast spring is 20/180', () => {
    expect(staggers).toEqual({ list: 50, star: 30 });
    expect(springs.toast).toEqual({ damping: 20, stiffness: 180 });
  });

  it('caps interactions at 300ms and shows no loading state under 300ms', () => {
    expect(motionLimits.interactionMaxMs).toBe(300);
    expect(motionLimits.noLoadingBelowMs).toBe(300);
    expect(motionLimits.perceivedInstantMs).toBe(400);
    expect(motionLimits.spinnerMaxMs).toBe(3000);
  });
});

describe('tokens/toast durations', () => {
  it('dismisses info at 4s, warnings at 7s, and keeps errors until acknowledged', () => {
    expect(toastDurations).toEqual({ info: 4000, success: 4000, warning: 7000, error: 0 });
  });

  it('toastDurationFor falls back to the info timing for unknown types', () => {
    expect(toastDurationFor('warning')).toBe(7000);
    expect(toastDurationFor('error')).toBe(0);
    expect(toastDurationFor('banana')).toBe(4000);
  });
});

describe('tokens/layout', () => {
  it('uses a 44px touch target and 40/48/56 row heights', () => {
    expect(touchTarget).toBe(44);
    expect(rowHeights).toEqual({ compact: 40, default: 48, comfortable: 56 });
  });

  it('names the phone, card and table breakpoints', () => {
    expect(breakpoints).toEqual({ phone: 375, cards: 640, table: 700 });
  });

  it('has 8/24/40 gutters and a 12, 6, 4, 1 grid collapse', () => {
    expect(gutters).toEqual({ tight: 8, balanced: 24, editorial: 40 });
    expect([...gridCollapse]).toEqual([12, 6, 4, 1]);
  });
});

describe('tokens/typography + elevation', () => {
  it('sets a display line at twice the body size', () => {
    expect(typeScale.display.fontSize).toBe(fontSizes.xxxl);
    expect(typeScale.display.fontSize).toBe(typeScale.body.fontSize * 2);
  });

  it('uses two weights only across the roles', () => {
    const weights = new Set(Object.values(typeScale).map((r) => r.fontWeight));
    expect(weights.size).toBe(2);
  });

  it('exposes tabular numerals', () => {
    expect(tabularNumsCss.fontVariantNumeric).toBe('tabular-nums');
  });

  it('stacks a tight contact shadow with a wide lift shadow', () => {
    expect(cssElevation.float).toContain('0 1px 2px');
    expect(cssElevation.float).toContain('0 8px 24px');
  });
});

describe('tokens/zIndex', () => {
  it('stacks select < sticky < widget < fab < drawer < modal < popover < toast < tooltip', () => {
    const order = [zIndex.dropdown, zIndex.sticky, zIndex.widget, zIndex.fab, zIndex.drawer, zIndex.modal, zIndex.popover, zIndex.toast, zIndex.tooltip];
    expect([...order].sort((a, b) => a - b)).toEqual(order);
    expect(new Set(order).size).toBe(order.length);
  });

  it('keeps the values existing layers already used', () => {
    expect(zIndex.modal).toBe(9999);
    expect(zIndex.popover).toBe(10000);
    expect(zIndex.widget).toBe(120);
  });
});
