import { describe, expect, it } from 'vitest';
import { firstEnabledIndex, nextTabIndex, tabPanelTiming, tabsLayoutMode } from './tabsLogic';

describe('nextTabIndex', () => {
  it('moves one tab with the arrows', () => {
    expect(nextTabIndex(1, 'ArrowRight', 4)).toBe(2);
    expect(nextTabIndex(1, 'ArrowLeft', 4)).toBe(0);
  });

  it('wraps at both ends', () => {
    expect(nextTabIndex(3, 'ArrowRight', 4)).toBe(0);
    expect(nextTabIndex(0, 'ArrowLeft', 4)).toBe(3);
  });

  it('jumps with Home and End', () => {
    expect(nextTabIndex(2, 'Home', 4)).toBe(0);
    expect(nextTabIndex(1, 'End', 4)).toBe(3);
  });

  it('skips disabled tabs when stepping', () => {
    const disabled = [false, true, true, false];
    expect(nextTabIndex(0, 'ArrowRight', 4, disabled)).toBe(3);
    expect(nextTabIndex(3, 'ArrowLeft', 4, disabled)).toBe(0);
    expect(nextTabIndex(3, 'ArrowRight', 4, disabled)).toBe(0);
  });

  it('lands Home and End on the first and last enabled tab', () => {
    const disabled = [true, false, false, true];
    expect(nextTabIndex(2, 'Home', 4, disabled)).toBe(1);
    expect(nextTabIndex(1, 'End', 4, disabled)).toBe(2);
  });

  it('stays put when nothing else is enabled', () => {
    const disabled = [false, true, true];
    expect(nextTabIndex(0, 'ArrowRight', 3, disabled)).toBe(0);
    expect(nextTabIndex(0, 'ArrowLeft', 3, disabled)).toBe(0);
    expect(nextTabIndex(0, 'End', 3, disabled)).toBe(0);
  });

  it('stays put when every tab is disabled', () => {
    expect(nextTabIndex(1, 'Home', 3, [true, true, true])).toBe(1);
    expect(nextTabIndex(1, 'ArrowRight', 3, [true, true, true])).toBe(1);
  });

  it('swaps the arrow directions in a right-to-left list', () => {
    expect(nextTabIndex(1, 'ArrowRight', 4, [], true)).toBe(0);
    expect(nextTabIndex(1, 'ArrowLeft', 4, [], true)).toBe(2);
  });

  it('ignores other keys and an empty list', () => {
    expect(nextTabIndex(2, 'Enter', 4)).toBe(2);
    expect(nextTabIndex(2, 'a', 4)).toBe(2);
    expect(nextTabIndex(0, 'ArrowRight', 0)).toBe(0);
  });
});

describe('firstEnabledIndex', () => {
  it('finds the first enabled tab or -1', () => {
    expect(firstEnabledIndex([true, false, false])).toBe(1);
    expect(firstEnabledIndex([true, true])).toBe(-1);
    expect(firstEnabledIndex([])).toBe(-1);
  });
});

describe('tabsLayoutMode', () => {
  it('always uses tabs on desktop', () => {
    expect(tabsLayoutMode(false, 2)).toBe('tabs');
    expect(tabsLayoutMode(false, 12)).toBe('tabs');
  });

  it('uses a segmented control under five items on a phone', () => {
    expect(tabsLayoutMode(true, 2)).toBe('segmented');
    expect(tabsLayoutMode(true, 4)).toBe('segmented');
  });

  it('uses a bottom sheet from five items up on a phone', () => {
    expect(tabsLayoutMode(true, 5)).toBe('sheet');
    expect(tabsLayoutMode(true, 8)).toBe('sheet');
  });
});

describe('tabPanelTiming', () => {
  it('fades out quicker than it fades in, with a short pause between', () => {
    expect(tabPanelTiming.pauseMs).toBe(80);
    expect(tabPanelTiming.fadeOutMs).toBeLessThan(tabPanelTiming.fadeInMs);
  });
});
