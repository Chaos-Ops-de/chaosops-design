import React, { useId } from 'react';
import './Button.css';

export type ButtonVariant = 'primary' | 'accent' | 'success' | 'danger' | 'outline' | 'ghost' | 'link';
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';

export interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /** `primary` = info-blue fill, `accent` = amber sticker, `outline`/`ghost` are transparent, `link` reads as inline text. */
  variant?: ButtonVariant;
  /** `xs` is for dense rows (table actions, toolbars); it keeps the full touch target on touch screens. */
  size?: ButtonSize;
  /** Swaps the label for a spinner, sets `aria-busy` and blocks clicks; the button keeps its width. */
  loading?: boolean;
  /** Why the button is disabled — announced to assistive tech and shown as a tooltip. Only used while `disabled`. */
  disabledReason?: string;
  /** Stretch to the container width. */
  block?: boolean;
  /** Icon rendered before the label (e.g. a lucide icon). */
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', loading = false, disabledReason, block = false, icon, className, disabled, type = 'button', children, onClick, title, 'aria-describedby': describedBy, ...rest },
  ref,
) {
  const reasonId = useId();
  const showReason = Boolean(disabled && disabledReason);
  const classes = [
    'chaos-btn',
    `chaos-btn--${variant}`,
    size !== 'md' ? `chaos-btn--${size}` : '',
    block ? 'chaos-btn--block' : '',
    loading ? 'chaos-btn--loading' : '',
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
      aria-describedby={[showReason ? reasonId : undefined, describedBy].filter(Boolean).join(' ') || undefined}
      title={showReason ? disabledReason : title}
      onClick={loading ? (e) => e.preventDefault() : onClick}
      {...rest}
    >
      {/* The label stays in the DOM (opacity 0 while loading) so the width doesn't jump and the accessible name survives. */}
      <span className="chaos-btn__content">
        {icon}
        {children != null && <span className="chaos-btn__label">{children}</span>}
      </span>
      {loading && <span className="chaos-btn__spinner" aria-hidden="true" />}
      {showReason && <span id={reasonId} className="chaos-btn__reason">{disabledReason}</span>}
    </button>
  );
});
