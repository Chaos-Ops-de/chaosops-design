import React from 'react';
import './Input.css';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Marks the field invalid (red border + `aria-invalid`). */
  invalid?: boolean;
  /** Marks the field as confirmed correct (green border + `data-valid`). `invalid` wins if both are set. */
  valid?: boolean;
}

/** Themed text input with tokenised border, focus ring and info glow. */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
  { invalid, valid, className, ...rest },
  ref,
) {
  return (
    <input
      ref={ref}
      className={['chaos-input', className].filter(Boolean).join(' ')}
      aria-invalid={invalid || rest['aria-invalid'] || undefined}
      data-valid={valid && !invalid ? 'true' : undefined}
      {...rest}
    />
  );
});

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
  valid?: boolean;
}

/** Multi-line sibling of {@link Input}. */
export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { invalid, valid, className, ...rest },
  ref,
) {
  return (
    <textarea
      ref={ref}
      className={['chaos-input', className].filter(Boolean).join(' ')}
      aria-invalid={invalid || rest['aria-invalid'] || undefined}
      data-valid={valid && !invalid ? 'true' : undefined}
      {...rest}
    />
  );
});
