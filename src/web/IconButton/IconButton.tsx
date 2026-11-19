import React from 'react';
import './IconButton.css';

export type IconButtonVariant = 'ghost' | 'outline' | 'primary' | 'danger';
export type IconButtonSize = 'sm' | 'md';

export interface IconButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'aria-label'> {
  /** The icon, e.g. `<Trash2 size={16} />`. Marked decorative; the label carries the meaning. */
  icon: React.ReactNode;
  /** Required: an icon alone has no name. Also the default tooltip. */
  'aria-label': string;
  variant?: IconButtonVariant;
  /** `sm` is a 28 px dense-row target, `md` the 44 px touch target. Touch screens always get 44 px. */
  size?: IconButtonSize;
  /** Toggle state for buttons that switch something on and off (sets `aria-pressed`). */
  pressed?: boolean;
}

/** Square button with only an icon: close, edit, delete, zoom, row actions. */
export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { icon, variant = 'ghost', size = 'md', pressed, className, type = 'button', title, 'aria-label': ariaLabel, ...rest },
  ref,
) {
  const classes = [
    'chaos-icon-btn',
    `chaos-icon-btn--${variant}`,
    size === 'sm' ? 'chaos-icon-btn--sm' : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <button ref={ref} type={type} className={classes} aria-label={ariaLabel} aria-pressed={pressed} title={title ?? ariaLabel} {...rest}>
      <span className="chaos-icon-btn__icon" aria-hidden="true">{icon}</span>
    </button>
  );
});
