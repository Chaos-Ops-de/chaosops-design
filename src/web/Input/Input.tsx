import React from 'react';
import './Input.css';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Marks the field invalid (red border + `aria-invalid`). */
  invalid?: boolean;
}

/** Themed text input with tokenised border, focus ring and info glow. */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
  { invalid, className, ...rest },
  ref,
) {
  return (
    <input
      ref={ref}
      className={['chaos-input', className].filter(Boolean).join(' ')}
      aria-invalid={invalid || rest['aria-invalid'] || undefined}
      {...rest}
    />
  );
});

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
}

/** Multi-line sibling of {@link Input}. */
export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { invalid, className, ...rest },
  ref,
) {
  return (
    <textarea
      ref={ref}
      className={['chaos-input', className].filter(Boolean).join(' ')}
      aria-invalid={invalid || rest['aria-invalid'] || undefined}
      {...rest}
    />
  );
});
