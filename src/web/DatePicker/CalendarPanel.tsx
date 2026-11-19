import React, { useEffect, useId, useMemo, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  chunkWeeks,
  clampToBounds,
  formatISODateLong,
  isDisabledDay,
  isInRange,
  monthGrid,
  monthLabel,
  moveFocus,
  weekdayLabels,
  type DateRange,
  type DateRangeDraft,
  type ISODate,
  type RangeEdge,
  type WeekStart,
  type YearMonth,
} from './datePickerLogic';

export interface CalendarPanelProps {
  /** The months to draw, side by side (or stacked when `stacked`). */
  months: YearMonth[];
  /** The chosen day(s). A single date is `{ start: day, end: day }`. */
  selection: DateRangeDraft;
  /** Range painted while hovering a candidate end day. */
  preview?: DateRange | null;
  today: ISODate;
  min?: ISODate | null;
  max?: ISODate | null;
  locale: string;
  weekStartsOn: WeekStart;
  /** The one day in the tab order (roving tabindex). Keep it inside `months`. */
  focusDay: ISODate;
  onFocusDay: (day: ISODate) => void;
  onSelectDay: (day: ISODate) => void;
  onHoverDay?: (day: ISODate | null) => void;
  /** Month steps for the header arrows; the arrows are hidden when absent. */
  onNavigate?: (delta: number) => void;
  /** Draws the months in one scrolling column (phones). */
  stacked?: boolean;
  /** Moves focus to `focusDay` on mount (the panel just opened). */
  autoFocus?: boolean;
  /**
   * Edge dragging for a finished range: press the first or last day and drag to
   * move that edge. The edge being dragged is `dragEdge`; the parent applies the
   * move in `onEdgeDragOver` and stops in `onEdgeDragEnd`. Off when absent.
   */
  dragEdge?: RangeEdge | null;
  onEdgeDragStart?: (edge: RangeEdge) => void;
  onEdgeDragOver?: (day: ISODate) => void;
  onEdgeDragEnd?: () => void;
}

/**
 * The calendar grid shared by the single and range pickers. It owns no
 * selection state: the picker decides what a click means. Keyboard focus is a
 * roving tabindex over the days, moved with the arrow, Home/End and Page keys.
 */
