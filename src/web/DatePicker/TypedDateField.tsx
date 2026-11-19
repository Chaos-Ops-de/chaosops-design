import React, { useEffect, useId, useRef, useState } from 'react';
import { Input } from '../Input';
import { formatISODate, isDisabledDay, parseTypedDate, typedDatePlaceholder, type ISODate } from './datePickerLogic';

export interface TypedDateFieldProps {
  label: string;
  /** The date the calendar currently holds; shown formatted until the user types. */
  value: ISODate | null;
  locale: string;
  min?: ISODate | null;
  max?: ISODate | null;
  /** Called each time the text becomes a real, selectable date. */
  onValid: (day: ISODate) => void;
  /** Enter on a valid date, e.g. to confirm the picker. */
  onEnter?: () => void;
}

/**
 * A text field for typing or pasting a date next to the calendar. While the
 * user types it keeps their text exactly (it never reformats mid-keystroke, so
 * the cursor stays put); once the calendar changes the date, it shows the
 * formatted value again. A date that does not exist, or lies outside min and
 * max, marks the field invalid and changes nothing.
 */
export const TypedDateField: React.FC<TypedDateFieldProps> = ({ label, value, locale, min, max, onValid, onEnter }) => {
  const id = useId();
  const [text, setText] = useState<string | null>(null);
  // The last date this field itself reported, so its own echo through `value` doesn't wipe the text.
  const reported = useRef<ISODate | null>(null);

  useEffect(() => {
    if (value !== reported.current) setText(null);
  }, [value]);

  const shown = text ?? (value ? formatISODate(value, locale) : '');
  const parsed = text !== null ? parseTypedDate(text, locale) : null;
  const selectable = parsed !== null && !isDisabledDay(parsed, min, max);
  const invalid = text !== null && text.trim() !== '' && !selectable;

  return (
    <div className="chaos-datepicker__field">
      <label className="chaos-datepicker__field-label" htmlFor={id}>{label}</label>
      <Input
        id={id}
        value={shown}
        placeholder={typedDatePlaceholder(locale)}
        autoComplete="off"
        invalid={invalid}
        aria-describedby={invalid ? `${id}-error` : undefined}
        onChange={(e) => {
          const next = e.target.value;
          setText(next);
          const day = parseTypedDate(next, locale);
          if (day && !isDisabledDay(day, min, max)) {
            reported.current = day;
            onValid(day);
          }
        }}
        onBlur={() => {
          // A finished date snaps to the formatted value; a half-typed one stays so it can be fixed.
          if (selectable || (text !== null && text.trim() === '')) setText(null);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && selectable) {
            e.preventDefault();
            onEnter?.();
          }
        }}
      />
      {invalid && (
        <span id={`${id}-error`} className="chaos-datepicker__field-error" role="alert">
          {parsed === null ? `Kein gültiges Datum (${typedDatePlaceholder(locale)})` : 'Datum nicht auswählbar'}
        </span>
      )}
    </div>
  );
};
