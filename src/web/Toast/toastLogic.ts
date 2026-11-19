import { toastDurationFor } from '../../tokens/motion';

export type ToastPlacement =
  | 'bottom-right'
  | 'bottom-left'
  | 'top-right'
  | 'top-left'
  | 'bottom-center'
  | 'top-center';

/** Distance in px a swipe must travel before it dismisses the toast. */
export const SWIPE_DISTANCE = 80;
/** Horizontal speed in px/s that dismisses even a short flick. */
export const SWIPE_VELOCITY = 500;

/** Explicit `duration` (including 0) wins; otherwise the type's default applies. */
export function resolveToastDuration(type: string, duration?: number): number {
  return duration ?? toastDurationFor(type);
}

/** A toast that never auto-dismisses must be closable, so it shows the button unless told otherwise. */
export function shouldShowCloseButton(explicit: boolean | undefined, resolvedDuration: number): boolean {
  return explicit ?? resolvedDuration <= 0;
}

/** Time left on the auto-dismiss timer after it ran from `startedAt` until `now`. */
export function remainingAfterPause(remainingMs: number, startedAt: number, now: number): number {
  return Math.max(0, remainingMs - Math.max(0, now - startedAt));
}

/** The toasts that are on screen: the oldest `max` ones. The rest wait in the queue. */
export function visibleToasts<T>(toasts: readonly T[], max: number): T[] {
  return toasts.slice(0, Math.max(0, Math.floor(max)));
}

/** A drag along x dismisses when it went far enough or was fast enough. */
export function shouldSwipeDismiss(offsetX: number, velocityX: number): boolean {
  return Math.abs(offsetX) >= SWIPE_DISTANCE || Math.abs(velocityX) >= SWIPE_VELOCITY;
}

/** Explicit position wins; otherwise top-center on phones and bottom-right elsewhere. */
export function resolveToastPlacement(position: ToastPlacement | undefined, isMobile: boolean): ToastPlacement {
  return position ?? (isMobile ? 'top-center' : 'bottom-right');
}

/**
 * Newest toast sits at the screen edge and older ones are pushed inward:
 * bottom stacks grow upward (`column`, last child at the bottom), top stacks
 * grow downward (`column-reverse`, last child at the top).
 */
export function stackDirection(placement: ToastPlacement): 'column' | 'column-reverse' {
  return placement.startsWith('bottom') ? 'column' : 'column-reverse';
}
