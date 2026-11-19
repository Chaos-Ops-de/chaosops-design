import type { Palette } from '../tokens/colors';

export type BadgeTone = 'neutral' | 'info' | 'success' | 'warning' | 'danger' | 'violet';
export type BadgeVariant = 'soft' | 'solid';

export interface BadgeColors {
  bg: string;
  border: string;
  fg: string;
  dot: string;
}

// Each tone maps onto a palette hue: base, `*Tint` and `*Ink`.
const HUE = { info: 'info', success: 'green', warning: 'amber', danger: 'danger', violet: 'violet' } as const;

/**
 * Colors for a badge. Soft = tint fill with text-safe ink; solid = saturated
 * fill. Amber is a light fill, so its solid label uses the fixed dark chrome
 * color instead of `onAccent` (which is white in light mode).
 */
export function badgeColors(palette: Palette, tone: BadgeTone, variant: BadgeVariant): BadgeColors {
  if (tone === 'neutral') {
    return variant === 'solid'
      ? { bg: palette.ink, border: palette.ink, fg: palette.bg, dot: palette.bg }
      : { bg: palette.chipInactiveBg, border: palette.inputBorder, fg: palette.inkSoft, dot: palette.inkMuted };
  }
  const hue = HUE[tone];
  const base = palette[hue];
  if (variant === 'solid') {
    const fg = tone === 'warning' ? palette.surfaceInverse : palette.onAccent;
    return { bg: base, border: base, fg, dot: fg };
  }
  return { bg: palette[`${hue}Tint`], border: base, fg: palette[`${hue}Ink`], dot: base };
}
