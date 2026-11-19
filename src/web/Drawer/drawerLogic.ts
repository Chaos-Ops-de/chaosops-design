/** A drawer is never narrower than this (px) — a form still has to fit. */
export const DRAWER_MIN_WIDTH = 320;
/** …and never wider than this share of the viewport, or it stops being a side panel and becomes a page. */
export const DRAWER_MAX_VIEWPORT_RATIO = 0.4;
export const DRAWER_DEFAULT_WIDTH = 420;

/**
 * Width in px for a drawer on a viewport `viewportWidth` px wide: the requested
 * width, held between 320 px and 40% of the viewport. On viewports under 800 px
 * 40% is below the minimum, so the minimum wins; it still never exceeds the screen.
 */
export function clampDrawerWidth(viewportWidth: number, requested: number = DRAWER_DEFAULT_WIDTH): number {
  const viewport = Math.max(0, Number.isFinite(viewportWidth) ? viewportWidth : 0);
  const want = Number.isFinite(requested) ? requested : DRAWER_DEFAULT_WIDTH;
  const max = Math.max(DRAWER_MIN_WIDTH, viewport * DRAWER_MAX_VIEWPORT_RATIO);
  const width = Math.min(Math.max(want, DRAWER_MIN_WIDTH), max);
  return Math.min(width, viewport);
}

export type DrawerSide = 'start' | 'end';

/**
 * Where the panel rests while closed, as a translate offset. `end` is the
 * right edge in left-to-right text and the left edge in right-to-left; `start`
 * is the opposite.
 */
export function drawerSlideOffset(side: DrawerSide, rtl: boolean): '100%' | '-100%' {
  const toRight = (side === 'end') !== rtl;
  return toRight ? '100%' : '-100%';
}
