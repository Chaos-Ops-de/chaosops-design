import { describe, expect, it } from 'vitest';
import {
  SWIPE_DISTANCE, addToast, needsCloseButton, remainingAfterPause, removeToast,
  resolveToastDuration, shouldSwipeDismiss, visibleToasts, type ToastEntry,
} from './toastQueue';

const entry = (id: string): ToastEntry => ({ id, message: id, type: 'info', duration: 4000 });

describe('resolveToastDuration', () => {
  it('uses the type default when no duration is given', () => {
    expect(resolveToastDuration('info')).toBe(4000);
    expect(resolveToastDuration('success')).toBe(4000);
    expect(resolveToastDuration('warning')).toBe(7000);
    expect(resolveToastDuration('error')).toBe(0);
  });

  it('lets an explicit duration win, including 0', () => {
    expect(resolveToastDuration('info', 1500)).toBe(1500);
    expect(resolveToastDuration('info', 0)).toBe(0);
  });
});

describe('needsCloseButton', () => {
  it('shows a close button only for toasts that stay', () => {
    expect(needsCloseButton(0)).toBe(true);
    expect(needsCloseButton(4000)).toBe(false);
  });
});

describe('queue helpers', () => {
  it('shows the oldest max toasts and queues the rest', () => {
    const list = ['a', 'b', 'c', 'd'].map(entry);
    expect(visibleToasts(list, 3).map((t) => t.id)).toEqual(['a', 'b', 'c']);
    expect(visibleToasts(list, 0)).toEqual([]);
  });

  it('adds to the end and removes by id', () => {
    const list = addToast([entry('a')], entry('b'));
    expect(list.map((t) => t.id)).toEqual(['a', 'b']);
    expect(removeToast(list, 'a').map((t) => t.id)).toEqual(['b']);
    expect(removeToast(list, 'zzz')).toHaveLength(2);
  });

  it('lets a queued toast step up when a visible one is removed', () => {
    const list = ['a', 'b', 'c', 'd'].map(entry);
    expect(visibleToasts(removeToast(list, 'a'), 3).map((t) => t.id)).toEqual(['b', 'c', 'd']);
  });
});

describe('shouldSwipeDismiss', () => {
  it('dismisses on a long sideways or upward drag', () => {
    expect(shouldSwipeDismiss(SWIPE_DISTANCE, 0, 0, 0)).toBe(true);
    expect(shouldSwipeDismiss(-SWIPE_DISTANCE, 0, 0, 0)).toBe(true);
    expect(shouldSwipeDismiss(0, -SWIPE_DISTANCE, 0, 0)).toBe(true);
  });

  it('dismisses on a fast flick', () => {
    expect(shouldSwipeDismiss(10, 0, 0.6, 0)).toBe(true);
    expect(shouldSwipeDismiss(0, -5, 0, -0.7)).toBe(true);
  });

  it('keeps the toast for a short slow drag and for a downward drag', () => {
    expect(shouldSwipeDismiss(20, -10, 0.1, -0.1)).toBe(false);
    expect(shouldSwipeDismiss(0, 200, 0, 0.1)).toBe(false);
  });
});

describe('remainingAfterPause', () => {
  it('subtracts the time that already ran and never goes negative', () => {
    expect(remainingAfterPause(4000, 1000, 2500)).toBe(2500);
    expect(remainingAfterPause(500, 0, 9000)).toBe(0);
  });
});
