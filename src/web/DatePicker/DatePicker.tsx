import React, { useState } from 'react';
import { Button } from '../Button';
import { CalendarPanel } from './CalendarPanel';
import { PickerShell } from './PickerShell';
import { TypedDateField } from './TypedDateField';
import './DatePicker.css';
import {
  addMonths,
  anchorToReveal,
  clampToBounds,
  formatISODate,
  isValidISO,
  monthOf,
  shiftMonth,
  todayISO,
  visibleMonths,
  weekStartsOnForLocale,
  type ISODate,
  type WeekStart,
  type YearMonth,
} from './datePickerLogic';

/** Phones show a scrolling column of this many months, starting with the current one. */
export const MOBILE_MONTH_COUNT = 12;

export interface DatePickerProps {
  /** ISO calendar date ("2026-11-18") or `null` for no date. */
  value: ISODate | null;
  onChange: (value: ISODate | null) => void;
  /** Earliest and latest selectable day (ISO); days outside are dimmed and unselectable. */
  min?: ISODate | null;
  max?: ISODate | null;
  /** BCP 47 locale for month names and the week start. Defaults to German. */
  locale?: string;
  placeholder?: string;
  disabled?: boolean;
  id?: string;
  'aria-label'?: string;
  /** Months side by side in the desktop panel. */
  months?: number;
  /** Shows a field for typing or pasting the date. */
  typeable?: boolean;
  /** Overrides "today" (for stories and tests). */
  today?: ISODate;
  /** Forces the phone (full-width sheet) or desktop (popover) layout. */
  mobile?: boolean;
  className?: string;
}

interface SinglePanelProps {
  value: ISODate | null;
  min?: ISODate | null;
  max?: ISODate | null;
  locale: string;
  weekStartsOn: WeekStart;
  months: number;
  typeable: boolean;
  today: ISODate;
  mobile: boolean;
  onPick: (day: ISODate) => void;
  close: () => void;
}

const SinglePanel: React.FC<SinglePanelProps> = ({ value, min, max, locale, weekStartsOn, months, typeable, today, mobile, onPick, close }) => {
  const initial = clampToBounds(value ?? today, min, max);
  const [anchor, setAnchor] = useState<YearMonth>(() => monthOf(initial));
  const [focusDay, setFocusDay] = useState<ISODate>(initial);
  const [draft, setDraft] = useState<ISODate | null>(value);

  const shown = visibleMonths(anchor, mobile ? MOBILE_MONTH_COUNT : months);
  const focus = (day: ISODate) => {
    setFocusDay(day);
    setAnchor((a) => anchorToReveal(day, a, shown.length));
  };
  const navigate = (delta: number) => {
    setAnchor((a) => shiftMonth(a, delta));
    setFocusDay((d) => clampToBounds(addMonths(d, delta), min, max));
  };
  const select = (day: ISODate) => {
    if (mobile) {
      setDraft(day);
      setFocusDay(day);
      return;
    }
    onPick(day);
    close();
  };

  const commit = () => {
    if (draft) {
      onPick(draft);
      close();
    }
  };
  const typed = (day: ISODate) => {
    setDraft(day);
    focus(day);
  };

  return (
    <div className="chaos-datepicker__body" data-mobile={mobile || undefined}>
      <div className="chaos-datepicker__main">
      {typeable && (
        <div className="chaos-datepicker__fields">
          <TypedDateField label="Datum eingeben" value={draft} locale={locale} min={min} max={max} onValid={typed} onEnter={commit} />
        </div>
      )}
      <CalendarPanel
        months={shown}
        selection={{ start: draft, end: draft }}
        today={today}
        min={min}
        max={max}
        locale={locale}
        weekStartsOn={weekStartsOn}
        focusDay={focusDay}
        onFocusDay={focus}
        onSelectDay={select}
        onNavigate={mobile ? undefined : navigate}
        stacked={mobile}
        autoFocus
      />
      {mobile && (
        <div className="chaos-datepicker__footer">
          <Button block size="lg" disabled={!draft} disabledReason="Wähle zuerst ein Datum" onClick={commit}>
            Übernehmen
          </Button>
        </div>
      )}
      </div>
    </div>
  );
};

/**
 * Single-date picker. Dates are plain ISO calendar days ("YYYY-MM-DD"), never
 * `Date` objects, so nothing shifts across time zones. Desktop opens a popover
 * and picks on one click; phones open a full-width sheet with a confirm button.
 */
export const DatePicker: React.FC<DatePickerProps> = ({
  value, onChange, min, max, locale = 'de-DE', placeholder = 'Datum wählen', disabled, id,
  'aria-label': ariaLabel = 'Datum', months = 1, typeable = true, today = todayISO(), mobile, className,
}) => {
  const weekStartsOn = weekStartsOnForLocale(locale);
  const valid = value !== null && isValidISO(value) ? value : null;
  return (
    <PickerShell
      label={ariaLabel}
      text={valid ? formatISODate(valid, locale) : null}
      placeholder={placeholder}
      disabled={disabled}
      id={id}
      mobile={mobile}
      className={className}
    >
      {({ close, mobile: isMobile }) => (
        <SinglePanel
          value={valid}
          min={min}
          max={max}
          locale={locale}
          weekStartsOn={weekStartsOn}
          months={months}
          typeable={typeable}
          today={today}
          mobile={isMobile}
          onPick={(day) => onChange(day)}
          close={close}
        />
      )}
    </PickerShell>
  );
};
