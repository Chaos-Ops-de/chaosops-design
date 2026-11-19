/** Minimum touch target in px — pad the hit area and keep the icon small. */
export const touchTarget = 44;

/** Table / list row heights in px, switched by a single density toggle. */
export const rowHeights = {
  compact: 40,
  default: 48,
  comfortable: 56,
} as const;

export type RowDensity = keyof typeof rowHeights;

/**
 * Layout breakpoints in px.
 * - `phone`: the width to test phone layouts at (not a CSS breakpoint).
 * - `cards`: below this a table row becomes a card.
 * - `table`: container width a six-column table needs before it stops being cards.
 */
export const breakpoints = {
  phone: 375,
  cards: 640,
  table: 700,
} as const;

/** Grid gutters in px: tight and technical, balanced, editorial. */
export const gutters = {
  tight: 8,
  balanced: 24,
  editorial: 40,
} as const;

/** Ratio splits of a 12-column grid: hierarchy, equal, one-sided. */
export const gridSplits = {
  hierarchy: [4, 8],
  equal: [6, 6],
  aside: [3, 9],
} as const;

/** Column count as the screen narrows: 12 → 6 → 4 → 1. */
export const gridCollapse = [12, 6, 4, 1] as const;
