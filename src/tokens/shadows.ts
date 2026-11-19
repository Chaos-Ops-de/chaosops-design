import type { Palette } from './colors';

export interface RNShadow {
  shadowColor: string;
  shadowOffset: { width: number; height: number };
  shadowOpacity: number;
  shadowRadius: number;
  elevation: number;
}

// Web sticker shadows key off `var(--chaos-ink)` (not a hardcoded hex) so
// they stay themed light/dark, matching how components already used them
// before this token existed.
export const cssShadows = {
  offsetInkPress: '1px 2px 0 var(--chaos-ink)',
  offsetInkSm: '2px 3px 0 var(--chaos-ink)',
  offsetInk: '2px 4px 0 var(--chaos-ink)',
  offsetInkHover: '3px 4px 0 var(--chaos-ink)',
  offsetInkMd: '3px 5px 0 var(--chaos-ink)',
  offsetInkLg: '3px 6px 0 var(--chaos-ink)',
  offsetInkMdHover: '4px 7px 0 var(--chaos-ink)',
  none: 'none',
} as const;

export type CssShadowKey = keyof typeof cssShadows;

/**
 * Soft elevation for layers that float above the page (popovers, toasts,
 * modals): a tight contact shadow plus a wide lift shadow, both in the
 * theme's neutral `--chaos-shadow-color`. Sticker offsets above stay the
 * signature look for resting surfaces; these are only for floating chrome.
 */
export const cssElevation = {
  float: '0 1px 2px var(--chaos-shadow-color), 0 8px 24px var(--chaos-shadow-color)',
  overlay: '0 1px 2px var(--chaos-shadow-color), 0 20px 50px var(--chaos-shadow-color)',
} as const;

export type CssElevationKey = keyof typeof cssElevation;

export function rnOffsetShadow(color: string, dx = 2, dy = 4): RNShadow {
  return {
    shadowColor: color,
    shadowOffset: { width: dx, height: dy },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: dy,
  };
}

export function paletteShadow(palette: Palette): RNShadow {
  return rnOffsetShadow(palette.border);
}
