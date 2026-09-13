export const radii = {
  none: 0,
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
  pill: 9999,
  // Hand-drawn irregular "sticker card" corner radius shared by
  // error/404 fallbacks, dialogs, and sheets.
  card: '1.2rem 1.35rem 1.15rem 1.25rem',
} as const satisfies Record<string, number | string>;

export type RadiusKey = keyof typeof radii;
