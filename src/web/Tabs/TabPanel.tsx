import React, { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import { tabPanelId, tabButtonId } from './Tabs';
import { tabPanelTiming } from './tabsLogic';

export interface TabPanelProps {
  /** `id` of the tab this panel belongs to. */
  id: string;
  /** The currently active tab id (the same `value` given to `Tabs`). */
  value: string;
  children: React.ReactNode;
  /** Same `idPrefix` as the `Tabs` it belongs to. */
  idPrefix?: string;
  /**
   * Minimum height of the shown panel. Give every panel the same value (or reserve
   * the height in the parent) so the page doesn't resize in the pause between panels.
   */
  minHeight?: number | string;
  className?: string;
}

/**
 * Content for one tab. On a switch, the old panel fades out, there is a short
 * pause, then the new panel fades in — opacity only, so nothing shifts.
 * Inactive panels are removed from the page (`hidden`).
 */
export const TabPanel: React.FC<TabPanelProps> = ({ id, value, children, idPrefix = 'chaos', minHeight, className }) => {
  const active = id === value;
  const reduceMotion = useReducedMotion();
  const [rendered, setRendered] = useState(active);
  const [visible, setVisible] = useState(active);
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (reduceMotion) {
      setRendered(active);
      setVisible(active);
      return;
    }
    if (active) {
      // Wait for the outgoing panel to fade out, plus the pause, then show.
      const t = setTimeout(() => setRendered(true), tabPanelTiming.fadeOutMs + tabPanelTiming.pauseMs);
      return () => clearTimeout(t);
    }
    setVisible(false);
    const t = setTimeout(() => setRendered(false), tabPanelTiming.fadeOutMs);
    return () => clearTimeout(t);
  }, [active, reduceMotion]);

  // Fade in on the frame after it is rendered, so the opacity transition runs.
  useEffect(() => {
    if (!rendered || !active || visible) return;
    const raf = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(raf);
  }, [rendered, active, visible]);

  return (
    <div
      role="tabpanel"
      id={tabPanelId(idPrefix, id)}
      aria-labelledby={tabButtonId(idPrefix, id)}
      hidden={!rendered}
      data-visible={visible ? 'true' : 'false'}
      className={['chaos-tabpanel', className].filter(Boolean).join(' ')}
      style={{ minHeight }}
    >
      {rendered ? children : null}
    </div>
  );
};
