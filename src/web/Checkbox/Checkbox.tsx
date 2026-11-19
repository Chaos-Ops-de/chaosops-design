import React, { useEffect, useId, useImperativeHandle, useRef } from 'react';
import { Check, Minus } from 'lucide-react';
import './Checkbox.css';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  /** Text beside the box; the whole row is the click target. Without it, pass `aria-label`. */
  label?: React.ReactNode;
  /** Secondary line under the label, linked with `aria-describedby`. */
  description?: React.ReactNode;
  /** Mixed state (some children checked). Set through the DOM property, since there is no attribute for it. */
  indeterminate?: boolean;
  /** Marks the box invalid (danger border + `aria-invalid`). */
  invalid?: boolean;
}

/**
 * Checkbox on a real `<input type="checkbox">`, so forms, autofill and keyboard
 * behave natively; only the box is redrawn (lucide Check / Minus, no glyphs).
 * The visual box is 22 px but the row keeps a 44 px hit area. Because it takes
 * `id` and `aria-*` through, it also works inside `FormField`.
 */
export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { label, description, indeterminate = false, invalid, className, disabled, id, 'aria-describedby': describedBy, ...rest },
  ref,
) {
  const inputRef = useRef<HTMLInputElement>(null);
  useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

  useEffect(() => {
    if (inputRef.current) inputRef.current.indeterminate = indeterminate;
  }, [indeterminate]);

  const autoId = useId();
  const descriptionId = description != null ? `${id ?? `checkbox-${autoId}`}-description` : undefined;
  const describedByAll = [describedBy, descriptionId].filter(Boolean).join(' ') || undefined;

  return (
    <label
      className={['chaos-checkbox', className].filter(Boolean).join(' ')}
      data-disabled={disabled || undefined}
    >
      <input
        ref={inputRef}
        id={id}
        type="checkbox"
        className="chaos-checkbox__input"
        disabled={disabled}
        aria-invalid={invalid || rest['aria-invalid'] || undefined}
        aria-describedby={describedByAll}
        {...rest}
      />
      <span className="chaos-checkbox__box" aria-hidden="true">
        <Check className="chaos-checkbox__check" size={14} strokeWidth={3.5} />
        <Minus className="chaos-checkbox__minus" size={14} strokeWidth={3.5} />
      </span>
      {(label != null || description != null) && (
        <span className="chaos-checkbox__text">
          {label != null && <span className="chaos-checkbox__label">{label}</span>}
          {description != null && <span id={descriptionId} className="chaos-checkbox__description">{description}</span>}
        </span>
      )}
    </label>
  );
});