export const CalendarPanel: React.FC<CalendarPanelProps> = ({
  months, selection, preview, today, min, max, locale, weekStartsOn, focusDay,
  onFocusDay, onSelectDay, onHoverDay, onNavigate, stacked = false, autoFocus = false,
  dragEdge = null, onEdgeDragStart, onEdgeDragOver, onEdgeDragEnd,
}) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const idBase = useId();
  const wantsFocus = useRef(autoFocus);
  const labels = useMemo(() => weekdayLabels(locale, weekStartsOn), [locale, weekStartsOn]);
  const range = selection.start && selection.end ? { start: selection.start, end: selection.end } : null;

  // Focus follows `focusDay` only after the user moved it (or on open), never on a plain re-render.
  useEffect(() => {
    if (!wantsFocus.current) return;
    const el = rootRef.current?.querySelector<HTMLElement>(`[data-iso="${focusDay}"]`);
    if (el) {
      el.focus();
      wantsFocus.current = false;
    }
  }, [focusDay, months]);

  // A drag is released anywhere on the page, not only over the grid.
  useEffect(() => {
    if (!dragEdge) return;
    const end = () => onEdgeDragEnd?.();
    window.addEventListener('pointerup', end);
    window.addEventListener('pointercancel', end);
    return () => {
      window.removeEventListener('pointerup', end);
      window.removeEventListener('pointercancel', end);
    };
  }, [dragEdge, onEdgeDragEnd]);

  // Touch pointers stay locked to the first element, so find the day under the finger ourselves.
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragEdge) return;
    const day = document.elementFromPoint(e.clientX, e.clientY)?.closest<HTMLElement>('[data-iso]')?.dataset.iso;
    if (day) onEdgeDragOver?.(day);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    const rtl = typeof document !== 'undefined' && getComputedStyle(e.currentTarget as Element).direction === 'rtl';
    const next = moveFocus(focusDay, e.key, { shift: e.shiftKey, weekStartsOn, rtl });
    if (!next) return;
    e.preventDefault();
    wantsFocus.current = true;
    onFocusDay(clampToBounds(next, min, max));
  };

  return (
    <div
      ref={rootRef}
      className="chaos-cal"
      data-stacked={stacked || undefined}
      data-dragging={dragEdge || undefined}
      onKeyDown={onKeyDown}
      onPointerMove={onPointerMove}
      onMouseLeave={() => onHoverDay?.(null)}
    >
      {months.map((m, index) => {
        const titleId = `${idBase}-${m.year}-${m.month}`;
        const weeks = chunkWeeks(monthGrid(m.year, m.month, weekStartsOn));
        const first = index === 0;
        const last = index === months.length - 1;
        return (
          <section key={titleId} className="chaos-cal__month" aria-labelledby={titleId}>
            <div className="chaos-cal__head">
              {!stacked && first && onNavigate ? (
                <button type="button" className="chaos-cal__nav" onClick={() => onNavigate(-1)} aria-label="Vorheriger Monat">
                  <ChevronLeft size={18} aria-hidden="true" />
                </button>
              ) : <span className="chaos-cal__nav-slot" />}
              <h3 id={titleId} className="chaos-cal__title">{monthLabel(m.year, m.month, locale)}</h3>
              {!stacked && last && onNavigate ? (
                <button type="button" className="chaos-cal__nav" onClick={() => onNavigate(1)} aria-label="Nächster Monat">
                  <ChevronRight size={18} aria-hidden="true" />
                </button>
              ) : <span className="chaos-cal__nav-slot" />}
            </div>

            <div role="grid" aria-labelledby={titleId} className="chaos-cal__grid">
              <div role="row" className="chaos-cal__row chaos-cal__weekdays">
                {labels.map((label, i) => (
                  <span key={i} role="columnheader" className="chaos-cal__weekday">{label}</span>
                ))}
              </div>
              {weeks.map((week, w) => (
                <div role="row" key={w} className="chaos-cal__row">
                  {week.map((cell) => {
                    if (!cell.inMonth) return <span key={cell.iso} role="gridcell" aria-hidden="true" className="chaos-cal__blank" />;
                    const disabled = isDisabledDay(cell.iso, min, max);
                    const isStart = selection.start === cell.iso;
                    const isEnd = selection.end === cell.iso;
                    const selected = isStart || isEnd || isInRange(cell.iso, range);
                    const inPreview = isInRange(cell.iso, preview);
                    const edgeable = Boolean(onEdgeDragStart && range && (isStart || isEnd));
                    return (
                      <button
                        key={cell.iso}
                        type="button"
                        role="gridcell"
                        className="chaos-cal__day"
                        data-iso={cell.iso}
                        data-today={cell.iso === today || undefined}
                        data-selected={selected || undefined}
                        data-start={isStart || undefined}
                        data-end={isEnd || undefined}
                        data-edge={edgeable || undefined}
                        data-in-range={(isInRange(cell.iso, range) && !isStart && !isEnd) || undefined}
                        data-preview={(inPreview && !isStart) || undefined}
                        tabIndex={cell.iso === focusDay ? 0 : -1}
                        disabled={disabled}
                        aria-selected={selected}
                        aria-current={cell.iso === today ? 'date' : undefined}
                        aria-label={formatISODateLong(cell.iso, locale)}
                        onClick={() => onSelectDay(cell.iso)}
                        onPointerDown={(e) => {
                          if (!edgeable || e.button !== 0) return;
                          // On a one-day range both edges are here: drag the end.
                          onEdgeDragStart?.(isEnd ? 'end' : 'start');
                          try { e.currentTarget.releasePointerCapture(e.pointerId); } catch { /* not captured */ }
                        }}
                        onFocus={() => { if (cell.iso !== focusDay) onFocusDay(cell.iso); }}
                        onMouseEnter={() => onHoverDay?.(cell.iso)}
                      >
                        {cell.day}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
};
