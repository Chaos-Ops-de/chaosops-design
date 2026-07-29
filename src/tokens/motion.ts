export const durations = {
  instant: 0,
  fast: 120,
  base: 200,
  slow: 320,
} as const;

export const easings = {
  standard: 'cubic-bezier(0.2, 0, 0, 1)',
  emphasized: 'cubic-bezier(0.2, 0.6, 0.1, 1)',
  decelerate: 'cubic-bezier(0, 0, 0, 1)',
  accelerate: 'cubic-bezier(0.3, 0, 1, 1)',
} as const;

export type DurationKey = keyof typeof durations;
export type EasingKey = keyof typeof easings;
