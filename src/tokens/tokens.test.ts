import { describe, expect, it } from 'vitest';
import { palettes, paletteKeys, resolveColorToken, brandColors } from './colors';
import { getItemTypeColor, SCHEDULE_ITEM_TYPES } from './itemTypes';
import { spacing } from './spacing';
import { radii, innerRadius, ringRadius } from './radii';

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
