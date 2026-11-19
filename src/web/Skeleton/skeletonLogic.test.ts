import { describe, expect, it } from 'vitest';
import { msUntilShow, shouldShowLoading } from './skeletonLogic';

describe('shouldShowLoading', () => {
  it('shows nothing before the delay has passed', () => {
    expect(shouldShowLoading(0, 300, true)).toBe(false);
    expect(shouldShowLoading(299, 300, true)).toBe(false);
  });

  it('shows once the delay has passed while still loading', () => {
    expect(shouldShowLoading(300, 300, true)).toBe(true);
    expect(shouldShowLoading(1200, 300, true)).toBe(true);
  });

  it('never shows when loading has finished', () => {
    expect(shouldShowLoading(5000, 300, false)).toBe(false);
  });

  it('shows immediately with a zero delay', () => {
    expect(shouldShowLoading(0, 0, true)).toBe(true);
  });
});

describe('msUntilShow', () => {
  it('counts down to zero and stays there', () => {
    expect(msUntilShow(0, 300)).toBe(300);
    expect(msUntilShow(120, 300)).toBe(180);
    expect(msUntilShow(300, 300)).toBe(0);
    expect(msUntilShow(900, 300)).toBe(0);
  });
});
