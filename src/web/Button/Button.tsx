import React from 'react';
import './Button.css';

export type ButtonVariant = 'primary' | 'accent' | 'success' | 'danger' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /** `primary` = info-blue fill, `accent` = amber sticker, `outline`/`ghost` are transparent. */
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Shows a spinner, sets `aria-busy` and blocks clicks while keeping layout stable. */
  loading?: boolean;
  /** Stretch to the container width. */
  block?: boolean;
  /** Icon rendered before the label (e.g. a lucide icon). */
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', loading = false, block = false, icon, className, disabled, type = 'button', children, onClick, ...rest },
  ref,
) {
  const classes = [
    'chaos-btn',
    `chaos-btn--${variant}`,
    size !== 'md' ? `chaos-btn--${size}` : '',
    block ? 'chaos-btn--block' : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <button
      ref={ref}
      type={type}
      className={classes}
      disabled={disabled}
      aria-busy={loading || undefined}
      aria-disabled={loading || undefined}
      onClick={loading ? (e) => e.preventDefault() : onClick}
      {...rest}
    >
      {loading ? <span className="chaos-btn__spinner" aria-hidden="true" /> : icon}
      {children}
    </button>
  );
});
