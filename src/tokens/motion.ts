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

/**
 * Named motion roles, in ms. `durations` above stays for existing consumers;
 * these are the roles the interaction rules ask for (feedback is the
 * quickest, attention the slowest).
 */
export const timings = {
  /** Press, hover, toggle — feedback has to stay under 100 ms to feel instant. */
  feedback: 90,
  /** Menus and dropdowns open in under 150 ms. */
  dropdown: 120,
  /** Exits are quicker than entrances: 150–200 ms. */
  exit: 180,
  /** Entrances (pages, modals, panels): 200–300 ms. */
  enter: 250,
  /** Switch: rail color, knob slide, knob shadow and label crossfade together. */
  toggle: 250,
  /** Errors and notifications: 500–800 ms with a bounce — slow enough to notice. */
  attention: 600,
} as const;

/** Per-item delay when a list animates in (not 30, not 100). */
export const staggers = {
  list: 50,
  /** Rating stars fill left to right, one after another. */
  star: 30,
} as const;

/** Spring configs (motion `transition: { type: 'spring', … }`). */
export const springs = {
  /** Toast stacks: newer toasts push older ones up with this spring. */
  toast: { damping: 20, stiffness: 180 },
} as const;

/** Thresholds that decide whether motion or a loading state is shown at all. */
export const motionLimits = {
  /** No interaction animation should run longer than this. */
  interactionMaxMs: 300,
  /** Anything under this reads as instant; past it a spinner reads as "broken". */
  perceivedInstantMs: 400,
  /** Under this, show no loading state at all — a flash of it reads as a bug. */
  noLoadingBelowMs: 300,
  /** Spinners are for waits shorter than this; use a progress bar beyond it. */
  spinnerMaxMs: 3000,
} as const;

export type TimingKey = keyof typeof timings;

/** Auto-dismiss time per toast type in ms; `0` means it stays until acknowledged. */
export const toastDurations = {
  info: 4000,
  success: 4000,
  warning: 7000,
  error: 0,
} as const;

export type ToastDurationType = keyof typeof toastDurations;

/** Toast auto-dismiss time for a type, falling back to the `info` timing. */
export function toastDurationFor(type: string): number {
  return type in toastDurations ? toastDurations[type as ToastDurationType] : toastDurations.info;
}
