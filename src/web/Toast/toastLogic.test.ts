import { describe, expect, it } from 'vitest';
import {
  SWIPE_DISTANCE,
  SWIPE_VELOCITY,
  remainingAfterPause,
  resolveToastDuration,
  resolveToastPlacement,
  shouldShowCloseButton,
  shouldSwipeDismiss,
  stackDirection,
  visibleToasts,
} from './toastLogic';

describe('toast/resolveToastDuration', () => {
  it('uses the per-type default when no duration is given', () => {
    expect(resolveToastDuration('info')).toBe(4000);
    expect(resolveToastDuration('success')).toBe(4000);
    expect(resolveToastDuration('warning')).toBe(7000);
    expect(resolveToastDuration('error')).toBe(0);
  });

  it('lets an explicit duration win, including 0', () => {
    expect(resolveToastDuration('error', 2000)).toBe(2000);
    expect(resolveToastDuration('info', 0)).toBe(0);
  });

  it('falls back to the info timing for unknown types', () => {
    expect(resolveToastDuration('nope')).toBe(4000);
  });
});

describe('toast/shouldShowCloseButton', () => {
  it('shows the button when the toast stays until acknowledged', () => {
    expect(shouldShowCloseButton(undefined, 0)).toBe(true);
    expect(shouldShowCloseButton(undefined, 4000)).toBe(false);
  });

  it('lets an explicit value win', () => {
    expect(shouldShowCloseButton(false, 0)).toBe(false);
    expect(shouldShowCloseButton(true, 4000)).toBe(true);
  });
});

describe('toast/remainingAfterPause', () => {
  it('subtracts the time the timer ran', () => {
    expect(remainingAfterPause(4000, 1000, 2500)).toBe(2500);
  });

  it('never goes below zero', () => {
    expect(remainingAfterPause(1000, 0, 5000)).toBe(0);
  });

  it('ignores a clock that moved backwards', () => {
    expect(remainingAfterPause(1000, 5000, 4000)).toBe(1000);
  });
});

describe('toast/visibleToasts', () => {
  const items = [1, 2, 3, 4];

  it('keeps the oldest max toasts and queues the rest', () => {
    expect(visibleToasts(items, 3)).toEqual([1, 2, 3]);
  });

  it('shows everything when under the limit', () => {
    expect(visibleToasts([1, 2], 3)).toEqual([1, 2]);
  });

  it('shows nothing for a zero or negative limit', () => {
    expect(visibleToasts(items, 0)).toEqual([]);
    expect(visibleToasts(items, -2)).toEqual([]);
  });
});

describe('toast/shouldSwipeDismiss', () => {
  it('dismisses past the distance threshold in either direction', () => {
    expect(shouldSwipeDismiss(SWIPE_DISTANCE, 0)).toBe(true);
    expect(shouldSwipeDismiss(-SWIPE_DISTANCE - 1, 0)).toBe(true);
  });

  it('dismisses a short fast flick', () => {
    expect(shouldSwipeDismiss(10, SWIPE_VELOCITY)).toBe(true);
    expect(shouldSwipeDismiss(-10, -SWIPE_VELOCITY - 1)).toBe(true);
  });

  it('springs back a short slow drag', () => {
    expect(shouldSwipeDismiss(20, 100)).toBe(false);
  });
});

describe('toast/resolveToastPlacement', () => {
  it('defaults to top-center on mobile and bottom-right otherwise', () => {
    expect(resolveToastPlacement(undefined, true)).toBe('top-center');
    expect(resolveToastPlacement(undefined, false)).toBe('bottom-right');
  });

  it('lets an explicit position win', () => {
    expect(resolveToastPlacement('bottom-left', true)).toBe('bottom-left');
  });
});

describe('toast/stackDirection', () => {
  it('grows bottom stacks upward and top stacks downward', () => {
    expect(stackDirection('bottom-right')).toBe('column');
    expect(stackDirection('bottom-center')).toBe('column');
    expect(stackDirection('top-left')).toBe('column-reverse');
  });
});
