import React, { useId } from 'react';
import { AlertCircle, Check } from 'lucide-react';
import './FormField.css';

export interface FormFieldControlProps {
  id: string;
  'aria-describedby'?: string;
  'aria-invalid'?: true;
  'data-valid'?: true;
  required?: boolean;
}

export interface FormFieldProps {
  label: React.ReactNode;
  /** Appends a red asterisk and sets `required` on the control. */
  required?: boolean;
  /** Helper text under the control. */
  hint?: React.ReactNode;
  /** Error text — also marks the control `aria-invalid` and is announced via `role="alert"`. */
  error?: React.ReactNode;
  /** Non-blocking notice (e.g. duplicate name) in amber. */
  warning?: React.ReactNode;
  /** Confirmation that the value is fine (green check). Ignored while there is an `error`. */
  valid?: React.ReactNode;
  /**
   * Keeps one line of room under the control, so showing or hiding a message
   * never shifts the layout below it.
   */
  reserveMessageSpace?: boolean;
  /** Override the generated control id. */
  id?: string;
  className?: string;
  style?: React.CSSProperties;
  /**
   * One control element (`<Input />`, `<Select />`, …) — `id`, `aria-describedby`,
   * `aria-invalid`, `data-valid` and `required` are injected — or a render function receiving those props.
   */
  children: React.ReactElement | ((props: FormFieldControlProps) => React.ReactNode);
}

/** Label + control + hint/error/warning/valid, wired together for accessibility. */
export const FormField: React.FC<FormFieldProps> = ({
  label, required, hint, error, warning, valid, reserveMessageSpace, id, className, style, children,
}) => {
  const autoId = useId();
  const controlId = id ?? `field-${autoId}`;
  const hintId = hint ? `${controlId}-hint` : undefined;
  const errorId = error ? `${controlId}-error` : undefined;
  const warningId = warning ? `${controlId}-warning` : undefined;
  const showValid = Boolean(valid) && !error;
  const validId = showValid ? `${controlId}-valid` : undefined;
  const describedBy = [errorId, warningId, validId, hintId].filter(Boolean).join(' ') || undefined;

  const controlProps: FormFieldControlProps = {
    id: controlId,
    'aria-describedby': describedBy,
    'aria-invalid': error ? true : undefined,
    'data-valid': showValid ? true : undefined,
    required: required || undefined,
  };

  const control = typeof children === 'function'
    ? children(controlProps)
    : React.cloneElement(children, controlProps as unknown as Record<string, unknown>);

  const messages = (
    <>
      {warning && <div id={warningId} className="chaos-field__warning">{warning}</div>}
      {error && (
        <div id={errorId} className="chaos-field__error" role="alert">
          <AlertCircle size={14} aria-hidden="true" className="chaos-field__icon" />
          {error}
        </div>
      )}
      {showValid && (
        <div id={validId} className="chaos-field__valid">
          <Check size={14} aria-hidden="true" className="chaos-field__icon" />
          {valid}
        </div>
      )}
      {hint && <div id={hintId} className="chaos-field__hint">{hint}</div>}
    </>
  );

  return (
    <div className={['chaos-field', className].filter(Boolean).join(' ')} style={style}>
      <label className="chaos-field__label" htmlFor={controlId}>
        {label}
        {required && <span className="chaos-field__required" aria-hidden="true">*</span>}
      </label>
      {control}
      {reserveMessageSpace ? <div className="chaos-field__messages">{messages}</div> : messages}
    </div>
  );
};
