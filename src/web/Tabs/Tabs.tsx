import React, { useCallback, useEffect, useId, useRef, useState } from 'react';
import { motion, MotionConfig, useReducedMotion } from 'motion/react';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { useIsMobile } from '../useIsMobile';
import { Sheet } from '../Sheet';
import { firstEnabledIndex, nextTabIndex, tabsLayoutMode } from './tabsLogic';
import './Tabs.css';

export interface TabItem {
  id: string;
  label: React.ReactNode;
  disabled?: boolean;
}

export interface TabsProps {
  items: TabItem[];
  /** `id` of the active tab. */
  value: string;
  onChange: (id: string) => void;
  'aria-label'?: string;
  /** Prefix for the generated tab/panel ids; give each `Tabs` on a page its own if item ids repeat. */
  idPrefix?: string;
  className?: string;
}

/** `id` of the tab button for `itemId` — what a {@link TabPanel} labels itself by. */
export const tabButtonId = (idPrefix: string, itemId: string) => `${idPrefix}-tab-${itemId}`;
/** `id` of the panel for `itemId`. */
export const tabPanelId = (idPrefix: string, itemId: string) => `${idPrefix}-tabpanel-${itemId}`;

const SCROLL_PAD = 24;

/**
 * Tab list. The active underline slides between tabs instead of jumping;
 * Arrow keys move (wrapping at the ends), Home/End jump, disabled tabs are skipped.
 * Too many tabs stay on one line and scroll, with edge fades and chevrons on desktop.
 * On a phone: a segmented control under five tabs, a bottom sheet from five up.
 */
