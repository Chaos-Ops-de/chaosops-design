import type { Palette } from './colors';

export interface RNShadow {
  shadowColor: string;
  shadowOffset: { width: number; height: number };
  shadowOpacity: number;
  shadowRadius: number;
  elevation: number;
}

export const cssShadows = {
  offsetInkSm: '2px 3px 0 #181818',
  offsetInk: '2px 4px 0 #181818',
  offsetInkLg: '3px 6px 0 #181818',
  none: 'none',
} as const;

export type CssShadowKey = keyof typeof cssShadows;

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
