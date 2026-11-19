import { fontSizes, fontWeights } from './fonts';

export const lineHeights = {
  tight: 1.2,
  base: 1.4,
  relaxed: 1.6,
} as const;

/**
 * Type roles — a small fixed set instead of ad-hoc sizes. Each maps onto the
 * existing `fontSizes`, with one heavy weight for headings and one regular
 * weight for body copy. A display line is about twice the body size.
 */
export const typeScale = {
  display: { fontSize: fontSizes.xxxl, lineHeight: lineHeights.tight, fontWeight: fontWeights.bold },
  heading: { fontSize: fontSizes.xl, lineHeight: lineHeights.tight, fontWeight: fontWeights.bold },
  body: { fontSize: fontSizes.md, lineHeight: lineHeights.base, fontWeight: fontWeights.regular },
  small: { fontSize: fontSizes.sm, lineHeight: lineHeights.base, fontWeight: fontWeights.regular },
} as const;

export type TypeRole = keyof typeof typeScale;

/**
 * Tabular figures keep digits the same width so columns of numbers line up
 * and values don't make a table wobble as they change. Web style…
 */
export const tabularNumsCss = { fontVariantNumeric: 'tabular-nums' } as const;

/**
 * …and the React Native equivalent. Typed as a mutable array (not `as const`)
 * so it is assignable to a React Native `TextStyle` as-is.
 */
export const tabularNumsNative: { fontVariant: Array<'tabular-nums'> } = { fontVariant: ['tabular-nums'] };
