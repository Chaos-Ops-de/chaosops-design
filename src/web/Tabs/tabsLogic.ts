import { timings } from '../../tokens/motion';

/**
 * Index of the tab a key press should move to. Arrows move one tab and wrap
 * at the ends, Home/End jump to the first/last, and disabled tabs are always
 * skipped. Any other key (or nothing enabled to move to) keeps `current`.
 * In a right-to-left list the arrow keys swap direction.
 */
export function nextTabIndex(
  current: number,
  key: string,
  count: number,
  disabled: readonly boolean[] = [],
  rtl = false,
): number {
  if (count <= 0) return current;
  const isEnabled = (i: number) => !disabled[i];

  const step = (dir: 1 | -1): number => {
    for (let n = 1; n <= count; n++) {
      const i = (((current + dir * n) % count) + count) % count;
      if (isEnabled(i)) return i;
    }
    return current;
  };

  switch (key) {
    case 'ArrowRight': return step(rtl ? -1 : 1);
    case 'ArrowLeft': return step(rtl ? 1 : -1);
    case 'Home': {
      for (let i = 0; i < count; i++) if (isEnabled(i)) return i;
      return current;
    }
    case 'End': {
      for (let i = count - 1; i >= 0; i--) if (isEnabled(i)) return i;
      return current;
    }
    default: return current;
  }
}

/** First enabled tab, or -1 if every tab is disabled. */
export function firstEnabledIndex(disabled: readonly boolean[]): number {
  return disabled.findIndex((d) => !d);
}

export type TabsLayoutMode = 'tabs' | 'segmented' | 'sheet';

/** Desktop: tabs. On a phone: a segmented control under five items, a bottom sheet from five up. */
export function tabsLayoutMode(isMobile: boolean, count: number): TabsLayoutMode {
  if (!isMobile) return 'tabs';
  return count < 5 ? 'segmented' : 'sheet';
}

/** Panel swap: the old content fades out, a short pause, then the new content fades in. */
export const tabPanelTiming = {
  fadeOutMs: timings.exit,
  pauseMs: 80,
  fadeInMs: timings.enter,
} as const;