export const Tabs: React.FC<TabsProps> = ({ items, value, onChange, 'aria-label': ariaLabel, idPrefix = 'chaos', className }) => {
  const isMobile = useIsMobile();
  const mode = tabsLayoutMode(isMobile, items.length);
  const reduceMotion = useReducedMotion();
  const indicatorId = useId();

  const listRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [edges, setEdges] = useState({ start: false, end: false });
  const [sheetOpen, setSheetOpen] = useState(false);

  const disabledFlags = items.map((i) => !!i.disabled);
  const activeIndex = items.findIndex((i) => i.id === value);
  // Roving tabindex: the active tab is the one tab stop (or the first enabled one).
  const tabbable = activeIndex >= 0 && !disabledFlags[activeIndex] ? activeIndex : firstEnabledIndex(disabledFlags);
  const activeItem = activeIndex >= 0 ? items[activeIndex] : undefined;

  const isRtl = () => (listRef.current ? getComputedStyle(listRef.current).direction === 'rtl' : false);

  const updateEdges = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const x = Math.abs(el.scrollLeft);
    setEdges({ start: x > 1, end: x < max - 1 });
  }, []);

  // Track overflow so the fades and chevrons only show when something is cut off.
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el || mode !== 'tabs') return;
    updateEdges();
    el.addEventListener('scroll', updateEdges, { passive: true });
    const observer = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(updateEdges) : null;
    observer?.observe(el);
    return () => {
      el.removeEventListener('scroll', updateEdges);
      observer?.disconnect();
    };
  }, [mode, items.length, updateEdges]);

  // Keep the active tab in view when it changes (e.g. by keyboard or from outside).
  useEffect(() => {
    if (mode !== 'tabs') return;
    const scroller = scrollerRef.current;
    const tab = tabRefs.current[activeIndex];
    if (!scroller || !tab) return;
    const behavior: ScrollBehavior = reduceMotion ? 'auto' : 'smooth';
    if (isRtl()) {
      tab.scrollIntoView({ inline: 'nearest', block: 'nearest', behavior });
      return;
    }
    const left = tab.offsetLeft;
    const right = left + tab.offsetWidth;
    if (left < scroller.scrollLeft) scroller.scrollTo({ left: Math.max(0, left - SCROLL_PAD), behavior });
    else if (right > scroller.scrollLeft + scroller.clientWidth) {
      scroller.scrollTo({ left: right - scroller.clientWidth + SCROLL_PAD, behavior });
    }
  }, [activeIndex, mode, reduceMotion]);

  const scrollByPage = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * (isRtl() ? -1 : 1) * el.clientWidth * 0.6, behavior: reduceMotion ? 'auto' : 'smooth' });
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    const tab = (e.target as HTMLElement).closest('[role="tab"]') as HTMLButtonElement | null;
    if (!tab) return;
    const current = tabRefs.current.indexOf(tab);
    const next = nextTabIndex(current, e.key, items.length, disabledFlags, isRtl());
    if (next === current) return;
    e.preventDefault();
    tabRefs.current[next]?.focus();
    onChange(items[next]!.id);
  };

  if (mode === 'sheet') {
    return (
      <div className={['chaos-tabs', 'chaos-tabs--sheet', className].filter(Boolean).join(' ')}>
        <button
          type="button"
          id={activeItem ? tabButtonId(idPrefix, activeItem.id) : undefined}
          className="chaos-tabs__trigger"
          aria-haspopup="dialog"
          aria-expanded={sheetOpen}
          onClick={() => setSheetOpen(true)}
        >
          <span>{activeItem?.label ?? '–'}</span>
          <ChevronDown size={18} aria-hidden="true" />
        </button>
        <Sheet isOpen={sheetOpen} onClose={() => setSheetOpen(false)} title={ariaLabel ?? 'Bereich wählen'} padded={false}>
          <ul className="chaos-tabs__sheet-list">
            {items.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  className="chaos-tabs__sheet-item"
                  aria-current={item.id === value ? 'true' : undefined}
                  disabled={item.disabled}
                  onClick={() => { onChange(item.id); setSheetOpen(false); }}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </Sheet>
      </div>
    );
  }

  const segmented = mode === 'segmented';

  const tabList = (
    <div
      ref={listRef}
      role="tablist"
      aria-label={ariaLabel}
      className="chaos-tabs__list"
      onKeyDown={onKeyDown}
    >
      {items.map((item, i) => {
        const selected = item.id === value;
        return (
          <button
            key={item.id}
            ref={(el) => { tabRefs.current[i] = el; }}
            type="button"
            role="tab"
            id={tabButtonId(idPrefix, item.id)}
            aria-selected={selected}
            aria-controls={tabPanelId(idPrefix, item.id)}
            tabIndex={i === tabbable ? 0 : -1}
            disabled={item.disabled}
            className={['chaos-tabs__tab', selected ? 'chaos-tabs__tab--active' : ''].filter(Boolean).join(' ')}
            onClick={() => onChange(item.id)}
          >
            {selected && (
              <motion.span
                layoutId={indicatorId}
                className="chaos-tabs__indicator"
                transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
              />
            )}
            <span className="chaos-tabs__label">{item.label}</span>
          </button>
        );
      })}
    </div>
  );

  return (
    <MotionConfig reducedMotion="user">
      <div
        className={['chaos-tabs', segmented ? 'chaos-tabs--segmented' : '', className].filter(Boolean).join(' ')}
        data-fade-start={!segmented && edges.start ? 'true' : undefined}
        data-fade-end={!segmented && edges.end ? 'true' : undefined}
      >
        {segmented ? tabList : (
          <>
            <button
              type="button"
              className="chaos-tabs__chevron chaos-tabs__chevron--start"
              aria-label="Tabs nach links scrollen"
              tabIndex={-1}
              hidden={!edges.start}
              onClick={() => scrollByPage(-1)}
            >
              <ChevronLeft size={18} aria-hidden="true" />
            </button>
            <div ref={scrollerRef} className="chaos-tabs__scroller">{tabList}</div>
            <button
              type="button"
              className="chaos-tabs__chevron chaos-tabs__chevron--end"
              aria-label="Tabs nach rechts scrollen"
              tabIndex={-1}
              hidden={!edges.end}
              onClick={() => scrollByPage(1)}
            >
              <ChevronRight size={18} aria-hidden="true" />
            </button>
          </>
        )}
      </div>
    </MotionConfig>
  );
};
