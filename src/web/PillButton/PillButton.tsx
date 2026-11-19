import React from 'react';
import './PillButton.css';

export interface PillButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  label: string;
  variant?: 'primary' | 'outline' | 'danger';
  onHaptic?: () => void;
}

/** Rounded pill action: amber fill (primary) or outlined (outline / danger). */
export const PillButton = React.forwardRef<HTMLButtonElement, PillButtonProps>(function PillButton(
  { label, variant = 'primary', onHaptic, onClick, className, type = 'button', disabled, ...rest }, ref,
) {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled && onHaptic) {
      try { onHaptic(); } catch { /* ignore haptic errors */ }
    }
    onClick?.(e);
  };
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled}
      className={['chaos-pill-btn', `chaos-pill-btn--${variant}`, className].filter(Boolean).join(' ')}
      onClick={handleClick}
      {...rest}
    >
      {label}
    </button>
  );
});
