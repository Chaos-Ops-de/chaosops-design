/** Clamps a progress value into 0-100; NaN and infinities count as 0. */
export function clampProgress(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.min(100, Math.max(0, value));
}

/** German percent text with a non-breaking space: "42 %". */
export function formatPercent(value: number): string {
  return `${Math.round(clampProgress(value))} %`;
}

export type SpinnerSize = 'sm' | 'md' | 'lg' | number;

/** Diameter in px for a spinner size (numbers pass through, floored at 8). */
export function spinnerPixels(size: SpinnerSize): number {
  if (typeof size === 'number') return Math.max(8, Math.round(size));
  return size === 'sm' ? 16 : size === 'lg' ? 36 : 24;
}

/** Ring thickness in px: thin on small spinners, a little heavier on large ones. */
export function spinnerStroke(px: number): number {
  return px >= 32 ? 3 : 2;
}
