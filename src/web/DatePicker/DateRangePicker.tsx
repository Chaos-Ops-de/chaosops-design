import React, { useMemo, useRef, useState } from 'react';
import { Button } from '../Button';
import { CalendarPanel } from './CalendarPanel';
import { MOBILE_MONTH_COUNT } from './DatePicker';
import { PickerShell } from './PickerShell';
import { TypedDateField } from './TypedDateField';
import './DatePicker.css';
import {
  addMonths,
  anchorToReveal,
  applyDayClick,
  clampToBounds,
  compareISO,
  dateRangePresets,
  dragRangeEdge,
  formatISODate,
  formatRange,
  hoverPreview,
  isCompleteDraft,
  isDisabledDay,
  isValidISO,
  matchPreset,
  monthOf,
  shiftMonth,
  todayISO,
  visibleMonths,
  weekStartsOnForLocale,
  type DateRange,
  type DateRangeDraft,
  type DateRangePreset,
  type ISODate,
  type RangeEdge,
  type WeekStart,
  type YearMonth,
} from './datePickerLogic';

export interface DateRangePickerProps {
  value: DateRange | null;
  onChange: (value: DateRange | null) => void;
  min?: ISODate | null;
  max?: ISODate | null;
  locale?: string;
  placeholder?: string;
  disabled?: boolean;
  id?: string;
  'aria-label'?: string;
  /** Months side by side in the desktop panel (2 by default, 3 on wide screens). */
  months?: number;
  /** Shows the preset list (today, yesterday, last 7 days, ...). */
  presets?: boolean;
  /** Shows the Start and End fields for typing or pasting dates. */
  typeable?: boolean;
  /** Overrides "today" (for stories and tests). */
  today?: ISODate;
  /** Forces the phone (full-width sheet) or desktop (popover) layout. */
  mobile?: boolean;
  className?: string;
}

interface RangePanelProps {
  value: DateRange | null;
  min?: ISODate | null;
  max?: ISODate | null;
  locale: string;
  weekStartsOn: WeekStart;
  months: number;
  showPresets: boolean;
  typeable: boolean;
  today: ISODate;
  mobile: boolean;
  onPick: (range: DateRange) => void;
  close: () => void;
}

