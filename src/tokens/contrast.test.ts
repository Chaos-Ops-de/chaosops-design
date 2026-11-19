import { describe, expect, it } from 'vitest';
import { palettes, type Palette, type ThemeName } from './colors';
import { contrastRatio, contrastThresholds, type ContrastKind } from '../utils/contrast';

interface Pair {
  fg: keyof Palette;
  bg: keyof Palette;
  kind: ContrastKind;
  /** Surface a translucent `bg` sits on (tints are rgba in dark mode). */
  under?: keyof Palette;
}

const TEXT_SURFACES: Array<keyof Palette> = ['bg', 'cardBg', 'inputBg', 'surfaceElevated', 'chipInactiveBg'];
const TEXT_INKS: Array<keyof Palette> = ['ink', 'inkSoft', 'inkMuted', 'inkFaint'];
const TINTS: Array<[keyof Palette, keyof Palette]> = [
  ['infoInk', 'infoTint'], ['greenInk', 'greenTint'], ['amberInk', 'amberTint'], ['dangerInk', 'dangerTint'],
  ['violetInk', 'violetTint'], ['pinkInk', 'pinkTint'], ['orangeInk', 'orangeTint'], ['tealInk', 'tealTint'],
];

const PAIRS: Pair[] = [
  // Body text on every surface it can sit on.
  ...TEXT_INKS.flatMap((fg) => TEXT_SURFACES.map((bg): Pair => ({ fg, bg, kind: 'text' }))),
  // Placeholders use inkMuted (inkFaint is documented as non-essential copy only).
  { fg: 'inkMuted', bg: 'inputBg', kind: 'placeholder' },
  // Labels on saturated fills.
  ...(['info', 'green', 'danger', 'violet', 'blueStrong'] as const).map((bg): Pair => ({ fg: 'onAccent', bg, kind: 'text' })),
  // The accent (amber) button label is the fixed dark chrome color so it reads in both themes.
  { fg: 'surfaceInverse', bg: 'amber', kind: 'text' },
  // Status text on its own tint.
  ...TINTS.map(([fg, bg]): Pair => ({ fg, bg, kind: 'text', under: 'cardBg' })),
  // Input borders and the focus ring are UI components.
  { fg: 'inputBorder', bg: 'inputBg', kind: 'uiComponent' },
  { fg: 'focusRing', bg: 'bg', kind: 'uiComponent' },
];

/**
 * Pairs that miss their minimum today. They are brand choices (white labels on
 * the sticker fills, the soft input border, the faint hint ink), so they are
 * recorded here instead of repainted. The test asserts this list EXACTLY: a new
 * failure breaks it, and fixing one means deleting its line.
 */
const KNOWN_EXCEPTIONS = [
  'dark:inkFaint/chipInactiveBg',
  'dark:inkFaint/cardBg',
  'dark:inkFaint/inputBg',
  'dark:inkFaint/surfaceElevated',
  'dark:inputBorder/inputBg',
  'light:focusRing/bg',
  'light:inkFaint/bg',
  'light:inkFaint/cardBg',
  'light:inkFaint/chipInactiveBg',
  'light:inkFaint/inputBg',
  'light:inkFaint/surfaceElevated',
  'light:inkMuted/chipInactiveBg',
  'light:inputBorder/inputBg',
  'light:onAccent/danger',
  'light:onAccent/green',
  'light:onAccent/info',
  'light:onAccent/violet',
].sort();

function failures(): string[] {
  const out: string[] = [];
  for (const theme of ['light', 'dark'] as ThemeName[]) {
    const p = palettes[theme];
    for (const pair of PAIRS) {
      const ratio = contrastRatio(p[pair.fg], p[pair.bg], pair.under ? p[pair.under] : '#ffffff');
      // color-mix()/var() values can't be resolved in node — skip rather than guess.
      if (Number.isNaN(ratio)) continue;
      if (ratio < contrastThresholds[pair.kind]) out.push(`${theme}:${pair.fg}/${pair.bg}`);
    }
  }
  return out.sort();
}

describe('palette contrast', () => {
  it('only the recorded brand exceptions miss their minimum ratio', () => {
    expect(failures()).toEqual(KNOWN_EXCEPTIONS);
  });

  it('keeps primary text and placeholders compliant in both themes', () => {
    for (const theme of ['light', 'dark'] as ThemeName[]) {
      const p = palettes[theme];
      for (const bg of TEXT_SURFACES) {
        expect(contrastRatio(p.ink, p[bg])).toBeGreaterThanOrEqual(contrastThresholds.text);
      }
      expect(contrastRatio(p.inkMuted, p.inputBg)).toBeGreaterThanOrEqual(contrastThresholds.placeholder);
    }
  });

  it('keeps the amber accent-button label readable in both themes', () => {
    for (const theme of ['light', 'dark'] as ThemeName[]) {
      const p = palettes[theme];
      expect(contrastRatio(p.surfaceInverse, p.amber)).toBeGreaterThanOrEqual(contrastThresholds.text);
    }
  });
});
