export const radii = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
  // Hand-drawn irregular "sticker card" corner radius shared by
  // error/404 fallbacks, dialogs, and sheets.
  card: '1.2rem 1.35rem 1.15rem 1.25rem',
} as const satisfies Record<string, number | string>;

export type RadiusKey = keyof typeof radii;

/**
 * Nesting rule: an inner corner's radius is the outer radius minus the
 * padding between them — corners need space beyond the radius to read as
 * concentric rather than clipped.
 */
export function innerRadius(outer: number, padding: number): number {
  return Math.max(0, outer - padding);
}

/**
 * Selection-ring rule: a focus/selection ring drawn around an element sits
 * `gap` px outside it, so its own radius is the inner radius plus the gap.
 */
export function ringRadius(inner: number, gap: number): number {
  return inner + gap;
}

/**
 * CSS calc() form of {@link innerRadius} for use with CSS custom properties
 * on web, e.g. cssInnerRadius('var(--chaos-radius-lg)', 'var(--chaos-space-sm)').
 */
export function cssInnerRadius(outerVar: string, padVar: string): string {
  return `calc(${outerVar} - ${padVar})`;
}

/**
 * CSS calc() form of {@link ringRadius} for use with CSS custom properties
 * on web.
 */
export function cssRingRadius(innerVar: string, gapVar: string): string {
  return `calc(${innerVar} + ${gapVar})`;
}