const RangePanel: React.FC<RangePanelProps> = ({ value, min, max, locale, weekStartsOn, months, showPresets, typeable, today, mobile, onPick, close }) => {
  const initial = clampToBounds(value?.start ?? today, min, max);
  const [anchor, setAnchor] = useState<YearMonth>(() => monthOf(initial));
  const [focusDay, setFocusDay] = useState<ISODate>(initial);
  const [draft, setDraft] = useState<DateRangeDraft>(value ?? { start: null, end: null });
  const [hover, setHover] = useState<ISODate | null>(null);
  const [dragEdge, setDragEdge] = useState<RangeEdge | null>(null);
  // A drag that moved an edge ends with a click on the day under the pointer; that click must not restart the range.
  const dragMoved = useRef(false);
  const suppressClick = useRef(false);
  const presets = useMemo(() => dateRangePresets(today), [today]);

  const shown = visibleMonths(anchor, mobile ? MOBILE_MONTH_COUNT : months);
  const complete = isCompleteDraft(draft);
  const activePreset = complete ? matchPreset(draft, presets) : null;

  const focus = (day: ISODate) => {
    setFocusDay(day);
    setAnchor((a) => anchorToReveal(day, a, shown.length));
  };
  const navigate = (delta: number) => {
    setAnchor((a) => shiftMonth(a, delta));
    setFocusDay((d) => clampToBounds(addMonths(d, delta), min, max));
  };

  const commit = () => {
    if (isCompleteDraft(draft)) {
      onPick({ start: draft.start, end: draft.end });
      close();
    }
  };

  // First click starts a range, the second ends it. The range is only applied on "Übernehmen".
  const select = (day: ISODate) => {
    if (suppressClick.current) return;
    setDraft(applyDayClick(draft, day));
    setFocusDay(day);
  };

  const choosePreset = (preset: DateRangePreset) => {
    if (!preset.range) {
      // "Custom": start over and let the calendar do the work.
      setDraft({ start: null, end: null });
      setHover(null);
      return;
    }
    if (mobile) {
      setDraft(preset.range);
      focus(preset.range.start);
      return;
    }
    // On desktop a preset is the whole answer: apply it and close.
    onPick(preset.range);
    close();
  };

  const startDrag = (edge: RangeEdge) => {
    dragMoved.current = false;
    setDragEdge(edge);
    setHover(null);
  };
  const dragOver = (day: ISODate) => {
    if (!dragEdge || !isCompleteDraft(draft) || isDisabledDay(day, min, max)) return;
    const next = dragRangeEdge({ start: draft.start, end: draft.end }, dragEdge, day);
    if (next.range.start === draft.start && next.range.end === draft.end && next.edge === dragEdge) return;
    dragMoved.current = true;
    setDraft(next.range);
    setDragEdge(next.edge);
  };
  const endDrag = () => {
    if (dragMoved.current) {
      suppressClick.current = true;
      setTimeout(() => { suppressClick.current = false; }, 0);
    }
    setDragEdge(null);
  };

  // Typing a start later than the end (or an end earlier than the start) drops the other side instead of guessing.
  const typedStart = (day: ISODate) => {
    setDraft({ start: day, end: draft.end && compareISO(day, draft.end) <= 0 ? draft.end : null });
    focus(day);
  };
  const typedEnd = (day: ISODate) => {
    setDraft({ start: draft.start && compareISO(draft.start, day) <= 0 ? draft.start : null, end: day });
    focus(day);
  };

  const status = !draft.start
    ? 'Startdatum wählen'
    : !draft.end
      ? `Von ${formatISODate(draft.start, locale)}: Enddatum wählen`
      : `${formatRange({ start: draft.start, end: draft.end }, locale)}${mobile ? '' : ' · Ränder ziehen zum Anpassen'}`;

  return (
    <div className="chaos-datepicker__body" data-mobile={mobile || undefined} data-presets={showPresets || undefined}>
      {showPresets && (
        <div role="group" aria-label="Zeitraum wählen" className="chaos-datepicker__presets">
          {presets.map((preset) => (
            <button
              key={preset.id}
              type="button"
              className="chaos-datepicker__preset"
              aria-pressed={activePreset === preset.id}
              onClick={() => choosePreset(preset)}
            >
              {preset.label}
            </button>
          ))}
        </div>
      )}
      <div className="chaos-datepicker__main">
        {typeable && (
          <div className="chaos-datepicker__fields">
            <TypedDateField label="Von" value={draft.start} locale={locale} min={min} max={max} onValid={typedStart} onEnter={commit} />
            <TypedDateField label="Bis" value={draft.end} locale={locale} min={min} max={max} onValid={typedEnd} onEnter={commit} />
          </div>
        )}
        <p className="chaos-datepicker__status" aria-live="polite">{status}</p>
        <CalendarPanel
          months={shown}
          selection={draft}
          preview={hoverPreview(draft, hover)}
          today={today}
          min={min}
          max={max}
          locale={locale}
          weekStartsOn={weekStartsOn}
          focusDay={focusDay}
          onFocusDay={focus}
          onSelectDay={select}
          onHoverDay={dragEdge ? undefined : setHover}
          onNavigate={mobile ? undefined : navigate}
          stacked={mobile}
          autoFocus
          dragEdge={dragEdge}
          onEdgeDragStart={startDrag}
          onEdgeDragOver={dragOver}
          onEdgeDragEnd={endDrag}
        />
        <div className="chaos-datepicker__footer" data-inline={!mobile || undefined}>
          <Button
            block={mobile}
            size={mobile ? 'lg' : 'md'}
            disabled={!complete}
            disabledReason="Wähle Start- und Enddatum"
            onClick={commit}
          >
            Übernehmen
          </Button>
        </div>
      </div>
    </div>
  );
};

/**
 * Date range picker with presets. Click once for the start, again for the end;
 * hovering paints the range in between and a day before the start swaps the
 * two. Works across months. Once a range exists, drag its first or last day to
 * move that edge, or type the dates into the Von and Bis fields. Nothing is
 * applied until "Übernehmen" (or Enter in a field), except a preset on desktop,
 * which is applied at once. On phones the panel is a full-width sheet.
 */
export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  value, onChange, min, max, locale = 'de-DE', placeholder = 'Zeitraum wählen', disabled, id,
  'aria-label': ariaLabel = 'Zeitraum', months = 2, presets = true, typeable = true, today = todayISO(), mobile, className,
}) => {
  const weekStartsOn = weekStartsOnForLocale(locale);
  const valid = value && isValidISO(value.start) && isValidISO(value.end) ? value : null;
  return (
    <PickerShell
      label={ariaLabel}
      text={valid ? formatRange(valid, locale) : null}
      placeholder={placeholder}
      disabled={disabled}
      id={id}
      mobile={mobile}
      className={className}
    >
      {({ close, mobile: isMobile }) => (
        <RangePanel
          value={valid}
          min={min}
          max={max}
          locale={locale}
          weekStartsOn={weekStartsOn}
          months={months}
          showPresets={presets}
          typeable={typeable}
          today={today}
          mobile={isMobile}
          onPick={(range) => onChange(range)}
          close={close}
        />
      )}
    </PickerShell>
  );
};
