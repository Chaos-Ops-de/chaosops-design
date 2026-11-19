import { toastDurationFor } from '../tokens/motion';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastAction {
  label: string;
  onClick: () => void;
}

export interface ToastEntry {
  id: string;
  message: string;
  type: ToastType;
  /** Resolved auto-dismiss time in ms; 0 means it stays until dismissed. */
  duration: number;
  action?: ToastAction;
}

/** Distance in px a swipe must travel before it dismisses the toast. */
export const SWIPE_DISTANCE = 60;
/** Speed in px/ms (PanResponder `vx`/`vy`) that dismisses even a short flick. */
export const SWIPE_VELOCITY = 0.5;

/** Explicit `duration` (including 0) wins; otherwise the type's default applies. */
export function resolveToastDuration(type: ToastType, duration?: number): number {
  return duration ?? toastDurationFor(type);
}

/** A toast that never auto-dismisses needs a visible close button. */
export function needsCloseButton(resolvedDuration: number): boolean {
  return resolvedDuration <= 0;
}

/** The toasts that are on screen: the oldest `max` ones. The rest wait in the queue. */
export function visibleToasts<T>(toasts: readonly T[], max: number): T[] {
  return toasts.slice(0, Math.max(0, Math.floor(max)));
}

export function addToast(list: readonly ToastEntry[], entry: ToastEntry): ToastEntry[] {
  return [...list, entry];
}

export function removeToast(list: readonly ToastEntry[], id: string): ToastEntry[] {
  return list.filter((t) => t.id !== id);
}

/** A swipe sideways or upward dismisses when it went far enough or was fast enough. */
export function shouldSwipeDismiss(dx: number, dy: number, vx: number, vy: number): boolean {
  const upDistance = Math.max(0, -dy);
  const upSpeed = Math.max(0, -vy);
  return (
    Math.abs(dx) >= SWIPE_DISTANCE ||
    upDistance >= SWIPE_DISTANCE ||
    Math.abs(vx) >= SWIPE_VELOCITY ||
    upSpeed >= SWIPE_VELOCITY
  );
}

/** Time left on the auto-dismiss timer after it ran from `startedAt` until `now`. */
export function remainingAfterPause(remainingMs: number, startedAt: number, now: number): number {
  return Math.max(0, remainingMs - Math.max(0, now - startedAt));
}
