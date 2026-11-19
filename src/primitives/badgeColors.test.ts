import { describe, expect, it } from 'vitest';
import { palettes } from '../tokens/colors';
import { badgeColors, type BadgeTone } from './badgeColors';

const tones: BadgeTone[] = ['neutral', 'info', 'success', 'warning', 'danger', 'violet'];

describe('badgeColors', () => {
  it('returns all four colors for every tone, variant and theme', () => {
    for (const theme of ['light', 'dark'] as const) {
      for (const tone of tones) {
        for (const variant of ['soft', 'solid'] as const) {
          const c = badgeColors(palettes[theme], tone, variant);
          expect(c.bg && c.border && c.fg && c.dot).toBeTruthy();
        }
      }
    }
  });

  it('soft badges use the tint fill, the base border and the ink text', () => {
    const p = palettes.light;
    expect(badgeColors(p, 'success', 'soft')).toEqual({ bg: p.greenTint, border: p.green, fg: p.greenInk, dot: p.green });
    expect(badgeColors(p, 'danger', 'soft').fg).toBe(p.dangerInk);
  });

  it('solid badges fill with the base hue', () => {
    const p = palettes.dark;
    expect(badgeColors(p, 'info', 'solid').bg).toBe(p.info);
    expect(badgeColors(p, 'info', 'solid').fg).toBe(p.onAccent);
  });

  it('keeps the solid amber label dark in both themes', () => {
    for (const theme of ['light', 'dark'] as const) {
      expect(badgeColors(palettes[theme], 'warning', 'solid').fg).toBe(palettes[theme].surfaceInverse);
    }
  });

  it('neutral inverts ink and background when solid', () => {
    const p = palettes.light;
    expect(badgeColors(p, 'neutral', 'solid')).toMatchObject({ bg: p.ink, fg: p.bg });
    expect(badgeColors(p, 'neutral', 'soft').bg).toBe(p.chipInactiveBg);
  });
});
