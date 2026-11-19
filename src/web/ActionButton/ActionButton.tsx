import React from 'react';
import './ActionButton.css';

export interface ActionButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  label: string;
  /** Fill color (any CSS color); defaults to amber. Ignored for `outline`. */
  color?: string;
  borderStyle?: 'solid' | 'dashed' | 'dotted';
  leftIcon?: React.ReactNode;
  rightAdornment?: React.ReactNode;
  variant?: 'filled' | 'outline';
}

/** Flipchart-style action button: ink border, ink offset shadow, amber fill, bold display font. */
export const ActionButton = React.forwardRef<HTMLButtonElement, ActionButtonProps>(function ActionButton(
  { label, color, borderStyle = 'solid', leftIcon, rightAdornment, variant = 'filled', className, style, type = 'button', ...rest }, ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={['chaos-action-btn', `chaos-action-btn--${variant}`, className].filter(Boolean).join(' ')}
      style={{ borderStyle, ...(variant === 'filled' && color ? { background: color } : null), ...style }}
      {...rest}
    >
      {leftIcon}
      <span>{label}</span>
      {rightAdornment}
    </button>
  );
});
