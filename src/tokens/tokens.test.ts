import { describe, expect, it } from 'vitest';
import { palettes, paletteKeys } from './colors';
import { getItemTypeColor, SCHEDULE_ITEM_TYPES } from './itemTypes';
import { spacing } from './spacing';
import { radii } from './radii';

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

  it('radii pill is large enough for a Chip', () => {
    expect(radii.pill).toBeGreaterThan(100);
  });
});
