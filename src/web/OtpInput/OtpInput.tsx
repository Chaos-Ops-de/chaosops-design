import React, { useLayoutEffect, useRef, useState } from 'react';
import { caretForClick, isOtpComplete, otpSlots, sanitizeOtp, type OtpCharset } from '../../utils/otp';
import './OtpInput.css';

export type OtpStatus = 'idle' | 'error' | 'success';

export interface OtpInputProps {
  /** Number of slots (default 6). */
  length?: number;
  /** Controlled value. */
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  /** Called once each time the code becomes complete. */
  onComplete?: (code: string) => void;
  /** `numeric` shows the number keypad; `alphanumeric` allows letters and uppercases them. */
  charset?: OtpCharset;
  /** `error` shakes the slots and turns them red (clear the value and refocus yourself); `success` locks them green. */
  status?: OtpStatus;
  disabled?: boolean;
  autoFocus?: boolean;
  required?: boolean;
  id?: string;
  name?: string;
  className?: string;
  'aria-label'?: string;
  'aria-describedby'?: string;
  'aria-invalid'?: boolean | 'true' | 'false';
}

/**
 * Code input drawn as separate slots but backed by ONE real input holding one
 * string. The input sits transparently over the slots, so pasting, SMS
 * autofill (`autocomplete="one-time-code"`), backspace and the arrow keys all
 * work natively; the slots only show the value and where the caret is.
 *
 * Pasted codes are cleaned ("123 456", "123-456") and fill every slot. There
 * is deliberately no `maxLength`: the browser would cut a formatted paste
 * before it could be cleaned, so the value is trimmed here instead.
 */
export const OtpInput = React.forwardRef<HTMLInputElement, OtpInputProps>(function OtpInput(
  {
    length = 6, value, defaultValue = '', onChange, onComplete, charset = 'numeric', status = 'idle', disabled, autoFocus,
    required, id, name, className, 'aria-label': ariaLabel = 'Bestätigungscode', 'aria-describedby': describedBy, 'aria-invalid': ariaInvalid,
  },
  forwardedRef,
) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  const [typed, setTyped] = useState(() => sanitizeOtp(defaultValue, charset, length));
  const [focused, setFocused] = useState(false);
  const [caret, setCaret] = useState(0);
  const pendingCaret = useRef<number | null>(null);

  const current = sanitizeOtp(value ?? typed, charset, length);
  const locked = status === 'success';
  const invalid = status === 'error' || ariaInvalid === true || ariaInvalid === 'true';

  const setRefs = (node: HTMLInputElement | null) => {
    inputRef.current = node;
    if (typeof forwardedRef === 'function') forwardedRef(node);
    else if (forwardedRef) forwardedRef.current = node;
  };

  // Keep the caret where the user left it once React has applied the value.
  useLayoutEffect(() => {
    const el = inputRef.current;
    if (el && pendingCaret.current !== null) {
      el.setSelectionRange(pendingCaret.current, pendingCaret.current);
      pendingCaret.current = null;
    }
  }, [current]);

  const commit = (el: HTMLInputElement, next: string, nextCaret: number) => {
    // Write the DOM first so React sees nothing to reset and the caret stays put,
    // even when the typed character was rejected and the value did not change.
    el.value = next;
    el.setSelectionRange(nextCaret, nextCaret);
    pendingCaret.current = nextCaret;
    setCaret(nextCaret);
    if (next === current) return;
    if (value === undefined) setTyped(next);
    onChange?.(next);
    if (isOtpComplete(next, length)) onComplete?.(next);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const el = e.target;
    const raw = el.value;
    const at = el.selectionStart ?? raw.length;
    commit(el, sanitizeOtp(raw, charset, length), sanitizeOtp(raw.slice(0, at), charset, length).length);
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = sanitizeOtp(e.clipboardData.getData('text'), charset, length);
    if (!pasted) return;
    e.preventDefault();
    const el = e.currentTarget;
    if (pasted.length >= length) {
      commit(el, pasted, pasted.length);
      return;
    }
    const start = el.selectionStart ?? current.length;
    const end = el.selectionEnd ?? start;
    const next = sanitizeOtp(current.slice(0, start) + pasted + current.slice(end), charset, length);
    commit(el, next, Math.min(next.length, start + pasted.length));
  };

  const handleClick = (e: React.MouseEvent<HTMLInputElement>) => {
    const rect = rowRef.current?.getBoundingClientRect();
    if (!rect) return;
    const at = caretForClick(e.clientX, rect.left, rect.width, length, current.length);
    e.currentTarget.setSelectionRange(at, at);
    setCaret(at);
  };

  const slots = otpSlots(current, length);
  const activeIndex = focused && !locked ? Math.min(caret, length - 1) : -1;

  return (
    <div
      className={['chaos-otp', `chaos-otp--${status}`, className].filter(Boolean).join(' ')}
      data-disabled={disabled || undefined}
      // Codes read left to right even in a right-to-left page.
      dir="ltr"
    >
      <div className="chaos-otp__slots" ref={rowRef} aria-hidden="true">
        {slots.map((char, i) => (
          <div
            key={i}
            className="chaos-otp__slot"
            data-filled={char ? true : undefined}
            data-active={i === activeIndex || undefined}
          >
            {char}
            {i === activeIndex && !char && i === caret && <span className="chaos-otp__caret" />}
          </div>
        ))}
      </div>
      <input
        ref={setRefs}
        id={id}
        name={name}
        className="chaos-otp__input"
        type="text"
        value={current}
        disabled={disabled}
        readOnly={locked}
        required={required}
        autoFocus={autoFocus}
        autoComplete="one-time-code"
        inputMode={charset === 'numeric' ? 'numeric' : 'text'}
        pattern={charset === 'numeric' ? '[0-9]*' : '[A-Za-z0-9]*'}
        autoCapitalize={charset === 'alphanumeric' ? 'characters' : 'off'}
        autoCorrect="off"
        spellCheck={false}
        aria-label={ariaLabel}
        aria-describedby={describedBy}
        aria-invalid={invalid || undefined}
        aria-readonly={locked || undefined}
        onChange={handleChange}
        onPaste={handlePaste}
        onClick={handleClick}
        onSelect={(e) => setCaret(e.currentTarget.selectionStart ?? current.length)}
        onFocus={(e) => {
          setFocused(true);
          const end = e.currentTarget.value.length;
          e.currentTarget.setSelectionRange(end, end);
          setCaret(end);
        }}
        onBlur={() => setFocused(false)}
      />
    </div>
  );
});
